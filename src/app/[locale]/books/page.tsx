import type { Metadata } from "next";
import Link from "next/link";

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
import { resolvePage } from "@/lib/page-locale";
import { routes } from "@/lib/routes";
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

/**
 * The shelf the visitor is on. Buddhism is the default because it is what
 * the shop is named after and where most of the catalogue sits; anything
 * unrecognised falls back to it rather than showing an empty page.
 */
function readCategory(raw: string | undefined): BookCategory {
  if (raw === "yoga") return "YOGA";
  if (raw === "esoteric") return "ESOTERIC";
  return "BUDDHIST";
}

const SLUGS: Record<BookCategory, string> = {
  BUDDHIST: "",
  YOGA: "yoga",
  ESOTERIC: "esoteric",
};

/** The default shelf has no query string, so its URL stays the plain one. */
function shelfHref(locale: Locale, category: BookCategory): string {
  const base = routes.books(locale);
  const slug = SLUGS[category];
  return slug ? `${base}?category=${slug}` : base;
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
  const category = readCategory(raw);

  const [books, counts, user] = await Promise.all([
    listPublishedBooks(category),
    countPublishedByCategory(),
    currentUser(),
  ]);

  const owned = user ? await getOwnedBookIds(user.id) : new Set<string>();

  const shelves: { key: BookCategory; label: string }[] = [
    { key: "BUDDHIST", label: t.books.categoryBuddhist },
    { key: "YOGA", label: t.books.categoryYoga },
    { key: "ESOTERIC", label: t.books.categoryEsoteric },
  ];

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

        {/* Links rather than buttons: each shelf is a page of its own, so it
            can be shared, bookmarked and reached without JavaScript. */}
        <nav className="mt-7 flex flex-wrap gap-2" aria-label={t.books.title}>
          {shelves.map((shelf) => {
            const active = shelf.key === category;
            return (
              <Link
                key={shelf.key}
                href={shelfHref(locale, shelf.key)}
                aria-current={active ? "page" : undefined}
                className={`inline-flex items-baseline gap-2 rounded-full border px-4 py-2 text-sm transition-colors ${
                  active
                    ? "border-gold-500/60 bg-gold-500/10 text-gold-200"
                    : "border-ink-700 text-paper-dim hover:border-ink-500 hover:text-paper"
                }`}
              >
                {shelf.label}
                <span
                  className={`text-xs tabular-nums ${active ? "text-gold-400/80" : "text-mute"}`}
                >
                  {counts[shelf.key]}
                </span>
              </Link>
            );
          })}
        </nav>
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
