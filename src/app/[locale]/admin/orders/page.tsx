import { localeTags } from "@/i18n/config";
import { pickText } from "@/lib/books";
import { formatMoney } from "@/lib/money";
import { resolvePage } from "@/lib/page-locale";
import { prisma } from "@/lib/prisma";

export default async function AdminOrdersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale, t } = await resolvePage(params);

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      id: true,
      createdAt: true,
      amountMinor: true,
      currency: true,
      status: true,
      customerEmail: true,
      user: { select: { name: true, email: true } },
      items: {
        select: { book: { select: { titleHu: true, titleEn: true } } },
      },
    },
  });

  if (orders.length === 0) {
    return (
      <p className="panel px-6 py-16 text-center text-sm text-mute">
        {t.admin.noOrders}
      </p>
    );
  }

  const dateFormat = new Intl.DateTimeFormat(localeTags[locale], {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="table-shell panel">
      <table className="data-table">
        <thead>
          <tr>
            <th>{t.admin.table.date}</th>
            <th>{t.admin.table.customer}</th>
            <th>{t.admin.table.items}</th>
            <th>{t.admin.table.amount}</th>
            <th>{t.admin.table.status}</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td className="text-mute tabular-nums">
                {dateFormat.format(order.createdAt)}
              </td>

              <td className="text-paper-dim">
                {order.user.name || order.user.email}
                {order.customerEmail &&
                order.customerEmail !== order.user.email ? (
                  <span className="ml-1.5 text-xs text-mute">
                    ({order.customerEmail})
                  </span>
                ) : null}
              </td>

              <td className="max-w-80 truncate text-paper-dim">
                {order.items
                  .map((item) =>
                    pickText(item.book.titleHu, item.book.titleEn, locale),
                  )
                  .join(", ")}
              </td>

              <td className="text-paper tabular-nums">
                {formatMoney(order.amountMinor, order.currency, locale)}
              </td>

              <td>
                <span
                  className={`chip ${
                    order.status === "PAID"
                      ? "chip-sage"
                      : order.status === "REFUNDED"
                        ? "chip-gold"
                        : ""
                  }`}
                >
                  {t.library.status[order.status]}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
