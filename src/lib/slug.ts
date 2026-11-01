/**
 * Combining diacritical marks (U+0300-U+036F), which NFD normalisation
 * separates out from their base letter.
 */
const COMBINING_MARKS = /[̀-ͯ]/g;

/**
 * Builds a URL-safe slug. Hungarian accents are folded to their base letters
 * rather than dropped, so "Gyertya es tukormagia" is produced from the accented
 * original instead of "gyertya-s-tkrmgia". The double acute on o and u
 * decomposes to U+030B, which the range above covers.
 */
export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(COMBINING_MARKS, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "");
}

/**
 * Makes a slug unique against a set of slugs already in use by appending
 * -2, -3 and so on.
 */
export function uniqueSlug(base: string, taken: Iterable<string>): string {
  const used = new Set(taken);
  const root = base || "book";

  if (!used.has(root)) return root;

  let n = 2;
  while (used.has(`${root}-${n}`)) n++;
  return `${root}-${n}`;
}

/** Sanitises a file name for use inside a storage pathname. */
export function safeFileName(name: string): string {
  const lastDot = name.lastIndexOf(".");
  const stem = lastDot > 0 ? name.slice(0, lastDot) : name;
  const ext = lastDot > 0 ? name.slice(lastDot + 1).toLowerCase() : "";

  const cleanStem = slugify(stem) || "file";
  const cleanExt = ext.replace(/[^a-z0-9]/g, "").slice(0, 8);

  return cleanExt ? `${cleanStem}.${cleanExt}` : cleanStem;
}
