/**
 * Where a booklet ends and a book begins.
 *
 * The catalogue holds twelve-page handbooks next to three-hundred-page
 * volumes at very different prices, and a card showing only a price leaves
 * the buyer guessing which they are looking at. Derived from the page count
 * rather than stored, so it cannot drift away from the file.
 *
 * Kept in a module of its own, free of imports: the storefront needs it,
 * and so does the publisher script, which must not drag a database client
 * in just to read one number.
 */
export const BOOKLET_MAX_PAGES = 40;

export function isBooklet(pageCount: number | null): boolean {
  return pageCount !== null && pageCount <= BOOKLET_MAX_PAGES;
}
