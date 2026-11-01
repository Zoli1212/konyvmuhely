import { ChangePasswordForm } from "@/components/change-password-form";
import { requireUser } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { resolvePage } from "@/lib/page-locale";

export default async function AccountPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale, t } = await resolvePage(params);
  const user = await requireUser(locale, "/account");

  // A Google-only account has no password, so there is nothing to change and
  // the form would only be a dead end.
  const record = await prisma.user.findUnique({
    where: { id: user.id },
    select: { passwordHash: true },
  });

  const hasPassword = Boolean(record?.passwordHash);

  return (
    <div className="shell max-w-lg py-14">
      <h1 className="font-display text-[clamp(2rem,4.5vw,2.75rem)] leading-tight font-semibold text-paper">
        {t.account.title}
      </h1>
      <p className="mt-2 text-paper-dim">{t.account.lead}</p>

      <dl className="mt-8 border-y border-ink-800 py-5 text-sm">
        <dt className="text-xs tracking-wide text-mute uppercase">
          {t.account.signedInAs}
        </dt>
        <dd className="mt-1 text-paper">{user.email}</dd>
      </dl>

      <section className="mt-10">
        <h2 className="font-display text-xl font-semibold text-paper">
          {t.account.changePassword}
        </h2>

        <div className="panel mt-5 p-6">
          {hasPassword ? (
            <ChangePasswordForm
              locale={locale}
              labels={{
                current: t.account.currentPassword,
                next: t.account.newPassword,
                confirm: t.account.newPasswordConfirm,
                hint: t.auth.passwordHint,
                submit: t.account.save,
                pending: t.common.loading,
                saved: t.account.saved,
              }}
            />
          ) : (
            <p className="text-sm text-mute">{t.account.googleOnly}</p>
          )}
        </div>
      </section>
    </div>
  );
}
