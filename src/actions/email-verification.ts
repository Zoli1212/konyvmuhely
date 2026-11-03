"use server";

import { revalidatePath } from "next/cache";

import { isLocale, type Locale } from "@/i18n/config";
import { currentUser } from "@/lib/auth-guard";
import { emailConfigured, sendEmail } from "@/lib/email";
import { emailVerificationEmail } from "@/lib/email-templates";
import { siteUrl } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { localePath } from "@/lib/routes";
import {
  EMAIL_VERIFICATION_HOURS,
  createEmailVerificationToken,
} from "@/lib/tokens";

const RESEND_COOLDOWN_MINUTES = 2;

/**
 * Sends the confirmation link for a user's current address.
 *
 * Shared by registration and the "send again" button. Returns a boolean
 * rather than throwing: a mail failure must never undo a registration that
 * has already created the account.
 */
export async function sendVerificationEmail(userId: string): Promise<boolean> {
  if (!emailConfigured()) return false;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true, emailVerified: true, locale: true },
  });

  if (!user || user.emailVerified) return false;

  const recent = await prisma.emailVerificationToken.findFirst({
    where: {
      userId,
      usedAt: null,
      createdAt: {
        gt: new Date(Date.now() - RESEND_COOLDOWN_MINUTES * 60 * 1000),
      },
    },
    select: { id: true },
  });

  if (recent) return true;

  const token = await createEmailVerificationToken(userId, user.email);
  const locale: Locale = isLocale(user.locale) ? user.locale : "hu";

  const message = emailVerificationEmail({
    locale,
    url: `${siteUrl()}${localePath(locale, "/verify-email")}?token=${encodeURIComponent(token)}`,
    expiryHours: EMAIL_VERIFICATION_HOURS,
  });

  const sent = await sendEmail({
    to: user.email,
    subject: message.subject,
    html: message.html,
    text: message.text,
  });

  if (!sent.ok) {
    console.error("verification email failed", sent.error);
    return false;
  }
  return true;
}

/** The "send again" button in the banner. */
export async function resendVerification(): Promise<void> {
  const user = await currentUser();
  if (!user) return;

  await sendVerificationEmail(user.id);
  revalidatePath("/", "layout");
}
