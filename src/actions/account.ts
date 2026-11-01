"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { defaultLocale, isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { MIN_PASSWORD_LENGTH, hashPassword } from "@/lib/auth";
import { currentUser } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import type { AccountFormState } from "./form-state";

function localeFrom(formData: FormData): Locale {
  const raw = formData.get("locale");
  return isLocale(typeof raw === "string" ? raw : undefined)
    ? (raw as Locale)
    : defaultLocale;
}

const schema = z
  .object({
    current: z.string().min(1),
    next: z.string().min(MIN_PASSWORD_LENGTH),
    confirm: z.string(),
  })
  .refine((data) => data.next === data.confirm, { path: ["confirm"] });

/**
 * Changes the signed-in user's password.
 *
 * Requires the current password even though the session already proves
 * identity: it means a borrowed, unlocked browser cannot be used to take the
 * account over.
 */
export async function changePassword(
  _prev: AccountFormState,
  formData: FormData,
): Promise<AccountFormState> {
  const locale = localeFrom(formData);
  const t = getDictionary(locale);

  const user = await currentUser();
  if (!user) return { error: t.errors.signInRequired, ok: false };

  const parsed = schema.safeParse({
    current: formData.get("current"),
    next: formData.get("next"),
    confirm: formData.get("confirm"),
  });

  if (!parsed.success) {
    const field = parsed.error.issues[0]?.path[0];
    if (field === "next") return { error: t.errors.passwordTooShort, ok: false };
    if (field === "confirm")
      return { error: t.errors.passwordMismatch, ok: false };
    return { error: t.errors.fieldRequired, ok: false };
  }

  const record = await prisma.user.findUnique({
    where: { id: user.id },
    select: { passwordHash: true },
  });

  if (!record?.passwordHash) {
    // A Google-only account has no password to change; setting one here would
    // be a different feature with its own verification requirements.
    return { error: t.account.googleOnly, ok: false };
  }

  const valid = await bcrypt.compare(parsed.data.current, record.passwordHash);
  if (!valid) return { error: t.account.wrongCurrentPassword, ok: false };

  if (parsed.data.next === parsed.data.current) {
    return { error: t.account.samePassword, ok: false };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: await hashPassword(parsed.data.next) },
  });

  // Any outstanding reset links for this account are now meaningless.
  await prisma.passwordResetToken.updateMany({
    where: { userId: user.id, usedAt: null },
    data: { usedAt: new Date() },
  });

  revalidatePath("/", "layout");
  return { error: null, ok: true };
}
