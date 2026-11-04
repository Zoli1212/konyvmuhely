import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BuyControls } from "@/components/buy-controls";
import { Cover } from "@/components/cover";
import { ArrowLeftIcon, CheckIcon } from "@/components/icons";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale } from "@/i18n/config";
import { currentUser } from "@/lib/auth-guard";
import { getBookBySlug, groupFilesByLocale, localizeBook } from "@/lib/books";
import { readCart } from "@/lib/cart";
import { formatMoney } from "@/lib/money";
import { resolvePage } from "@/lib/page-locale";
import { prisma } from "@/lib/prisma";
import { routes } from "@/lib/routes";
import { formatBytes } from "@/lib/storage";
import { localeTags } from "@/i18n/config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};

  const record = await getBookBySlug(slug);
  if (!record || !record.published) return {};

  const book = localizeBook(record, locale);

  return {
    title: book.title,
    description: book.blurb,
    alternates: { canonical: routes.book(locale, slug) },
    openGraph: {
      type: "book",
      title: book.title,
      description: book.blurb,
      images: book.coverUrl ? [{ url: book.coverUrl }] : undefined,
    },
  };
}

export default async function BookPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, t } = await resolvePage(params);
  const { slug } = await params;

  const record = await getBookBySlug(slug);
  if (!record) notFound();

  const user = await currentUser();

  // Unpublished books stay visible to admins so a draft can be previewed.
  if (!record.published && user?.role !== "ADMIN") notFound();

  const [cart, entitlement] = await Promise.all([
    readCart(),
    user
      ? prisma.entitlement.findUnique({
          where: { userId_bookId: { userId: user.id, bookId: record.id } },
          select: { id: true },
        })
      : Promise.resolve(null),
  ]);

  const book = localizeBook(record, locale);
  const owned = Boolean(entitlement);
  const editions = groupFilesByLocale(record.files);

  const paragraphs = (book.description ?? "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="shell py-10 sm:py-14">
      <Link
        href={routes.books(locale)}
        className="inline-flex items-center gap-1.5 text-sm text-mute transition-colors hover:text-gold-300"
      >
        <ArrowLeftIcon className="h-3.5 w-3.5" />
        {t.book.backToBooks}
      </Link>

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,19rem)_minmax(0,1fr)] lg:gap-16">
        {/* ---------------- cover column ---------------- */}
        <div className="mx-auto w-full max-w-[16rem] lg:sticky lg:top-24 lg:mx-0 lg:max-w-none lg:self-start">
          <Cover
            title={book.title}
            author={book.author}
            coverUrl={book.coverUrl}
            priority
            sizes="(min-width: 1024px) 19rem, 16rem"
          />

          {!record.published ? (
            <p className="mt-4 text-center text-xs tracking-wide text-gold-400 uppercase lg:text-left">
              {t.admin.status.draft}
            </p>
          ) : null}
        </div>

        {/* ---------------- detail column ---------------- */}
        <div className="min-w-0">
          <p className="text-xs tracking-[0.14em] text-gold-400 uppercase">
            {book.author}
          </p>

          <h1 className="mt-3 font-display text-[clamp(2rem,4.6vw,3.25rem)] leading-[1.06] font-semibold text-paper">
            {book.title}
          </h1>

          {book.subtitle ? (
            <p className="mt-3 font-display text-xl leading-snug text-paper-dim italic">
              {book.subtitle}
            </p>
          ) : null}

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-paper-dim">
            {book.blurb}
          </p>

          {/* --- price + buy --- */}
          <div className="panel mt-9 flex flex-wrap items-center gap-x-8 gap-y-5 px-6 py-5">
            {owned ? (
              <p className="flex items-center gap-2 font-display text-xl font-semibold text-sage-400">
                <CheckIcon className="h-5 w-5" />
                {t.book.owned}
              </p>
            ) : (
              <p className="font-display text-[1.875rem] leading-none font-semibold text-gold-300 tabular-nums">
                {formatMoney(book.priceMinor, book.currency, locale)}
              </p>
            )}

            <div className="flex-1" />

            <BuyControls
              bookId={record.id}
              locale={locale}
              owned={owned}
              inCart={cart.includes(record.id)}
              hasFiles={record.files.length > 0}
            />
          </div>

          {/* --- what you get --- */}
          {editions.length > 0 ? (
            <section className="mt-10">
              <h2 className="font-display text-lg font-semibold text-paper">
                {t.book.editions}
              </h2>

              <ul className="mt-4 divide-y divide-ink-800 border-y border-ink-800">
                {editions.map((edition) => (
                  <li
                    key={edition.locale}
                    className="flex flex-wrap items-baseline gap-x-4 gap-y-1 py-3"
                  >
                    <span className="min-w-24 text-sm font-medium text-paper">
                      {edition.locale === "HU"
                        ? t.book.editionHu
                        : t.book.editionEn}
                    </span>

                    <span className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-mute">
                      {edition.files.map((file) => (
                        <span key={file.id} className="tabular-nums">
                          <span className="font-medium text-gold-300">
                            {file.format}
                          </span>{" "}
                          {formatBytes(file.sizeBytes, localeTags[locale])}
                        </span>
                      ))}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {/* --- details --- */}
          {record.pageCount ? (
            <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-3 text-sm">
              <div>
                <dt className="text-xs tracking-wide text-mute uppercase">
                  {t.book.pages}
                </dt>
                <dd className="mt-1 text-paper tabular-nums">
                  {t.book.pagesValue(record.pageCount)}
                </dd>
              </div>
            </dl>
          ) : null}

          {/* An age mark on the card is a label; here, where someone decides
              whether to buy, it has to say what it is about. */}
          {record.ageRestricted ? (
            <div className="panel mt-8 flex items-start gap-3 border-rose-400/35 px-5 py-4">
              <span className="chip chip-warn shrink-0">
                {t.book.ageRestricted}
              </span>
              <p className="text-sm leading-relaxed text-paper-dim">
                {t.book.ageRestrictedNote}
              </p>
            </div>
          ) : null}

          {/* --- long description --- */}
          {paragraphs.length > 0 ? (
            <section className="mt-12 max-w-2xl border-t border-ink-800 pt-10">
              <h2 className="font-display text-2xl font-semibold text-paper">
                {t.book.about}
              </h2>

              <div className="prose-book mt-5">
                {paragraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </section>
          ) : null}

          <ul className="mt-12 flex flex-wrap gap-x-6 gap-y-2 border-t border-ink-800 pt-6 text-sm text-mute">
            <li>{t.book.instantDownload}</li>
            <li>{t.book.unlimitedRedownload}</li>
            <li>{t.book.noDrm}</li>
            <li>{t.book.securePayment}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
