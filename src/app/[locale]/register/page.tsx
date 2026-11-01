import { redirect } from "next/navigation";

import { SignUpForm } from "@/components/auth-forms";
import { AuthFooterLink, AuthShell } from "@/components/auth-shell";
import { currentUser } from "@/lib/auth-guard";
import { googleEnabled } from "@/lib/env";
import { resolvePage } from "@/lib/page-locale";
import { routes } from "@/lib/routes";

export default async function RegisterPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ next?: string }>;
}) {
  const { locale, t } = await resolvePage(params);
  const { next } = await searchParams;

  const user = await currentUser();
  if (user) redirect(next ?? routes.library(locale));

  return (
    <AuthShell
      title={t.auth.signUpTitle}
      lead={t.auth.signUpLead}
      locale={locale}
      next={next}
      googleEnabled={googleEnabled()}
      googleLabel={t.auth.googleSignUp}
      googleUnavailable={t.auth.googleUnavailable}
      dividerLabel={t.auth.orContinueWith}
      footer={
        <AuthFooterLink
          question={t.auth.hasAccount}
          linkLabel={t.auth.signInLink}
          href={
            next
              ? `${routes.login(locale)}?next=${encodeURIComponent(next)}`
              : routes.login(locale)
          }
        />
      }
    >
      <SignUpForm
        locale={locale}
        next={next}
        labels={{
          name: t.auth.name,
          email: t.auth.email,
          password: t.auth.password,
          passwordConfirm: t.auth.passwordConfirm,
          passwordHint: t.auth.passwordHint,
          submit: t.auth.signUpButton,
          pending: t.common.loading,
        }}
      />
    </AuthShell>
  );
}
