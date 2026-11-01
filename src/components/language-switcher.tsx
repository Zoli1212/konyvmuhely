"use client";

import { usePathname } from "next/navigation";

import { setLocale } from "@/actions/locale";
import { GlobeIcon } from "@/components/icons";
import { localeNames, locales, type Locale } from "@/i18n/config";

/**
 * Switches language without losing the current page. The pathname is read on
 * the client and posted back, because the server action has no way to know
 * which page the visitor was on.
 */
export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-1">
      <GlobeIcon className="mr-0.5 h-4 w-4 text-mute" />

      {locales.map((candidate) => {
        const active = candidate === locale;

        if (active) {
          return (
            <span
              key={candidate}
              aria-current="true"
              className="rounded-md px-2 py-1 text-xs font-semibold text-gold-300"
            >
              {candidate.toUpperCase()}
            </span>
          );
        }

        return (
          <form key={candidate} action={setLocale}>
            <input type="hidden" name="locale" value={candidate} />
            <input type="hidden" name="from" value={locale} />
            <input type="hidden" name="pathname" value={pathname} />
            <button
              type="submit"
              title={localeNames[candidate]}
              className="cursor-pointer rounded-md px-2 py-1 text-xs font-medium text-mute transition-colors hover:bg-ink-800 hover:text-paper"
            >
              {candidate.toUpperCase()}
            </button>
          </form>
        );
      })}
    </div>
  );
}
