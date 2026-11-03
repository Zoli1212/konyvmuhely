import Link from "next/link";

import { getDictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { env } from "@/lib/env";
import { routes } from "@/lib/routes";

export function Footer({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  // Rendered on the server at request time; no client clock involved.
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-ink-800">
      <div className="shell flex flex-col gap-8 py-10 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-sm">
          <p className="font-display text-base font-semibold text-paper">
            {env.storeName}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-mute">
            {t.footer.tagline}
          </p>
        </div>

        <nav className="flex flex-col gap-2 text-sm">
          <Link
            href={routes.books(locale)}
            className="text-paper-dim transition-colors hover:text-gold-300"
          >
            {t.footer.books}
          </Link>
          <Link
            href={routes.library(locale)}
            className="text-paper-dim transition-colors hover:text-gold-300"
          >
            {t.footer.library}
          </Link>
          <Link
            href={routes.login(locale)}
            className="text-paper-dim transition-colors hover:text-gold-300"
          >
            {t.footer.account}
          </Link>
          <Link
            href={routes.terms(locale)}
            className="text-paper-dim transition-colors hover:text-gold-300"
          >
            {t.legal.termsNav}
          </Link>
          <Link
            href={routes.privacy(locale)}
            className="text-paper-dim transition-colors hover:text-gold-300"
          >
            {t.legal.privacyNav}
          </Link>
        </nav>
      </div>

      <div className="shell flex flex-col gap-2 border-t border-ink-800 py-5 text-xs text-mute sm:flex-row sm:items-center sm:justify-between">
        <p>{t.footer.rights(year, env.storeName)}</p>
        <p>{t.footer.legalNote}</p>
      </div>
    </footer>
  );
}
