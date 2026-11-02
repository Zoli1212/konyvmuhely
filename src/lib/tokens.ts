import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

import { prisma } from "./prisma";

/**
 * Single-use links for password reset and email confirmation.
 *
 * Only the SHA-256 hash of a token is stored. A token is a bearer credential:
 * anyone holding it can take over an account, so a stolen database backup
 * must not hand over working links. SHA-256 rather than bcrypt is right here
 * precisely because the token is 32 random bytes - there is nothing to brute
 * force, and lookups need to be fast.
 */

export const PASSWORD_RESET_HOURS = 2;
export const EMAIL_VERIFICATION_HOURS = 48;

function generateToken(): string {
  return randomBytes(32).toString("base64url");
}

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function hoursFromNow(hours: number): Date {
  return new Date(Date.now() + hours * 60 * 60 * 1000);
}

/** Constant-time comparison, so a hash is never leaked by timing. */
function hashesMatch(a: string, b: string): boolean {
  const left = Buffer.from(a, "hex");
  const right = Buffer.from(b, "hex");
  return left.length === right.length && timingSafeEqual(left, right);
}

// --- password reset ---

export async function createPasswordResetToken(
  userId: string,
): Promise<string> {
  const token = generateToken();

  // Asking for a new link invalidates the previous ones, so a reset email
  // forwarded or left in an inbox stops working as soon as another is sent.
  await prisma.passwordResetToken.updateMany({
    where: { userId, usedAt: null },
    data: { usedAt: new Date() },
  });

  await prisma.passwordResetToken.create({
    data: {
      userId,
      tokenHash: hashToken(token),
      expiresAt: hoursFromNow(PASSWORD_RESET_HOURS),
    },
  });

  return token;
}

/**
 * Checks a reset token without spending it, for rendering the form. A token
 * that only becomes invalid on submit would lose the typed password.
 */
export async function peekPasswordResetToken(
  token: string,
): Promise<{ userId: string } | null> {
  const row = await prisma.passwordResetToken.findUnique({
    where: { tokenHash: hashToken(token) },
    select: { userId: true, tokenHash: true, usedAt: true, expiresAt: true },
  });

  if (!row || row.usedAt || row.expiresAt < new Date()) return null;
  if (!hashesMatch(row.tokenHash, hashToken(token))) return null;

  return { userId: row.userId };
}

/**
 * Spends a reset token. The update is conditional on it still being unused,
 * so two submissions of the same link cannot both succeed.
 */
export async function consumePasswordResetToken(
  token: string,
): Promise<{ userId: string } | null> {
  const row = await prisma.passwordResetToken.findUnique({
    where: { tokenHash: hashToken(token) },
    select: { id: true, userId: true, usedAt: true, expiresAt: true },
  });

  if (!row || row.usedAt || row.expiresAt < new Date()) return null;

  const claimed = await prisma.passwordResetToken.updateMany({
    where: { id: row.id, usedAt: null },
    data: { usedAt: new Date() },
  });

  return claimed.count === 1 ? { userId: row.userId } : null;
}

// --- email verification ---

export async function createEmailVerificationToken(
  userId: string,
  email: string,
): Promise<string> {
  const token = generateToken();

  await prisma.emailVerificationToken.updateMany({
    where: { userId, usedAt: null },
    data: { usedAt: new Date() },
  });

  await prisma.emailVerificationToken.create({
    data: {
      userId,
      email,
      tokenHash: hashToken(token),
      expiresAt: hoursFromNow(EMAIL_VERIFICATION_HOURS),
    },
  });

  return token;
}

/**
 * Spends a confirmation token and marks the address verified - but only if it
 * is still the address on the account. Otherwise an old link, sent before the
 * user changed their email, would confirm an address they have abandoned.
 */
export async function consumeEmailVerificationToken(
  token: string,
): Promise<{ verified: boolean; alreadyVerified: boolean }> {
  const row = await prisma.emailVerificationToken.findUnique({
    where: { tokenHash: hashToken(token) },
    select: {
      id: true,
      userId: true,
      email: true,
      usedAt: true,
      expiresAt: true,
      user: { select: { email: true, emailVerified: true } },
    },
  });

  if (!row) return { verified: false, alreadyVerified: false };

  if (row.user.emailVerified && row.user.email === row.email) {
    return { verified: true, alreadyVerified: true };
  }

  if (row.usedAt || row.expiresAt < new Date()) {
    return { verified: false, alreadyVerified: false };
  }

  if (row.user.email !== row.email) {
    return { verified: false, alreadyVerified: false };
  }

  const claimed = await prisma.emailVerificationToken.updateMany({
    where: { id: row.id, usedAt: null },
    data: { usedAt: new Date() },
  });

  if (claimed.count !== 1) return { verified: false, alreadyVerified: false };

  await prisma.user.update({
    where: { id: row.userId },
    data: { emailVerified: new Date() },
  });

  return { verified: true, alreadyVerified: false };
}
