import type { Metadata } from "next";
import { BookCard } from "@/components/book-card";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale, type Locale } from "@/i18n/config";
import { currentUser } from "@/lib/auth-guard";
import {
  countPublishedByCategory,
  getOwnedBookIds,
  listPublishedBooks,
  localizeBook,
} from "@/lib/books";
import { ShelfLinks, readShelf } from "@/components/shelf-links";
import { resolvePage } from "@/lib/page-locale";
import type { BookCategory } from "@/generated/prisma/enums";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const t = getDictionary(locale);
  return { title: t.books.title, description: t.books.lead };
}

export default async function BooksPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
}) {
  const { locale, t } = await resolvePage(params);
  const { category: raw } = await searchParams;
  const category = readShelf(raw);

  const [books, counts, user] = await Promise.all([
    listPublishedBooks(category),
    countPublishedByCategory(),
    currentUser(),
  ]);

  const owned = user ? await getOwnedBookIds(user.id) : new Set<string>();

  return (
    <div className="shell py-14">
      <header className="border-b border-ink-800 pb-7">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-[clamp(2rem,4.5vw,3rem)] leading-tight font-semibold text-paper">
              {t.books.title}
            </h1>
            <p className="mt-2 text-paper-dim">{t.books.lead}</p>
          </div>

          {books.length > 0 ? (
            <p className="text-sm text-mute tabular-nums">
              {t.books.count(books.length)}
            </p>
          ) : null}
        </div>

        <ShelfLinks
          locale={locale}
          active={category}
          counts={counts}
          className="mt-7"
        />
      </header>

      {books.length === 0 ? (
        <p className="py-20 text-center text-mute">{t.books.categoryEmpty}</p>
      ) : (
        <div className="mt-11 grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 lg:grid-cols-4">
          {books.map((record, index) => (
            <BookCard
              key={record.id}
              book={localizeBook(record, locale)}
              locale={locale}
              owned={owned.has(record.id)}
              priority={index < 4}
            />
          ))}
        </div>
      )}
    </div>
  );
}
