import Link from "next/link";

import { signOutAction } from "@/actions/auth";
import { CartIcon, LibraryIcon } from "@/components/icons";
import { LanguageSwitcher } from "@/components/language-switcher";
import { getDictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import type { SessionUser } from "@/lib/auth-guard";
import { env } from "@/lib/env";
import { routes } from "@/lib/routes";

export function SiteHeader({
  locale,
  user,
  cartCount,
}: {
  locale: Locale;
  user: SessionUser | null;
  cartCount: number;
}) {
  const t = getDictionary(locale);

  return (
    <header className="sticky top-0 z-40 border-b border-ink-800/80 bg-ink-950/80 backdrop-blur-xl">
      <div className="shell flex h-16 items-center gap-3">
        <Link
          href={routes.home(locale)}
          className="group flex items-center gap-2.5 pr-2"
        >
          <Monogram />
          <span className="font-display text-[1.0625rem] leading-none font-semibold tracking-tight text-paper">
            {env.storeName}
          </span>
        </Link>

        <nav className="ml-2 hidden items-center gap-1 sm:flex">
          <HeaderLink href={routes.books(locale)}>{t.nav.books}</HeaderLink>
          {user ? (
            <HeaderLink href={routes.orders(locale)}>
              {t.nav.orders}
            </HeaderLink>
          ) : null}
          {user ? (
            <HeaderLink href={routes.library(locale)}>
              {t.nav.library}
            </HeaderLink>
          ) : null}
          {user?.role === "ADMIN" ? (
            <HeaderLink href={routes.admin(locale)}>{t.nav.admin}</HeaderLink>
          ) : null}
        </nav>

        <div className="flex-1" />

        <div className="hidden sm:block">
          <LanguageSwitcher locale={locale} />
        </div>

        <Link
          href={routes.cart(locale)}
          aria-label={`${t.nav.cart}${cartCount > 0 ? ` (${cartCount})` : ""}`}
          className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg text-paper-dim transition-colors hover:bg-ink-800 hover:text-paper"
        >
          <CartIcon className="h-[18px] w-[18px]" />
          {cartCount > 0 ? (
            <span className="absolute -top-0.5 -right-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-gold-500 px-1 text-[10px] font-bold text-ink-950">
              {cartCount}
            </span>
          ) : null}
        </Link>

        {user ? (
          <div className="flex items-center gap-2">
            <Link
              href={routes.library(locale)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-paper-dim transition-colors hover:bg-ink-800 hover:text-paper sm:hidden"
              aria-label={t.nav.library}
            >
              <LibraryIcon className="h-[18px] w-[18px]" />
            </Link>

            <Link
              href={routes.account(locale)}
              title={user.email}
              className="hidden max-w-[11rem] truncate text-xs text-mute transition-colors hover:text-paper lg:block"
            >
              {user.name || user.email}
            </Link>

            <form action={signOutAction}>
              <input type="hidden" name="locale" value={locale} />
              <button type="submit" className="btn btn-ghost btn-sm">
                {t.nav.signOut}
              </button>
            </form>
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            <Link href={routes.login(locale)} className="btn btn-ghost btn-sm">
              {t.nav.signIn}
            </Link>
            <Link
              href={routes.register(locale)}
              className="btn btn-primary btn-sm"
            >
              {t.nav.signUp}
            </Link>
          </div>
        )}
      </div>

      {/* Compact nav for narrow screens, where the row above has no room. */}
      <div className="shell flex items-center gap-1 border-t border-ink-800/60 py-1.5 sm:hidden">
        <HeaderLink href={routes.books(locale)}>{t.nav.books}</HeaderLink>
        {user ? (
          <HeaderLink href={routes.library(locale)}>{t.nav.library}</HeaderLink>
          <HeaderLink href={routes.orders(locale)}>{t.nav.orders}</HeaderLink>
        ) : null}
        {user?.role === "ADMIN" ? (
          <HeaderLink href={routes.admin(locale)}>{t.nav.admin}</HeaderLink>
        ) : null}
        <div className="flex-1" />
        <LanguageSwitcher locale={locale} />
      </div>
    </header>
  );
}

function HeaderLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="rounded-lg px-2.5 py-1.5 text-sm font-medium text-paper-dim transition-colors hover:bg-ink-800 hover:text-paper"
    >
      {children}
    </Link>
  );
}

/** A small open-book mark, drawn rather than imported. */
function Monogram() {
  return (
    <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-[0.5rem] border border-gold-500/30 bg-linear-to-br from-gold-500/20 to-transparent">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
        className="h-[17px] w-[17px] text-gold-300"
      >
        <path d="M12 6.5C10.3 5.2 8 4.6 5 4.8v12.6c3-.2 5.3.4 7 1.7" />
        <path d="M12 6.5c1.7-1.3 4-1.9 7-1.7v12.6c-3-.2-5.3.4-7 1.7" />
        <path d="M12 6.5V19" />
      </svg>
    </span>
  );
}
