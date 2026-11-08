import Link from "next/link";
import type { ReactNode } from "react";

/**
 * The small amount of Markdown the book descriptions actually use.
 *
 * They are written as Markdown and were being printed verbatim, so every
 * emphasis showed as a pair of asterisks. This renders the three marks in
 * use — bold, italic, and links — and leaves everything else as text.
 *
 * It builds React elements rather than HTML: descriptions are authored in
 * the catalogue, but they reach here through the database, and nothing
 * that arrives that way should be able to inject markup.
 */
const TOKEN = /\*\*([^*]+)\*\*|\*([^*\n]+)\*|\[([^\]]+)\]\(([^)\s]+)\)/g;

export function renderInline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;

  for (const m of text.matchAll(TOKEN)) {
    const at = m.index;
    if (at > last) out.push(text.slice(last, at));

    const [, bold, italic, label, href] = m;
    if (bold !== undefined) {
      out.push(<strong key={at}>{bold}</strong>);
    } else if (italic !== undefined) {
      out.push(<em key={at}>{italic}</em>);
    } else if (label !== undefined && href !== undefined) {
      // Only our own paths become links. An absolute URL in a description
      // would be a link out of the shop, which no book needs, so it stays
      // as plain text rather than quietly becoming clickable.
      out.push(
        href.startsWith("/") ? (
          <Link key={at} href={href} className="link-gold">
            {label}
          </Link>
        ) : (
          label
        ),
      );
    }

    last = at + m[0].length;
  }

  if (last < text.length) out.push(text.slice(last));
  return out;
}
