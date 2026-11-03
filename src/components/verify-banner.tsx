import { resendVerification } from "@/actions/email-verification";
import { WarningIcon } from "@/components/icons";
import { SubmitButton } from "@/components/submit-button";
import { getDictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { emailConfigured } from "@/lib/email";
import { prisma } from "@/lib/prisma";

/**
 * Nudges a signed-in user to confirm their address.
 *
 * The session is a JWT and does not carry the verification state, so this
 * costs one small query per page for signed-in users. It is deliberately a
 * nudge and not a gate: blocking purchases until an email round trip
 * completes would lose sales over a provider's delivery delay.
 */
export async function VerifyBanner({
  userId,
  locale,
}: {
  userId: string;
  locale: Locale;
}) {
  // Without a mail provider the banner could only ever nag, never resolve.
  if (!emailConfigured()) return null;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { emailVerified: true },
  });

  if (!user || user.emailVerified) return null;

  const t = getDictionary(locale);

  return (
    <div className="border-b border-gold-600/25 bg-gold-500/8">
      <div className="shell flex flex-wrap items-center gap-x-4 gap-y-2 py-2.5">
        <WarningIcon className="h-4 w-4 shrink-0 text-gold-400" />
        <p className="text-sm text-paper-dim">{t.verify.bannerText}</p>
        <div className="flex-1" />
        <form action={resendVerification}>
          <SubmitButton
            className="btn btn-ghost btn-sm text-gold-300"
            pendingLabel={t.common.loading}
          >
            {t.verify.bannerAction}
          </SubmitButton>
        </form>
      </div>
    </div>
  );
}
