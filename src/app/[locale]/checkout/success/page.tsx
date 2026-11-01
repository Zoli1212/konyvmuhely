import Link from "next/link";

import { Cover } from "@/components/cover";
import { ArrowRightIcon, CheckIcon, DownloadIcon } from "@/components/icons";
import { localeTags } from "@/i18n/config";
import { requireUser } from "@/lib/auth-guard";
import { pickText } from "@/lib/books";
import { resolvePage } from "@/lib/page-locale";
import { prisma } from "@/lib/prisma";
import { downloadUrl, routes } from "@/lib/routes";
import { formatMoney } from "@/lib/money";

/**
 * Pure confirmation screen. Fulfilment already happened in
 * /api/checkout/return, so this page only reads what is in the database. If a
 * delayed payment method is still settling, the order is PENDING and the
 * buyer gets a "we are processing" state instead of a false success.
 */
export default async function CheckoutSuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { locale, t } = await resolvePage(params);
  const { session_id: sessionId } = await searchParams;

  const user = await requireUser(locale, "/checkout/success");

  const order = sessionId
    ? await prisma.order.findFirst({
        where: { stripeSessionId: sessionId, userId: user.id },
        select: {
          id: true,
          status: true,
          amountMinor: true,
          currency: true,
          createdAt: true,
          items: {
            select: {
              bookId: true,
              book: {
                select: {
                  slug: true,
                  author: true,
                  titleHu: true,
                  titleEn: true,
                  coverUrl: true,
                  files: {
                    select: { id: true, format: true, fileLocale: true },
                    orderBy: [{ fileLocale: "asc" }, { format: "asc" }],
                  },
                },
              },
            },
          },
        },
      })
    : null;

  if (!order) {
    return (
      <Shell title={t.checkout.pendingTitle} lead={t.checkout.missingSession}>
        <Link href={routes.library(locale)} className="btn btn-primary">
          {t.checkout.successCta}
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </Shell>
    );
  }

  if (order.status !== "PAID") {
    return (
      <Shell title={t.checkout.pendingTitle} lead={t.checkout.pendingLead}>
        <div className="flex flex-wrap gap-2.5">
          {/* A plain link, so it is a real reload rather than a cached
              client-side navigation. */}
          <a
            href={`${routes.checkoutSuccess(locale)}?session_id=${sessionId}`}
            className="btn btn-primary"
          >
            {t.checkout.refresh}
          </a>
          <Link href={routes.library(locale)} className="btn btn-secondary">
            {t.checkout.successCta}
          </Link>
        </div>
      </Shell>
    );
  }

  const dateFormat = new Intl.DateTimeFormat(localeTags[locale], {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="shell max-w-3xl py-16 sm:py-20">
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-sage-400/30 bg-sage-400/10">
        <CheckIcon className="h-6 w-6 text-sage-400" />
      </span>

      <h1 className="mt-6 font-display text-[clamp(2rem,4.5vw,3rem)] leading-tight font-semibold text-paper">
        {t.checkout.successTitle}
      </h1>
      <p className="mt-3 text-lg text-paper-dim">{t.checkout.successLead}</p>

      <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-3 border-y border-ink-800 py-5 text-sm">
        <div>
          <dt className="text-xs tracking-wide text-mute uppercase">
            {t.checkout.orderNumber}
          </dt>
          <dd className="mt-1 font-mono text-xs text-paper">{order.id}</dd>
        </div>
        <div>
          <dt className="text-xs tracking-wide text-mute uppercase">
            {t.library.orderOn}
          </dt>
          <dd className="mt-1 text-paper">
            {dateFormat.format(order.createdAt)}
          </dd>
        </div>
        <div>
          <dt className="text-xs tracking-wide text-mute uppercase">
            {t.library.orderTotal}
          </dt>
          <dd className="mt-1 text-paper tabular-nums">
            {formatMoney(order.amountMinor, order.currency, locale)}
          </dd>
        </div>
      </dl>

      <h2 className="mt-10 font-display text-xl font-semibold text-paper">
        {t.checkout.purchased}
      </h2>

      <ul className="mt-5 space-y-5">
        {order.items.map((item) => {
          const title = pickText(
            item.book.titleHu,
            item.book.titleEn,
            locale,
          );

          return (
            <li key={item.bookId} className="flex gap-5">
              <Link
                href={routes.book(locale, item.book.slug)}
                className="cover-link w-16 shrink-0"
              >
                <Cover
                  title={title}
                  author={item.book.author}
                  coverUrl={item.book.coverUrl}
                  sizes="4rem"
                />
              </Link>

              <div className="min-w-0 flex-1">
                <p className="font-display text-base font-semibold text-paper">
                  {title}
                </p>
                <p className="mt-0.5 text-xs tracking-wide text-mute uppercase">
                  {item.book.author}
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {item.book.files.map((file) => (
                    <a
                      key={file.id}
                      href={downloadUrl(file.id)}
                      download
                      className="btn btn-secondary btn-sm"
                    >
                      <DownloadIcon className="h-3.5 w-3.5" />
                      {file.fileLocale === "HU"
                        ? t.book.editionHu
                        : t.book.editionEn}{" "}
                      {file.format}
                    </a>
                  ))}
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <Link href={routes.library(locale)} className="btn btn-primary btn-lg mt-10">
        {t.checkout.successCta}
        <ArrowRightIcon className="h-4 w-4" />
      </Link>
    </div>
  );
}

function Shell({
  title,
  lead,
  children,
}: {
  title: string;
  lead: string;
  children: React.ReactNode;
}) {
  return (
    <div className="shell max-w-2xl py-20">
      <h1 className="font-display text-3xl font-semibold text-paper">
        {title}
      </h1>
      <p className="mt-3 text-paper-dim">{lead}</p>
      <div className="mt-8">{children}</div>
    </div>
  );
}
