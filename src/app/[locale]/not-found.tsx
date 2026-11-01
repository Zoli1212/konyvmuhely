import Link from "next/link";

import { defaultLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { routes } from "@/lib/routes";

/**
 * A not-found boundary cannot read route params, so it has no way to know
 * which language was requested. Rather than guess, a bilingual shop can
 * simply say it in both - which is also the clearest thing for a visitor who
 * arrived from a broken link in either language.
 */
export default function NotFound() {
  const hu = getDictionary("hu");
  const en = getDictionary("en");

  return (
    <div className="shell flex flex-col items-center py-28 text-center">
      <p className="eyebrow">404</p>

      <h1 className="mt-4 font-display text-3xl font-semibold text-paper sm:text-4xl">
        {hu.errors.notFound}
      </h1>
      <p className="mt-3 max-w-md text-paper-dim">{hu.errors.notFoundLead}</p>

      <div className="mt-8 h-px w-16 bg-ink-700" />

      <h2 className="mt-8 font-display text-xl font-semibold text-paper-dim">
        {en.errors.notFound}
      </h2>
      <p className="mt-2 max-w-md text-sm text-mute">{en.errors.notFoundLead}</p>

      <div className="mt-10 flex flex-wrap justify-center gap-2.5">
        <Link href={routes.books(defaultLocale)} className="btn btn-primary">
          {hu.nav.books}
        </Link>
        <Link href={routes.books("en")} className="btn btn-secondary">
          {en.nav.books}
        </Link>
      </div>
    </div>
  );
}
