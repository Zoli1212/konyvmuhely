import { notFound } from "next/navigation";

import { getDictionary, type Dictionary } from "@/i18n/dictionaries";
import { isLocale, type Locale } from "@/i18n/config";

/**
 * Every page starts the same way: await the route params, reject an unknown
 * language, and get the copy for the one that was asked for. `/xx/books`
 * would otherwise match [locale] and render with silently empty labels.
 */
export async function resolvePage(
  params: Promise<{ locale: string }>,
): Promise<{ locale: Locale; t: Dictionary }> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return { locale, t: getDictionary(locale) };
}
