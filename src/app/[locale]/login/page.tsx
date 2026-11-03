import Link from "next/link";
import { redirect } from "next/navigation";

import { SignInForm } from "@/components/auth-forms";
import { AuthFooterLink, AuthShell } from "@/components/auth-shell";
import { currentUser } from "@/lib/auth-guard";
import { googleEnabled } from "@/lib/env";
import { resolvePage } from "@/lib/page-locale";
import { routes } from "@/lib/routes";

export default async function LoginPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { locale, t } = await resolvePage(params);
  const { next, error } = await searchParams;

  const user = await currentUser();
  if (user) redirect(next ?? routes.library(locale));

  // Auth.js sends OAuth failures back here as ?error=...
  const initialError = error ? t.errors.generic : null;

  return (
    <AuthShell
      title={t.auth.signInTitle}
      lead={t.auth.signInLead}
      locale={locale}
      next={next}
      googleEnabled={googleEnabled()}
      googleLabel={t.auth.google}
      googleUnavailable={t.auth.googleUnavailable}
      dividerLabel={t.auth.orContinueWith}
      footer={
        <AuthFooterLink
          question={t.auth.noAccount}
          linkLabel={t.auth.signUpLink}
          href={
            next
              ? `${routes.register(locale)}?next=${encodeURIComponent(next)}`
              : routes.register(locale)
          }
        />
      }
    >
      <SignInForm
        locale={locale}
        next={next}
        initialError={initialError}
        labels={{
          email: t.auth.email,
          password: t.auth.password,
          submit: t.auth.signInButton,
          pending: t.common.loading,
        }}
      />

      <p className="mt-4 text-center">
        <Link
          href={routes.forgotPassword(locale)}
          className="text-sm text-mute transition-colors hover:text-gold-300"
        >
          {t.reset.forgotLink}
        </Link>
      </p>
    </AuthShell>
  );
}
