import { ChangePasswordForm } from "@/components/change-password-form";
import { DownloadIcon } from "@/components/icons";
import { requireUser } from "@/lib/auth-guard";
import { pickText } from "@/lib/books";
import { formatMoney } from "@/lib/money";
import { prisma } from "@/lib/prisma";
import { resolvePage } from "@/lib/page-locale";

export default async function AccountPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale, t } = await resolvePage(params);
  const user = await requireUser(locale, "/account");

  const [record, orders] = await Promise.all([
    // A Google-only account has no password, so there is nothing to change and
    // the form would only be a dead end.
    prisma.user.findUnique({
      where: { id: user.id },
      select: { passwordHash: true },
    }),
    prisma.order.findMany({
      where: { userId: user.id, status: { not: "PENDING" } },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        status: true,
        amountMinor: true,
        currency: true,
        createdAt: true,
        invoice: { select: { status: true, number: true } },
        items: {
          select: {
            titleSnapshot: true,
            book: { select: { titleHu: true, titleEn: true } },
          },
        },
      },
    }),
  ]);

  const hasPassword = Boolean(record?.passwordHash);

  const date = new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "hu-HU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const statusLabel: Record<string, string> = {
    PAID: t.account.orderStatusPAID,
    PENDING: t.account.orderStatusPENDING,
    FAILED: t.account.orderStatusFAILED,
    REFUNDED: t.account.orderStatusREFUNDED,
  };

  return (
    <div className="shell max-w-2xl py-14">
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

      <section className="mt-12">
        <h2 className="font-display text-xl font-semibold text-paper">
          {t.account.orders}
        </h2>
        <p className="mt-1.5 text-sm text-paper-dim">{t.account.ordersLead}</p>

        {orders.length === 0 ? (
          <p className="panel mt-5 px-5 py-6 text-sm text-mute">
            {t.account.noOrders}
          </p>
        ) : (
          <ul className="mt-5 space-y-4">
            {orders.map((order) => {
              const titles = order.items.map(
                (item) =>
                  pickText(item.book.titleHu, item.book.titleEn, locale) ||
                  item.titleSnapshot,
              );
              const issued = order.invoice?.status === "ISSUED";

              return (
                <li key={order.id} className="panel px-5 py-5">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <span className="text-sm text-paper-dim">
                      {date.format(order.createdAt)}
                    </span>
                    <span className="font-display text-lg font-semibold text-paper tabular-nums">
                      {formatMoney(order.amountMinor, order.currency, locale)}
                    </span>
                  </div>

                  <ul className="mt-2.5 space-y-0.5 text-sm text-paper">
                    {titles.map((title, index) => (
                      <li key={index}>{title}</li>
                    ))}
                  </ul>

                  <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-ink-800 pt-4">
                    <span
                      className={`chip ${order.status === "REFUNDED" ? "" : "chip-sage"}`}
                    >
                      {statusLabel[order.status] ?? order.status}
                    </span>

                    {issued ? (
                      <a
                        href={`/api/invoice/${order.id}`}
                        className="btn btn-ghost btn-sm"
                      >
                        <DownloadIcon className="h-3.5 w-3.5" />
                        {t.account.orderInvoice}
                        <span className="text-mute">
                          {order.invoice?.number}
                        </span>
                      </a>
                    ) : (
                      // An invoice that has not arrived is the buyer's
                      // question, so answer it here rather than leaving a gap
                      // they have to write in about.
                      <span className="text-xs text-mute">
                        {order.invoice?.status === "FAILED"
                          ? t.account.orderInvoiceFailed
                          : t.account.orderInvoicePending}
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

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
