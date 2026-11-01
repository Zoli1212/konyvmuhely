import { NextResponse, type NextRequest } from "next/server";

import { LOCALE_COOKIE, isLocale, matchLocale } from "@/i18n/config";

/**
 * Every page lives under a language prefix. This forwards prefix-free URLs
 * (/, /books, /login - including the locale-free paths Auth.js redirects to)
 * to the visitor's language: their saved choice if they have one, otherwise
 * their browser's Accept-Language, otherwise Hungarian.
 *
 * Next 16 calls this file `proxy.ts`; it is the former `middleware.ts`.
 */
export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Already localised - nothing to do.
  if (isLocale(pathname.split("/")[1])) {
    return NextResponse.next();
  }

  const saved = request.cookies.get(LOCALE_COOKIE)?.value;
  const locale = isLocale(saved)
    ? saved
    : matchLocale(request.headers.get("accept-language"));

  const url = request.nextUrl.clone();
  url.pathname = pathname === "/" ? `/${locale}` : `/${locale}${pathname}`;

  return NextResponse.redirect(url);
}

export const config = {
  // Skip API routes, Next internals and anything that looks like a file.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
