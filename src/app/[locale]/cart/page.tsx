import Link from "next/link";

import { checkoutAction, removeFromCart } from "@/actions/cart";
import { Cover } from "@/components/cover";
import { ArrowRightIcon, TrashIcon, WarningIcon } from "@/components/icons";
import { SubmitButton } from "@/components/submit-button";
import { currentUser } from "@/lib/auth-guard";
import { getOwnedBookIds, pickText } from "@/lib/books";
import { readCart } from "@/lib/cart";
import { formatMoney } from "@/lib/money";
import { resolvePage } from "@/lib/page-locale";
import { prisma } from "@/lib/prisma";
import { routes } from "@/lib/routes";
import { env } from "@/lib/env";

export default async function CartPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ problem?: string; cancelled?: string }>;
}) {
  const { locale, t } = await resolvePage(params);
  const { problem, cancelled } = await searchParams;

  const [cartIds, user] = await Promise.all([readCart(), currentUser()]);

  const records = cartIds.length
    ? await prisma.book.findMany({
        where: { id: { in: cartIds }, published: true },
        select: {
          id: true,
          slug: true,
          author: true,
          titleHu: true,
          titleEn: true,
          blurbHu: true,
          blurbEn: true,
          priceMinor: true,
          currency: true,
          coverUrl: true,
        },
      })
    : [];

  // Keep the order the visitor added them in.
  const ordered = cartIds
    .map((id) => records.find((book) => book.id === id))
    .filter((book): book is (typeof records)[number] => Boolean(book));

  const owned = user ? await getOwnedBookIds(user.id) : new Set<string>();

  const payable = ordered.filter((book) => !owned.has(book.id));
  const currency = payable[0]?.currency ?? env.storeCurrency;
  const total = payable.reduce((sum, book) => sum + book.priceMinor, 0);

  const problemMessage = resolveProblem(problem, cancelled, t);

  return (
    <div className="shell max-w-4xl py-14">
      <h1 className="font-display text-[clamp(2rem,4.5vw,3rem)] leading-tight font-semibold text-paper">
        {t.cart.title}
      </h1>

      {problemMessage ? (
        <div className="panel mt-7 flex items-start gap-3 border-gold-600/40 bg-gold-500/5 px-5 py-4">
          <WarningIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
          <p className="text-sm text-paper-dim">{problemMessage}</p>
        </div>
      ) : null}

      {ordered.length === 0 ? (
        <div className="panel mt-9 px-7 py-14 text-center">
          <p className="font-display text-xl text-paper">{t.cart.empty}</p>
          <Link href={routes.books(locale)} className="btn btn-primary mt-6">
            {t.cart.emptyCta}
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <>
          <p className="mt-3 text-sm text-mute">
            {t.cart.itemCount(ordered.length)}
          </p>

          <ul className="mt-8 divide-y divide-ink-800 border-y border-ink-800">
            {ordered.map((record) => {
              const title = pickText(record.titleHu, record.titleEn, locale);
              const isOwned = owned.has(record.id);

              return (
                <li key={record.id} className="flex gap-5 py-5">
                  <Link
                    href={routes.book(locale, record.slug)}
                    className="cover-link w-16 shrink-0 sm:w-20"
                  >
                    <Cover
                      title={title}
                      author={record.author}
                      coverUrl={record.coverUrl}
                      sizes="5rem"
                    />
                  </Link>

                  <div className="min-w-0 flex-1">
                    <h2 className="font-display text-base leading-snug font-semibold">
                      <Link
                        href={routes.book(locale, record.slug)}
                        className="text-paper transition-colors hover:text-gold-200"
                      >
                        {title}
                      </Link>
                    </h2>
                    <p className="mt-0.5 text-xs tracking-wide text-mute uppercase">
                      {record.author}
                    </p>

                    {isOwned ? (
                      <p className="mt-2 text-xs text-sage-400">
                        {t.cart.ownedRemoved}
                      </p>
                    ) : null}
                  </div>

                  <div className="flex shrink-0 flex-col items-end justify-between gap-3">
                    <span
                      className={`font-display text-base font-semibold tabular-nums ${
                        isOwned ? "text-mute line-through" : "text-gold-300"
                      }`}
                    >
                      {formatMoney(record.priceMinor, record.currency, locale)}
                    </span>

                    <form action={removeFromCart}>
                      <input type="hidden" name="bookId" value={record.id} />
                      <input type="hidden" name="locale" value={locale} />
                      <SubmitButton className="btn btn-ghost btn-sm">
                        <TrashIcon className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only">
                          {t.cart.remove}
                        </span>
                      </SubmitButton>
                    </form>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="mt-8 flex flex-col items-stretch gap-5 sm:flex-row sm:items-center sm:justify-between">
            <Link href={routes.books(locale)} className="btn btn-ghost">
              {t.cart.continueShopping}
            </Link>

            <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center">
              <p className="flex items-baseline justify-between gap-3 sm:justify-start">
                <span className="text-sm text-mute">{t.cart.total}</span>
                <span className="font-display text-2xl font-semibold text-paper tabular-nums">
                  {formatMoney(total, currency, locale)}
                </span>
              </p>

              {payable.length === 0 ? (
                <Link href={routes.library(locale)} className="btn btn-secondary btn-lg">
                  {t.book.goToLibrary}
                </Link>
              ) : (
                <form action={checkoutAction}>
                  <input type="hidden" name="locale" value={locale} />
                  <SubmitButton
                    className="btn btn-primary btn-lg w-full sm:w-auto"
                    pendingLabel={t.common.loading}
                  >
                    {t.cart.checkout}
                    <ArrowRightIcon className="h-4 w-4" />
                  </SubmitButton>
                </form>
              )}
            </div>
          </div>

          {!user ? (
            <p className="mt-4 text-right text-xs text-mute">
              {t.cart.signInRequired}
            </p>
          ) : null}
        </>
      )}
    </div>
  );
}

function resolveProblem(
  problem: string | undefined,
  cancelled: string | undefined,
  t: Awaited<ReturnType<typeof resolvePage>>["t"],
): string | null {
  if (cancelled) return t.checkout.canceledLead;

  switch (problem) {
    case "empty":
      return t.errors.cartEmpty;
    case "stripe-unconfigured":
      return t.errors.storeUnconfigured;
    case "mixed-currency":
      return t.errors.generic;
    default:
      return null;
  }
}
