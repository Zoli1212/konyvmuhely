import type { Metadata } from "next";
import Link from "next/link";

import { DownloadIcon } from "@/components/icons";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale } from "@/i18n/config";
import { requireUser } from "@/lib/auth-guard";
import { pickText } from "@/lib/books";
import { formatMoney } from "@/lib/money";
import { prisma } from "@/lib/prisma";
import { resolvePage } from "@/lib/page-locale";
import { routes } from "@/lib/routes";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return { title: getDictionary(locale).account.orders, robots: { index: false } };
}

/**
 * The buyer's own orders, with their invoices.
 *
 * A page of its own rather than a section of the account, because this is
 * where someone goes looking for a receipt — and an invoice buried behind a
 * username in the header is an invoice nobody finds.
 */
export default async function OrdersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale, t } = await resolvePage(params);
  const user = await requireUser(locale, "/orders");

  const orders = await prisma.order.findMany({
    // A session the buyer abandoned at Stripe is noise, not an order.
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
          book: { select: { slug: true, titleHu: true, titleEn: true } },
        },
      },
    },
  });

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
        {t.account.orders}
      </h1>
      <p className="mt-2 text-paper-dim">{t.account.ordersLead}</p>

      {orders.length === 0 ? (
        <div className="panel mt-9 px-7 py-14 text-center">
          <p className="font-display text-xl text-paper">{t.account.noOrders}</p>
          <Link href={routes.books(locale)} className="btn btn-primary mt-6">
            {t.cart.emptyCta}
          </Link>
        </div>
      ) : (
        <ul className="mt-9 space-y-4">
          {orders.map((order) => {
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

                <ul className="mt-2.5 space-y-0.5 text-sm">
                  {order.items.map((item, index) => (
                    <li key={index}>
                      <Link
                        href={routes.book(locale, item.book.slug)}
                        className="text-paper transition-colors hover:text-gold-200"
                      >
                        {pickText(item.book.titleHu, item.book.titleEn, locale) ||
                          item.titleSnapshot}
                      </Link>
                    </li>
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
                      <span className="text-mute">{order.invoice?.number}</span>
                    </a>
                  ) : (
                    // An invoice that has not arrived is the buyer's question,
                    // so answer it here rather than leaving a gap they have to
                    // write in about.
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
    </div>
  );
}
