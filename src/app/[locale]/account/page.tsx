import Link from "next/link";

import { ChangePasswordForm } from "@/components/change-password-form";
import { ArrowRightIcon } from "@/components/icons";
import { requireUser } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { resolvePage } from "@/lib/page-locale";
import { routes } from "@/lib/routes";

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

      <Link
        href={routes.orders(locale)}
        className="panel mt-6 flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:border-ink-700"
      >
        <span>
          <span className="block font-display text-base font-semibold text-paper">
            {t.account.orders}
          </span>
          <span className="mt-0.5 block text-sm text-mute">
            {t.account.ordersLead}
          </span>
        </span>
        <ArrowRightIcon className="h-4 w-4 shrink-0 text-gold-400" />
      </Link>

      <section className="mt-12">
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
