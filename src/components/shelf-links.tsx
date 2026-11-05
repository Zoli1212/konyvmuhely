import Link from "next/link";

import { getDictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { routes } from "@/lib/routes";
import type { BookCategory } from "@/generated/prisma/enums";

/**
 * The shelves, as links.
 *
 * Links rather than buttons: each shelf is a page of its own, so it can be
 * shared, bookmarked and reached without JavaScript.
 *
 * Shared between the listing and the home page, because a visitor who never
 * reaches the listing should still see that the catalogue has shelves — that
 * was the whole point of splitting it.
 */

/** The default shelf has no query string, so its URL stays the plain one. */
const SLUGS: Record<BookCategory, string> = {
  BUDDHIST: "",
  YOGA: "yoga",
  ESOTERIC: "esoteric",
  SCIENCE: "science",
};

export function shelfHref(locale: Locale, category: BookCategory): string {
  const base = routes.books(locale);
  const slug = SLUGS[category];
  return slug ? `${base}?category=${slug}` : base;
}

export function readShelf(raw: string | undefined): BookCategory {
  if (raw === "yoga") return "YOGA";
  if (raw === "esoteric") return "ESOTERIC";
  if (raw === "science") return "SCIENCE";
  // Buddhism is the default: it is what the shop is named after and where
  // most of the catalogue sits. An unrecognised value lands here rather
  // than on an empty page.
  return "BUDDHIST";
}

export function ShelfLinks({
  locale,
  active,
  counts,
  className = "",
}: {
  locale: Locale;
  /** Null on the home page, where no shelf is being viewed. */
  active: BookCategory | null;
  counts: Record<BookCategory, number>;
  className?: string;
}) {
  const t = getDictionary(locale);

  const shelves: { key: BookCategory; label: string }[] = [
    { key: "BUDDHIST", label: t.books.categoryBuddhist },
    { key: "YOGA", label: t.books.categoryYoga },
    { key: "ESOTERIC", label: t.books.categoryEsoteric },
    { key: "SCIENCE", label: t.books.categoryScience },
  ];

  return (
    <nav
      className={`flex flex-wrap gap-2 ${className}`.trim()}
      aria-label={t.books.title}
    >
      {shelves.map((shelf) => {
        const current = shelf.key === active;
        return (
          <Link
            key={shelf.key}
            href={shelfHref(locale, shelf.key)}
            aria-current={current ? "page" : undefined}
            className={`inline-flex items-baseline gap-2 rounded-full border px-4 py-2 text-sm transition-colors ${
              current
                ? "border-gold-500/60 bg-gold-500/10 text-gold-200"
                : "border-ink-700 text-paper-dim hover:border-ink-500 hover:text-paper"
            }`}
          >
            {shelf.label}
            <span
              className={`text-xs tabular-nums ${current ? "text-gold-400/80" : "text-mute"}`}
            >
              {counts[shelf.key]}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
