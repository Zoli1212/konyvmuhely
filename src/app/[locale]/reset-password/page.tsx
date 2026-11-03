import Link from "next/link";

import { SetNewPasswordForm } from "@/components/password-reset-forms";
import { resolvePage } from "@/lib/page-locale";
import { routes } from "@/lib/routes";
import { peekPasswordResetToken } from "@/lib/tokens";

export default async function ResetPasswordPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { locale, t } = await resolvePage(params);
  const { token } = await searchParams;

  // Checked without spending it, so a stale link says so before the visitor
  // types a password they would then lose.
  const valid = token ? await peekPasswordResetToken(token) : null;

  if (!valid || !token) {
    return (
      <div className="shell flex justify-center py-16 sm:py-24">
        <div className="w-full max-w-md">
          <h1 className="font-display text-3xl font-semibold text-paper">
            {t.reset.invalidTitle}
          </h1>
          <p className="mt-2 text-sm text-paper-dim">{t.reset.invalidLead}</p>
          <Link
            href={routes.forgotPassword(locale)}
            className="btn btn-primary mt-7"
          >
            {t.reset.requestAgain}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="shell flex justify-center py-16 sm:py-24">
      <div className="w-full max-w-md">
        <h1 className="font-display text-3xl font-semibold text-paper">
          {t.reset.setTitle}
        </h1>
        <p className="mt-2 text-sm text-paper-dim">{t.reset.setLead}</p>

        <div className="panel mt-8 p-6 sm:p-7">
          <SetNewPasswordForm
            locale={locale}
            token={token}
            labels={{
              password: t.account.newPassword,
              confirm: t.account.newPasswordConfirm,
              hint: t.auth.passwordHint,
              submit: t.reset.setButton,
              pending: t.common.loading,
              doneTitle: t.reset.doneTitle,
              doneLead: t.reset.doneLead,
              signIn: t.auth.signInButton,
              signInHref: routes.login(locale),
            }}
          />
        </div>
      </div>
    </div>
  );
}
