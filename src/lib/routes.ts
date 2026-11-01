import type { Locale } from "@/i18n/config";

/**
 * Every page lives under a language prefix (/hu/..., /en/...), so links are
 * built through these helpers rather than written as literals. Path segments
 * stay English in both languages; only the content is translated.
 */
export function localePath(locale: Locale, path = "/"): string {
  if (path === "/" || path === "") return `/${locale}`;
  const normalised = path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${normalised}`;
}

export const routes = {
  home: (locale: Locale) => localePath(locale),
  books: (locale: Locale) => localePath(locale, "/books"),
  book: (locale: Locale, slug: string) => localePath(locale, `/books/${slug}`),
  cart: (locale: Locale) => localePath(locale, "/cart"),
  library: (locale: Locale) => localePath(locale, "/library"),
  login: (locale: Locale) => localePath(locale, "/login"),
  register: (locale: Locale) => localePath(locale, "/register"),
  checkoutSuccess: (locale: Locale) => localePath(locale, "/checkout/success"),
  checkoutCancelled: (locale: Locale) => localePath(locale, "/cart?cancelled=1"),
  /**
   * Where Stripe sends the buyer back. A route handler rather than a page,
   * because it has to clear the cart cookie - something a server component
   * cannot do.
   */
  checkoutReturn: (locale: Locale) =>
    `/api/checkout/return?locale=${locale}&session_id={CHECKOUT_SESSION_ID}`,
  admin: (locale: Locale) => localePath(locale, "/admin"),
  adminBooks: (locale: Locale) => localePath(locale, "/admin/books"),
  adminNewBook: (locale: Locale) => localePath(locale, "/admin/books/new"),
  adminEditBook: (locale: Locale, id: string) =>
    localePath(locale, `/admin/books/${id}`),
  adminOrders: (locale: Locale) => localePath(locale, "/admin/orders"),
};

/** Download endpoint for one stored file. Locale-independent. */
export function downloadUrl(fileId: string): string {
  return `/api/download/${fileId}`;
}

/**
 * Swaps the language prefix on the current path, so the language switcher
 * keeps the visitor where they are.
 */
export function switchLocalePath(
  pathname: string,
  from: Locale,
  to: Locale,
): string {
  if (pathname === `/${from}`) return `/${to}`;
  if (pathname.startsWith(`/${from}/`)) {
    return `/${to}${pathname.slice(from.length + 1)}`;
  }
  return `/${to}`;
}
