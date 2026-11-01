export const locales = ["hu", "en"] as const;

export type Locale = (typeof locales)[number];

/** Hungarian is the base language: book text falls back to it when no English exists. */
export const defaultLocale: Locale = "hu";

export const localeNames: Record<Locale, string> = {
  hu: "Magyar",
  en: "English",
};

/** BCP 47 tags used for `<html lang>`, Intl formatting and Stripe Checkout. */
export const localeTags: Record<Locale, string> = {
  hu: "hu-HU",
  en: "en-GB",
};

export function isLocale(value: string | undefined): value is Locale {
  return value === "hu" || value === "en";
}

/**
 * Picks the best locale from an Accept-Language header, ignoring quality
 * weights in favour of first match - good enough for two languages.
 */
export function matchLocale(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return defaultLocale;

  for (const part of acceptLanguage.split(",")) {
    const tag = part.split(";")[0]?.trim().toLowerCase();
    if (!tag) continue;
    const base = tag.split("-")[0];
    if (isLocale(base)) return base;
  }

  return defaultLocale;
}

/** Cookie that remembers the visitor's language choice. */
export const LOCALE_COOKIE = "store_locale";
