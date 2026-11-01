import { getDictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import type { BookRecord } from "@/lib/books";

/**
 * What a buyer actually gets: which formats, and in which languages. Formats
 * are deduplicated because a book that ships PDF in both languages should not
 * say "PDF PDF".
 */
export function FileChips({
  files,
  locale,
  className = "",
}: {
  files: BookRecord["files"];
  locale: Locale;
  className?: string;
}) {
  const t = getDictionary(locale);

  if (files.length === 0) return null;

  const formats = [...new Set(files.map((f) => f.format))];
  const editions = [...new Set(files.map((f) => f.fileLocale))];

  return (
    <div className={`flex flex-wrap items-center gap-1.5 ${className}`}>
      {formats.map((format) => (
        <span key={format} className="chip chip-gold">
          {format}
        </span>
      ))}
      {editions.map((edition) => (
        <span key={edition} className="chip">
          {edition === "HU" ? t.book.editionHu : t.book.editionEn}
        </span>
      ))}
    </div>
  );
}
