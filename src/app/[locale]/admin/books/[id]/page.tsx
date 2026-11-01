import Link from "next/link";
import { notFound } from "next/navigation";

import { deleteBook } from "@/actions/books";
import { BookForm } from "@/components/admin/book-form";
import { buildBookFormLabels } from "@/components/admin/book-form-labels";
import { ArrowLeftIcon, TrashIcon, WarningIcon } from "@/components/icons";
import { SubmitButton } from "@/components/submit-button";
import { minorToInputValue } from "@/lib/money";
import { resolvePage } from "@/lib/page-locale";
import { prisma } from "@/lib/prisma";
import { routes } from "@/lib/routes";
import { storageDriver } from "@/lib/storage";

export default async function EditBookPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; id: string }>;
  searchParams: Promise<{ problem?: string }>;
}) {
  const { locale, t } = await resolvePage(params);
  const { id } = await params;
  const { problem } = await searchParams;

  const book = await prisma.book.findUnique({
    where: { id },
    select: {
      id: true,
      slug: true,
      author: true,
      titleHu: true,
      titleEn: true,
      subtitleHu: true,
      subtitleEn: true,
      blurbHu: true,
      blurbEn: true,
      descriptionHu: true,
      descriptionEn: true,
      priceMinor: true,
      currency: true,
      coverUrl: true,
      pageCount: true,
      published: true,
      featured: true,
      sortIndex: true,
      files: {
        select: {
          id: true,
          fileLocale: true,
          format: true,
          fileName: true,
          sizeBytes: true,
        },
        orderBy: [{ fileLocale: "asc" }, { format: "asc" }],
      },
      _count: { select: { orderItems: true } },
    },
  });

  if (!book) notFound();

  const sold = book._count.orderItems > 0;

  return (
    <div className="max-w-4xl">
      <Link
        href={routes.adminBooks(locale)}
        className="inline-flex items-center gap-1.5 text-sm text-mute transition-colors hover:text-gold-300"
      >
        <ArrowLeftIcon className="h-3.5 w-3.5" />
        {t.admin.books}
      </Link>

      <div className="mt-5 flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="font-display text-2xl font-semibold text-paper">
          {t.admin.editBook}
        </h2>
        <Link
          href={routes.book(locale, book.slug)}
          className="btn btn-ghost btn-sm"
        >
          {t.admin.table.view}
        </Link>
      </div>

      {problem === "has-sales" ? (
        <p className="panel mt-6 flex items-start gap-3 border-gold-600/35 bg-gold-500/5 px-5 py-4 text-sm text-paper-dim">
          <WarningIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
          {t.admin.form.deleteBlocked}
        </p>
      ) : null}

      <div className="mt-8">
        <BookForm
          mode="edit"
          locale={locale}
          driver={storageDriver()}
          labels={buildBookFormLabels(t, "edit")}
          initial={{
            id: book.id,
            slug: book.slug,
            author: book.author,
            titleHu: book.titleHu,
            titleEn: book.titleEn ?? "",
            subtitleHu: book.subtitleHu ?? "",
            subtitleEn: book.subtitleEn ?? "",
            blurbHu: book.blurbHu,
            blurbEn: book.blurbEn ?? "",
            descriptionHu: book.descriptionHu ?? "",
            descriptionEn: book.descriptionEn ?? "",
            price: minorToInputValue(book.priceMinor, book.currency),
            pageCount: book.pageCount ? String(book.pageCount) : "",
            published: book.published,
            featured: book.featured,
            sortIndex: String(book.sortIndex),
            coverUrl: book.coverUrl,
            files: book.files,
          }}
        />
      </div>

      {/* A separate form: HTML forms cannot nest, and destructive actions
          should not share a submit path with Save. */}
      <div className="mt-12 border-t border-ink-800 pt-7">
        {sold ? (
          <p className="text-sm text-mute">{t.admin.form.deleteBlocked}</p>
        ) : (
          <form action={deleteBook}>
            <input type="hidden" name="bookId" value={book.id} />
            <input type="hidden" name="locale" value={locale} />
            <SubmitButton className="btn btn-danger">
              <TrashIcon className="h-4 w-4" />
              {t.admin.form.deleteBook}
            </SubmitButton>
            <p className="field-hint max-w-lg">{t.admin.form.deleteConfirm}</p>
          </form>
        )}
      </div>
    </div>
  );
}
