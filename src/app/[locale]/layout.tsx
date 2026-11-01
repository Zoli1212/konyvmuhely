import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { notFound } from "next/navigation";

import { Footer } from "@/components/footer";
import { SiteHeader } from "@/components/site-header";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale, localeTags, locales } from "@/i18n/config";
import { currentUser } from "@/lib/auth-guard";
import { readCart } from "@/lib/cart";
import { env, siteUrl } from "@/lib/env";

import "../globals.css";

/*
 * The root layout lives inside the [locale] segment so that `<html lang>` is
 * correct for the language actually being served. There is deliberately no
 * src/app/layout.tsx; prefix-free URLs are redirected by src/proxy.ts.
 */

const display = Fraunces({
  subsets: ["latin", "latin-ext"],
  variable: "--font-fraunces",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

/*
 * Deliberately no generateStaticParams: every page reads the session and the
 * cart cookie, so all of them are per-request anyway. Declaring the locales
 * as static params only made the build try to prerender them, which meant
 * opening a database connection during `next build` for pages that can never
 * be static. Unknown locales are rejected below and in resolvePage.
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const t = getDictionary(locale);
  const base = siteUrl();

  return {
    metadataBase: new URL(base),
    title: {
      default: `${env.storeName} — ${t.home.title}`,
      template: `%s — ${env.storeName}`,
    },
    description: t.home.lead,
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(
        locales.map((l) => [localeTags[l], `/${l}`]),
      ),
    },
    openGraph: {
      type: "website",
      siteName: env.storeName,
      locale: localeTags[locale],
      title: `${env.storeName} — ${t.home.title}`,
      description: t.home.lead,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const [user, cart] = await Promise.all([currentUser(), readCart()]);

  return (
    <html lang={locale} className={`${display.variable} ${sans.variable}`}>
      <body className="flex min-h-screen flex-col">
        <div className="layer-content flex min-h-screen flex-col">
          <SiteHeader locale={locale} user={user} cartCount={cart.length} />
          <main className="flex-1">{children}</main>
          <Footer locale={locale} />
        </div>
      </body>
    </html>
  );
}
