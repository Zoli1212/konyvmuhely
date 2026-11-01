import { retryInvoice } from "@/actions/invoices";
import { SubmitButton } from "@/components/submit-button";
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
      invoice: { select: { status: true, number: true, lastError: true } },
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
            <th>{t.admin.table.invoice}</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const invoiceStatus = order.invoice?.status ?? "NONE";

            return (
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

                <td className="max-w-72 truncate text-paper-dim">
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

                <td>
                  {invoiceStatus === "ISSUED" ? (
                    <a
                      href={`/api/invoice/${order.id}`}
                      className="font-mono text-xs text-gold-300 underline-offset-2 hover:underline"
                    >
                      {order.invoice?.number ?? t.admin.invoiceStatus.ISSUED}
                    </a>
                  ) : invoiceStatus === "FAILED" ? (
                    <div className="flex items-center gap-2">
                      <span
                        className="chip text-rose-400"
                        title={order.invoice?.lastError ?? undefined}
                      >
                        {t.admin.invoiceStatus.FAILED}
                      </span>
                      <form action={retryInvoice}>
                        <input type="hidden" name="orderId" value={order.id} />
                        <input type="hidden" name="locale" value={locale} />
                        <SubmitButton
                          className="btn btn-ghost btn-sm"
                          pendingLabel="…"
                        >
                          {t.admin.table.retryInvoice}
                        </SubmitButton>
                      </form>
                    </div>
                  ) : (
                    <span className="text-xs text-mute">
                      {
                        t.admin.invoiceStatus[
                          invoiceStatus as keyof typeof t.admin.invoiceStatus
                        ]
                      }
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
