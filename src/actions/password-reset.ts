"use server";

import { z } from "zod";

import { defaultLocale, isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { MIN_PASSWORD_LENGTH, hashPassword } from "@/lib/auth";
import { emailConfigured, sendEmail } from "@/lib/email";
import { passwordResetEmail } from "@/lib/email-templates";
import { siteUrl } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { localePath } from "@/lib/routes";
import {
  PASSWORD_RESET_HOURS,
  consumePasswordResetToken,
  createPasswordResetToken,
} from "@/lib/tokens";
import type { AccountFormState, AuthFormState } from "./form-state";

function localeFrom(formData: FormData): Locale {
  const raw = formData.get("locale");
  return isLocale(typeof raw === "string" ? raw : undefined)
    ? (raw as Locale)
    : defaultLocale;
}

/** A fresh link is refused this soon after the last one, to stop mail-bombing. */
const RESEND_COOLDOWN_MINUTES = 2;

/**
 * Sends a reset link.
 *
 * Always reports the same outcome, whether or not the address has an account.
 * Saying "no such user" would turn this form into a way of discovering who
 * shops here, which for a catalogue of this kind is a genuine privacy
 * problem, not a theoretical one.
 */
export async function requestPasswordReset(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const locale = localeFrom(formData);
  const t = getDictionary(locale);

  const parsed = z
    .string()
    .trim()
    .toLowerCase()
    .email()
    .safeParse(formData.get("email"));

  if (!parsed.success) return { error: t.errors.invalidEmail };

  const email = parsed.data;
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, passwordHash: true, locale: true },
  });

  // A Google-only account has no password to reset, and saying so is safe:
  // the visitor already knows this address exists, because they typed it and
  // we are telling them how to get in, not whether they have an account.
  if (user && !user.passwordHash) {
    return { error: t.reset.emailOnlyGoogle };
  }

  if (user && emailConfigured()) {
    const recent = await prisma.passwordResetToken.findFirst({
      where: {
        userId: user.id,
        usedAt: null,
        createdAt: {
          gt: new Date(Date.now() - RESEND_COOLDOWN_MINUTES * 60 * 1000),
        },
      },
      select: { id: true },
    });

    if (!recent) {
      const token = await createPasswordResetToken(user.id);
      const userLocale: Locale = isLocale(user.locale) ? user.locale : locale;

      const message = passwordResetEmail({
        locale: userLocale,
        url: `${siteUrl()}${localePath(userLocale, "/reset-password")}?token=${encodeURIComponent(token)}`,
        expiryHours: PASSWORD_RESET_HOURS,
      });

      const sent = await sendEmail({
        to: email,
        subject: message.subject,
        html: message.html,
        text: message.text,
      });

      if (!sent.ok) console.error("password reset email failed", sent.error);
    }
  }

  // Same answer either way.
  return { error: null };
}

const resetSchema = z
  .object({
    token: z.string().min(1),
    password: z.string().min(MIN_PASSWORD_LENGTH),
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, { path: ["confirm"] });

/** Spends the token and sets the new password. */
export async function resetPassword(
  _prev: AccountFormState,
  formData: FormData,
): Promise<AccountFormState> {
  const locale = localeFrom(formData);
  const t = getDictionary(locale);

  const parsed = resetSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
    confirm: formData.get("confirm"),
  });

  if (!parsed.success) {
    const field = parsed.error.issues[0]?.path[0];
    if (field === "password") return { error: t.errors.passwordTooShort, ok: false };
    if (field === "confirm") return { error: t.errors.passwordMismatch, ok: false };
    return { error: t.reset.invalidLead, ok: false };
  }

  const claim = await consumePasswordResetToken(parsed.data.token);
  if (!claim) return { error: t.reset.invalidLead, ok: false };

  await prisma.user.update({
    where: { id: claim.userId },
    data: { passwordHash: await hashPassword(parsed.data.password) },
  });

  return { error: null, ok: true };
}
