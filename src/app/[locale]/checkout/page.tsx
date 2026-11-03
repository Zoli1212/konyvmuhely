import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { CheckoutForm } from "@/components/checkout-form";
import { Cover } from "@/components/cover";
import { LockIcon } from "@/components/icons";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale } from "@/i18n/config";
import { currentUser } from "@/lib/auth-guard";
import { getOwnedBookIds, pickText } from "@/lib/books";
import { readCart } from "@/lib/cart";
import { env } from "@/lib/env";
import { formatMoney } from "@/lib/money";
import { resolvePage } from "@/lib/page-locale";
import { prisma } from "@/lib/prisma";
import { routes } from "@/lib/routes";
import { storeVatMode } from "@/lib/vat";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return { title: getDictionary(locale).billing.title, robots: { index: false } };
}

/**
 * The step between the cart and Stripe.
 *
 * It exists for two things Stripe Checkout cannot do: limit the sale to one
 * country, and take the acknowledgement that 45/2014. (II. 26.) Korm.
 * rendelet requires before a digital download may begin.
 */
export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale, t } = await resolvePage(params);

  const user = await currentUser();
  if (!user) {
    redirect(
      `${routes.login(locale)}?next=${encodeURIComponent(routes.checkout(locale))}`,
    );
  }

  const cartIds = await readCart();
  if (cartIds.length === 0) redirect(routes.cart(locale));

  const [records, owned, profile] = await Promise.all([
    prisma.book.findMany({
      where: { id: { in: cartIds }, published: true },
      select: {
        id: true,
        slug: true,
        author: true,
        titleHu: true,
        titleEn: true,
        priceMinor: true,
        currency: true,
        coverUrl: true,
      },
    }),
    getOwnedBookIds(user.id),
    prisma.user.findUnique({
      where: { id: user.id },
      select: {
        name: true,
        billingName: true,
        billingZip: true,
        billingCity: true,
        billingAddress: true,
        billingTaxId: true,
      },
    }),
  ]);

  // Keep the order they were added in, and charge for nothing already owned.
  const payable = cartIds
    .map((id) => records.find((book) => book.id === id))
    .filter((book): book is (typeof records)[number] => Boolean(book))
    .filter((book) => !owned.has(book.id));

  if (payable.length === 0) redirect(routes.cart(locale));

  const currency = payable[0]?.currency ?? env.storeCurrency;
  const total = payable.reduce((sum, book) => sum + book.priceMinor, 0);

  return (
    <div className="shell max-w-5xl py-14">
      <h1 className="font-display text-[clamp(2rem,4.5vw,3rem)] leading-tight font-semibold text-paper">
        {t.billing.title}
      </h1>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-paper-dim">
        {t.billing.lead}
      </p>

      <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_20rem] lg:items-start lg:gap-14">
        <CheckoutForm
          locale={locale}
          termsHref={routes.terms(locale)}
          defaults={{
            // The profile wins; the account name is a reasonable first guess
            // for someone who has never bought here before.
            name: profile?.billingName ?? profile?.name ?? "",
            zip: profile?.billingZip ?? "",
            city: profile?.billingCity ?? "",
            address: profile?.billingAddress ?? "",
            taxId: profile?.billingTaxId ?? "",
          }}
          labels={{
            billingHeading: t.billing.billingHeading,
            billingLead: t.billing.billingLead,
            name: t.billing.name,
            namePlaceholder: t.billing.namePlaceholder,
            zip: t.billing.zip,
            city: t.billing.city,
            address: t.billing.address,
            addressPlaceholder: t.billing.addressPlaceholder,
            country: t.billing.country,
            countryNote: t.billing.countryNote,
            taxId: t.billing.taxId,
            taxIdHint: t.billing.taxIdHint,
            optional: t.billing.optional,
            consentHeading: t.billing.consentHeading,
            consentLabel: t.billing.consentLabel,
            consentNote: t.billing.consentNote,
            submit: t.billing.submit,
            pending: t.common.loading,
            failed: t.billing.failed,
            errorName: t.billing.errorName,
            errorZip: t.billing.errorZip,
            errorCity: t.billing.errorCity,
            errorAddress: t.billing.errorAddress,
            errorTaxId: t.billing.errorTaxId,
            errorConsent: t.billing.errorConsent,
          }}
        />

        <aside className="panel px-6 py-6 lg:sticky lg:top-24">
          <h2 className="font-display text-base font-semibold text-paper">
            {t.billing.summary}
          </h2>

          <ul className="mt-5 space-y-4">
            {payable.map((book) => {
              const title = pickText(book.titleHu, book.titleEn, locale);
              return (
                <li key={book.id} className="flex items-start gap-3.5">
                  <Link
                    href={routes.book(locale, book.slug)}
                    className="cover-link w-11 shrink-0"
                  >
                    <Cover
                      title={title}
                      author={book.author}
                      coverUrl={book.coverUrl}
                      sizes="3rem"
                    />
                  </Link>
                  <span className="min-w-0 flex-1 text-sm leading-snug text-paper-dim">
                    {title}
                  </span>
                  <span className="shrink-0 text-sm font-medium text-paper tabular-nums">
                    {formatMoney(book.priceMinor, book.currency, locale)}
                  </span>
                </li>
              );
            })}
          </ul>

          <div className="mt-5 flex items-baseline justify-between border-t border-ink-800 pt-5">
            <span className="text-sm text-mute">{t.billing.total}</span>
            <span className="font-display text-2xl font-semibold text-paper tabular-nums">
              {formatMoney(total, currency, locale)}
            </span>
          </div>

          {storeVatMode() === "exempt" ? (
            <p className="mt-2 text-xs text-mute">{t.billing.vatExempt}</p>
          ) : null}

          <p className="mt-5 flex items-start gap-2 text-xs leading-relaxed text-mute">
            <LockIcon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            {t.billing.secure}
          </p>
        </aside>
      </div>
    </div>
  );
}
