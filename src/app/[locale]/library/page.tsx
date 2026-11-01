import Link from "next/link";

import { Cover } from "@/components/cover";
import { ArrowRightIcon, DownloadIcon } from "@/components/icons";
import { localeTags } from "@/i18n/config";
import { requireUser } from "@/lib/auth-guard";
import { getLibrary, groupFilesByLocale, localizeBook } from "@/lib/books";
import { formatMoney } from "@/lib/money";
import { resolvePage } from "@/lib/page-locale";
import { prisma } from "@/lib/prisma";
import { downloadUrl, routes } from "@/lib/routes";
import { formatBytes } from "@/lib/storage";

export default async function LibraryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale, t } = await resolvePage(params);
  const user = await requireUser(locale, "/library");

  const [library, orders] = await Promise.all([
    getLibrary(user.id),
    prisma.order.findMany({
      where: { userId: user.id, status: { not: "PENDING" } },
      orderBy: { createdAt: "desc" },
      take: 20,
      select: {
        id: true,
        createdAt: true,
        amountMinor: true,
        currency: true,
        status: true,
        _count: { select: { items: true } },
      },
    }),
  ]);

  const dateFormat = new Intl.DateTimeFormat(localeTags[locale], {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="shell py-14">
      <header className="border-b border-ink-800 pb-7">
        <h1 className="font-display text-[clamp(2rem,4.5vw,3rem)] leading-tight font-semibold text-paper">
          {t.library.title}
        </h1>
        <p className="mt-2 text-paper-dim">{t.library.lead}</p>
      </header>

      {library.length === 0 ? (
        <div className="panel mt-10 px-7 py-16 text-center">
          <p className="font-display text-xl text-paper">{t.library.empty}</p>
          <Link href={routes.books(locale)} className="btn btn-primary mt-6">
            {t.library.emptyCta}
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <ul className="mt-10 space-y-8">
          {library.map(({ book: record, purchasedAt }) => {
            const book = localizeBook(record, locale);
            const editions = groupFilesByLocale(record.files);

            return (
              <li
                key={record.id}
                className="panel flex flex-col gap-6 p-5 sm:flex-row sm:p-6"
              >
                <Link
                  href={routes.book(locale, record.slug)}
                  className="cover-link w-24 shrink-0 self-start sm:w-28"
                >
                  <Cover
                    title={book.title}
                    author={book.author}
                    coverUrl={book.coverUrl}
                    sizes="7rem"
                  />
                </Link>

                <div className="min-w-0 flex-1">
                  <h2 className="font-display text-xl leading-snug font-semibold">
                    <Link
                      href={routes.book(locale, record.slug)}
                      className="text-paper transition-colors hover:text-gold-200"
                    >
                      {book.title}
                    </Link>
                  </h2>

                  <p className="mt-1 text-xs tracking-wide text-mute uppercase">
                    {book.author}
                  </p>

                  <p className="mt-2 text-xs text-mute">
                    {t.library.purchasedOn}: {dateFormat.format(purchasedAt)}
                  </p>

                  {editions.length === 0 ? (
                    <p className="mt-5 text-sm text-mute">
                      {t.library.noFiles}
                    </p>
                  ) : (
                    <div className="mt-5 space-y-3">
                      {editions.map((edition) => (
                        <div
                          key={edition.locale}
                          className="flex flex-wrap items-center gap-x-3 gap-y-2"
                        >
                          <span className="min-w-20 text-xs tracking-wide text-mute uppercase">
                            {edition.locale === "HU"
                              ? t.book.editionHu
                              : t.book.editionEn}
                          </span>

                          {edition.files.map((file) => (
                            <a
                              key={file.id}
                              href={downloadUrl(file.id)}
                              // Not a client-side navigation: this must be a
                              // real browser download request.
                              download
                              className="btn btn-secondary btn-sm"
                            >
                              <DownloadIcon className="h-3.5 w-3.5" />
                              {file.format}
                              <span className="text-mute tabular-nums">
                                {formatBytes(file.sizeBytes, localeTags[locale])}
                              </span>
                            </a>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {orders.length > 0 ? (
        <section className="mt-16 border-t border-ink-800 pt-10">
          <h2 className="font-display text-2xl font-semibold text-paper">
            {t.library.orders}
          </h2>

          <div className="table-shell mt-5">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t.library.orderOn}</th>
                  <th>{t.checkout.purchased}</th>
                  <th>{t.library.orderTotal}</th>
                  <th>{t.library.orderStatus}</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="text-paper-dim">
                      {dateFormat.format(order.createdAt)}
                    </td>
                    <td className="text-paper-dim tabular-nums">
                      {order._count.items}
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
        </section>
      ) : null}
    </div>
  );
}
