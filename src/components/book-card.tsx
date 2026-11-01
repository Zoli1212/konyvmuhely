import Link from "next/link";

import { Cover } from "@/components/cover";
import { FileChips } from "@/components/file-chips";
import { CheckIcon } from "@/components/icons";
import { getDictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import type { LocalizedBook } from "@/lib/books";
import { formatMoney } from "@/lib/money";
import { routes } from "@/lib/routes";

export function BookCard({
  book,
  locale,
  owned = false,
  priority = false,
}: {
  book: LocalizedBook;
  locale: Locale;
  owned?: boolean;
  priority?: boolean;
}) {
  const t = getDictionary(locale);

  return (
    <article className="group">
      <Link
        href={routes.book(locale, book.slug)}
        className="cover-link block focus-visible:outline-offset-4"
      >
        <Cover
          title={book.title}
          author={book.author}
          coverUrl={book.coverUrl}
          priority={priority}
        />
      </Link>

      <div className="mt-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg leading-snug font-semibold">
            <Link
              href={routes.book(locale, book.slug)}
              className="text-paper transition-colors group-hover:text-gold-200"
            >
              {book.title}
            </Link>
          </h3>

          {owned ? (
            <span className="chip chip-sage shrink-0">
              <CheckIcon className="h-3 w-3" />
              {t.book.owned}
            </span>
          ) : (
            <span className="shrink-0 pt-0.5 font-display text-base font-semibold text-gold-300 tabular-nums">
              {formatMoney(book.priceMinor, book.currency, locale)}
            </span>
          )}
        </div>

        <p className="mt-0.5 text-xs tracking-wide text-mute uppercase">
          {book.author}
        </p>

        <p className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-paper-dim">
          {book.blurb}
        </p>

        <FileChips files={book.files} locale={locale} className="mt-3" />
      </div>
    </article>
  );
}
