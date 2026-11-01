import Link from "next/link";

import { Cover } from "@/components/cover";
import { pickText } from "@/lib/books";
import { formatMoney } from "@/lib/money";
import { resolvePage } from "@/lib/page-locale";
import { prisma } from "@/lib/prisma";
import { routes } from "@/lib/routes";

export default async function AdminBooksPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale, t } = await resolvePage(params);

  const books = await prisma.book.findMany({
    orderBy: [{ sortIndex: "asc" }, { createdAt: "desc" }],
    select: {
      id: true,
      slug: true,
      author: true,
      titleHu: true,
      titleEn: true,
      priceMinor: true,
      currency: true,
      coverUrl: true,
      published: true,
      featured: true,
      _count: { select: { files: true, orderItems: true } },
    },
  });

  if (books.length === 0) {
    return (
      <div className="panel px-6 py-16 text-center">
        <p className="font-display text-lg text-paper">{t.admin.noBooks}</p>
        <Link href={routes.adminNewBook(locale)} className="btn btn-primary mt-6">
          {t.admin.newBook}
        </Link>
      </div>
    );
  }

  return (
    <div className="table-shell panel">
      <table className="data-table">
        <thead>
          <tr>
            <th className="w-16" />
            <th>{t.admin.table.title}</th>
            <th>{t.admin.table.price}</th>
            <th>{t.admin.table.status}</th>
            <th>{t.admin.table.files}</th>
            <th>{t.admin.table.sales}</th>
            <th className="text-right">{t.admin.table.actions}</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => {
            const title = pickText(book.titleHu, book.titleEn, locale);

            return (
              <tr key={book.id}>
                <td>
                  <div className="w-10">
                    <Cover
                      title={title}
                      author={book.author}
                      coverUrl={book.coverUrl}
                      sizes="2.5rem"
                    />
                  </div>
                </td>

                <td className="max-w-80 whitespace-normal">
                  <Link
                    href={routes.adminEditBook(locale, book.id)}
                    className="font-medium text-paper transition-colors hover:text-gold-300"
                  >
                    {title}
                  </Link>
                  <p className="mt-0.5 font-mono text-xs text-mute">
                    /{book.slug}
                  </p>
                </td>

                <td className="text-paper tabular-nums">
                  {formatMoney(book.priceMinor, book.currency, locale)}
                </td>

                <td>
                  <span
                    className={`chip ${book.published ? "chip-sage" : ""}`}
                  >
                    {book.published
                      ? t.admin.status.published
                      : t.admin.status.draft}
                  </span>
                  {book.featured ? (
                    <span className="chip chip-gold ml-1.5">★</span>
                  ) : null}
                </td>

                <td
                  className={`tabular-nums ${
                    book._count.files === 0 ? "text-rose-400" : "text-paper-dim"
                  }`}
                >
                  {book._count.files}
                </td>

                <td className="text-paper-dim tabular-nums">
                  {book._count.orderItems}
                </td>

                <td className="text-right">
                  <div className="inline-flex gap-1.5">
                    <Link
                      href={routes.book(locale, book.slug)}
                      className="btn btn-ghost btn-sm"
                    >
                      {t.admin.table.view}
                    </Link>
                    <Link
                      href={routes.adminEditBook(locale, book.id)}
                      className="btn btn-secondary btn-sm"
                    >
                      {t.common.edit}
                    </Link>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
