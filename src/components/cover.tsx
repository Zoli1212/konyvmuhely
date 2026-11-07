import Image from "next/image";

/**
 * A book cover. When no image has been uploaded, this draws a typographic
 * cover from the title and author instead of showing a broken-image box - a
 * catalogue mid-setup still looks deliberate.
 */
export function Cover({
  title,
  author,
  coverUrl,
  sizes = "(min-width: 1024px) 18rem, (min-width: 640px) 33vw, 45vw",
  priority = false,
  className = "",
}: {
  title: string;
  author: string;
  coverUrl: string | null;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  // @container makes the placeholder's type scale with the cover's own width
  // rather than the viewport, so the same component works at 6rem in a table
  // row and at 20rem on the book page.
  return (
    <div className={`cover @container aspect-2/3 w-full ${className}`}>
      {coverUrl ? (
        <Image
          src={coverUrl}
          alt=""
          fill
          sizes={sizes}
          priority={priority}
          // Covers are generated at the size they are shown and stored as
          // WebP, so Vercel's optimiser has nothing left to do — and every
          // variant it makes is metered. Unmetered and identical output.
          unoptimized
          className="object-cover"
        />
      ) : (
        <PlaceholderCover title={title} author={author} />
      )}
    </div>
  );
}

function PlaceholderCover({
  title,
  author,
}: {
  title: string;
  author: string;
}) {
  return (
    <div className="flex h-full w-full flex-col justify-between bg-linear-to-br from-ink-700 via-ink-800 to-ink-900 p-[8%]">
      <div
        aria-hidden
        className="h-px w-full bg-linear-to-r from-transparent via-gold-500/50 to-transparent"
      />

      <div className="cover-placeholder-text px-[4%]">
        <h3 className="cover-placeholder-title">{title}</h3>
        <p className="cover-placeholder-author">{author}</p>
      </div>

      <div
        aria-hidden
        className="h-px w-full bg-linear-to-r from-transparent via-gold-500/50 to-transparent"
      />
    </div>
  );
}
