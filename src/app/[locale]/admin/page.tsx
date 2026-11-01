import Link from "next/link";

import { localeTags } from "@/i18n/config";
import { pickText } from "@/lib/books";
import { env } from "@/lib/env";
import { formatMoney } from "@/lib/money";
import { resolvePage } from "@/lib/page-locale";
import { prisma } from "@/lib/prisma";
import { routes } from "@/lib/routes";

export default async function AdminOverviewPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale, t } = await resolvePage(params);

  const [
    bookCount,
    publishedCount,
    paidOrders,
    customerCount,
    downloadCount,
    recentOrders,
  ] = await Promise.all([
    prisma.book.count(),
    prisma.book.count({ where: { published: true } }),
    prisma.order.aggregate({
      where: { status: "PAID" },
      _count: { _all: true },
      _sum: { amountMinor: true },
    }),
    prisma.entitlement
      .findMany({ distinct: ["userId"], select: { userId: true } })
      .then((rows) => rows.length),
    prisma.downloadLog.count(),
    prisma.order.findMany({
      where: { status: "PAID" },
      orderBy: { createdAt: "desc" },
      take: 8,
      select: {
        id: true,
        createdAt: true,
        amountMinor: true,
        currency: true,
        customerEmail: true,
        user: { select: { name: true, email: true } },
        items: {
          select: { book: { select: { titleHu: true, titleEn: true } } },
        },
      },
    }),
  ]);

  const revenue = paidOrders._sum.amountMinor ?? 0;

  const dateFormat = new Intl.DateTimeFormat(localeTags[locale], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <Stat label={t.admin.stats.books} value={String(bookCount)} />
        <Stat label={t.admin.stats.published} value={String(publishedCount)} />
        <Stat
          label={t.admin.stats.orders}
          value={String(paidOrders._count._all)}
        />
        <Stat
          label={t.admin.stats.revenue}
          value={formatMoney(revenue, env.storeCurrency, locale)}
          accent
        />
        <Stat label={t.admin.stats.customers} value={String(customerCount)} />
        <Stat label={t.admin.stats.downloads} value={String(downloadCount)} />
      </div>

      <section>
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-display text-xl font-semibold text-paper">
            {t.admin.orders}
          </h2>
          <Link href={routes.adminOrders(locale)} className="btn btn-ghost btn-sm">
            {t.common.edit}
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="panel mt-4 px-6 py-10 text-center text-sm text-mute">
            {t.admin.noOrders}
          </p>
        ) : (
          <div className="table-shell panel mt-4">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t.admin.table.date}</th>
                  <th>{t.admin.table.customer}</th>
                  <th>{t.admin.table.items}</th>
                  <th>{t.admin.table.amount}</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="text-mute tabular-nums">
                      {dateFormat.format(order.createdAt)}
                    </td>
                    <td className="text-paper-dim">
                      {order.user.name || order.user.email}
                    </td>
                    <td className="max-w-80 truncate text-paper-dim">
                      {order.items
                        .map((item) =>
                          pickText(
                            item.book.titleHu,
                            item.book.titleEn,
                            locale,
                          ),
                        )
                        .join(", ")}
                    </td>
                    <td className="text-paper tabular-nums">
                      {formatMoney(order.amountMinor, order.currency, locale)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function Stat({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="panel px-5 py-4">
      <p className="text-xs tracking-wide text-mute uppercase">{label}</p>
      <p
        className={`mt-1.5 font-display text-2xl font-semibold tabular-nums ${
          accent ? "text-gold-300" : "text-paper"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
