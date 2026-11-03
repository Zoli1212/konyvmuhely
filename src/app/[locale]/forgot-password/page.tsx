import Link from "next/link";

import { RequestResetForm } from "@/components/password-reset-forms";
import { ArrowLeftIcon } from "@/components/icons";
import { resolvePage } from "@/lib/page-locale";
import { routes } from "@/lib/routes";

export default async function ForgotPasswordPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale, t } = await resolvePage(params);

  return (
    <div className="shell flex justify-center py-16 sm:py-24">
      <div className="w-full max-w-md">
        <h1 className="font-display text-3xl font-semibold text-paper">
          {t.reset.requestTitle}
        </h1>
        <p className="mt-2 text-sm text-paper-dim">{t.reset.requestLead}</p>

        <div className="panel mt-8 p-6 sm:p-7">
          <RequestResetForm
            locale={locale}
            labels={{
              email: t.auth.email,
              submit: t.reset.requestButton,
              pending: t.common.loading,
              sentTitle: t.reset.requestSentTitle,
              sentLead: t.reset.requestSentLead,
            }}
          />
        </div>

        <Link
          href={routes.login(locale)}
          className="mt-6 inline-flex items-center gap-1.5 text-sm text-mute transition-colors hover:text-gold-300"
        >
          <ArrowLeftIcon className="h-3.5 w-3.5" />
          {t.reset.backToSignIn}
        </Link>
      </div>
    </div>
  );
}
