import Link from "next/link";

import { CheckIcon, WarningIcon } from "@/components/icons";
import { resolvePage } from "@/lib/page-locale";
import { routes } from "@/lib/routes";
import { consumeEmailVerificationToken } from "@/lib/tokens";

/**
 * Confirming is a side effect of loading this page, which is what a link in
 * an email can do. The token is single-use, so a second visit lands on the
 * "already confirmed" branch rather than an error.
 */
export default async function VerifyEmailPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { locale, t } = await resolvePage(params);
  const { token } = await searchParams;

  const result = token
    ? await consumeEmailVerificationToken(token)
    : { verified: false, alreadyVerified: false };

  const ok = result.verified;
  const title = ok
    ? result.alreadyVerified
      ? t.verify.alreadyTitle
      : t.verify.okTitle
    : t.verify.failTitle;
  const lead = ok
    ? result.alreadyVerified
      ? t.verify.alreadyLead
      : t.verify.okLead
    : t.verify.failLead;

  return (
    <div className="shell flex justify-center py-20 sm:py-28">
      <div className="w-full max-w-md text-center">
        <span
          className={`inline-flex h-12 w-12 items-center justify-center rounded-full border ${
            ok
              ? "border-sage-400/30 bg-sage-400/10"
              : "border-gold-600/35 bg-gold-500/10"
          }`}
        >
          {ok ? (
            <CheckIcon className="h-6 w-6 text-sage-400" />
          ) : (
            <WarningIcon className="h-6 w-6 text-gold-400" />
          )}
        </span>

        <h1 className="mt-6 font-display text-3xl font-semibold text-paper">
          {title}
        </h1>
        <p className="mt-3 text-paper-dim">{lead}</p>

        <div className="mt-8 flex flex-wrap justify-center gap-2.5">
          <Link href={routes.library(locale)} className="btn btn-primary">
            {t.nav.library}
          </Link>
          <Link href={routes.account(locale)} className="btn btn-secondary">
            {t.verify.toAccount}
          </Link>
        </div>
      </div>
    </div>
  );
}
