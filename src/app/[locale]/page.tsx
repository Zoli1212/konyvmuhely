import Link from "next/link";

import { BookCard } from "@/components/book-card";
import { ShelfLinks } from "@/components/shelf-links";
import { ArrowRightIcon, DownloadIcon, LockIcon } from "@/components/icons";
import { currentUser } from "@/lib/auth-guard";
import {
  getOwnedBookIds,
  countPublishedByCategory,
  listPublishedBooks,
  localizeBook,
} from "@/lib/books";
import { resolvePage } from "@/lib/page-locale";
import { routes } from "@/lib/routes";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale, t } = await resolvePage(params);

  const [books, shelfCounts, user] = await Promise.all([
    listPublishedBooks(),
    countPublishedByCategory(),
    currentUser(),
  ]);

  const owned = user ? await getOwnedBookIds(user.id) : new Set<string>();
  const localized = books.map((book) => localizeBook(book, locale));

  // With featured titles set, the home page reads as "these first, then the
  // rest". Without any, the whole catalogue simply takes the first slot.
  const featured = localized.filter((book) => book.featured);
  const rest = featured.length > 0 ? localized.filter((b) => !b.featured) : localized;

  return (
    <>
      {/* ---------------- hero ---------------- */}
      <section className="shell pt-16 pb-14 sm:pt-24 sm:pb-20">
        <div className="max-w-3xl">
          <p className="eyebrow">{t.home.eyebrow}</p>

          <h1 className="mt-4 font-display text-[clamp(2.25rem,6vw,4.25rem)] leading-[1.03] font-semibold text-paper">
            {t.home.title}
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-paper-dim">
            {t.home.lead}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              href={routes.books(locale)}
              className="btn btn-primary btn-lg"
            >
              {t.home.browse}
              <ArrowRightIcon className="h-4 w-4" />
            </Link>

            {user ? (
              <Link
                href={routes.library(locale)}
                className="btn btn-secondary btn-lg"
              >
                {t.home.toLibrary}
              </Link>
            ) : null}
          </div>

          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2.5 text-sm text-mute">
            <Assurance icon={<DownloadIcon className="h-4 w-4" />}>
              {t.book.instantDownload}
            </Assurance>
            <Assurance icon={<LockIcon className="h-4 w-4" />}>
              {t.book.securePayment}
            </Assurance>
            <Assurance>{t.book.noDrm}</Assurance>
          </ul>
        </div>
      </section>

      {books.length === 0 ? (
        <EmptyStore
          title={t.home.empty}
          hint={user?.role === "ADMIN" ? t.home.emptyAdmin : null}
          adminHref={user?.role === "ADMIN" ? routes.adminNewBook(locale) : null}
          adminLabel={t.admin.newBook}
        />
      ) : null}

      {/* ---------------- featured ---------------- */}
      {featured.length > 0 ? (
        <section className="shell border-t border-ink-800 py-14">
          <SectionHeading title={t.home.featured} />

          <div className="mt-9 grid grid-cols-2 gap-x-6 gap-y-11 sm:grid-cols-3 lg:grid-cols-4">
            {featured.map((book, index) => (
              <BookCard
                key={book.id}
                book={book}
                locale={locale}
                owned={owned.has(book.id)}
                priority={index < 4}
              />
            ))}
          </div>
        </section>
      ) : null}

      {/* ---------------- catalogue ---------------- */}
      {rest.length > 0 ? (
        <section className="shell border-t border-ink-800 py-14">
          <SectionHeading
            title={t.home.catalogue}
            lead={t.home.catalogueLead}
            action={
              rest.length > 8 ? (
                <Link
                  href={routes.books(locale)}
                  className="btn btn-ghost btn-sm"
                >
                  {t.home.browse}
                  <ArrowRightIcon className="h-3.5 w-3.5" />
                </Link>
              ) : null
            }
          />

          <ShelfLinks
            locale={locale}
            active={null}
            counts={shelfCounts}
            className="mt-7"
          />

          <div className="mt-9 grid grid-cols-2 gap-x-6 gap-y-11 sm:grid-cols-3 lg:grid-cols-4">
            {rest.slice(0, 8).map((book, index) => (
              <BookCard
                key={book.id}
                book={book}
                locale={locale}
                owned={owned.has(book.id)}
                priority={featured.length === 0 && index < 4}
              />
            ))}
          </div>
        </section>
      ) : null}

      {/* ---------------- how it works ---------------- */}
      <section className="shell border-t border-ink-800 py-16">
        <SectionHeading title={t.home.stepsTitle} />

        <ol className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-3">
          {t.home.steps.map((step, index) => (
            <li key={step.title}>
              <span className="font-display text-3xl leading-none font-semibold text-gold-500/50 tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 text-base font-semibold text-paper">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-mute">
                {step.text}
              </p>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}

function SectionHeading({
  title,
  lead,
  action,
}: {
  title: string;
  lead?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h2 className="font-display text-2xl font-semibold text-paper sm:text-3xl">
          {title}
        </h2>
        {lead ? <p className="mt-1.5 text-sm text-mute">{lead}</p> : null}
      </div>
      {action}
    </div>
  );
}

function Assurance({
  icon,
  children,
}: {
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-center gap-1.5">
      {icon ? <span className="text-gold-500/80">{icon}</span> : null}
      {children}
    </li>
  );
}

function EmptyStore({
  title,
  hint,
  adminHref,
  adminLabel,
}: {
  title: string;
  hint: string | null;
  adminHref: string | null;
  adminLabel: string;
}) {
  return (
    <section className="shell pb-16">
      <div className="panel px-7 py-10 text-center">
        <p className="font-display text-xl text-paper">{title}</p>
        {hint ? <p className="mt-2 text-sm text-mute">{hint}</p> : null}
        {adminHref ? (
          <Link href={adminHref} className="btn btn-primary mt-6">
            {adminLabel}
          </Link>
        ) : null}
      </div>
    </section>
  );
}
