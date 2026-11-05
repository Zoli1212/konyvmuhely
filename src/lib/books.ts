import type { Prisma } from "@/generated/prisma/client";
import type { BookCategory, FileLocale } from "@/generated/prisma/enums";
import type { Locale } from "@/i18n/config";
import { prisma } from "./prisma";

/**
 * The shape every book query returns. Keeping one select means the storefront,
 * the library and the admin tables all agree on what a book is, and no query
 * accidentally drags along a 200 KB description it does not render.
 *
 * BookRecord is derived from the select rather than written by hand, so adding
 * a column here cannot leave the type behind.
 */
const bookSelect = {
  id: true,
  slug: true,
  author: true,
  titleHu: true,
  titleEn: true,
  subtitleHu: true,
  subtitleEn: true,
  blurbHu: true,
  blurbEn: true,
  descriptionHu: true,
  descriptionEn: true,
  priceMinor: true,
  currency: true,
  coverUrl: true,
  pageCount: true,
  published: true,
  featured: true,
  ageRestricted: true,
  category: true,
  sortIndex: true,
  createdAt: true,
  files: {
    select: {
      id: true,
      format: true,
      fileLocale: true,
      fileName: true,
      sizeBytes: true,
      storage: true,
    },
    orderBy: [{ fileLocale: "asc" }, { format: "asc" }],
  },
} satisfies Prisma.BookSelect;

export type BookRecord = Prisma.BookGetPayload<{ select: typeof bookSelect }>;

/** A book with its text resolved to one language. */
export type LocalizedBook = Omit<
  BookRecord,
  | "titleHu"
  | "titleEn"
  | "subtitleHu"
  | "subtitleEn"
  | "blurbHu"
  | "blurbEn"
  | "descriptionHu"
  | "descriptionEn"
> & {
  title: string;
  subtitle: string | null;
  blurb: string;
  description: string | null;
};

/**
 * Where a booklet ends and a book begins.
 *
 * The catalogue holds twelve-page handbooks next to three-hundred-page
 * volumes at very different prices, and a card showing only a price leaves
 * the buyer guessing which they are looking at. Derived from the page count
 * rather than stored, so it cannot drift away from the file.
 */
export const BOOKLET_MAX_PAGES = 40;

export function isBooklet(pageCount: number | null): boolean {
  return pageCount !== null && pageCount <= BOOKLET_MAX_PAGES;
}

/**
 * Picks one of a Hungarian/English pair. Hungarian is the base, so an English
 * visitor looking at a Hungarian-only title still sees real text rather than
 * an empty label. Use this for partial selects that do not warrant a full
 * BookRecord.
 */
export function pickText(
  hu: string,
  en: string | null | undefined,
  locale: Locale,
): string {
  return locale === "en" && en && en.trim().length > 0 ? en : hu;
}

/**
 * Resolves the bilingual columns for one language. Hungarian is the base, so
 * an English visitor looking at a Hungarian-only title still sees real text
 * rather than an empty page.
 */
export function localizeBook(book: BookRecord, locale: Locale): LocalizedBook {
  const pick = (hu: string, en: string | null): string =>
    locale === "en" && en && en.trim().length > 0 ? en : hu;

  const pickOptional = (hu: string | null, en: string | null): string | null => {
    if (locale === "en" && en && en.trim().length > 0) return en;
    return hu && hu.trim().length > 0 ? hu : null;
  };

  const {
    titleHu,
    titleEn,
    subtitleHu,
    subtitleEn,
    blurbHu,
    blurbEn,
    descriptionHu,
    descriptionEn,
    ...rest
  } = book;

  return {
    ...rest,
    title: pick(titleHu, titleEn),
    subtitle: pickOptional(subtitleHu, subtitleEn),
    blurb: pick(blurbHu, blurbEn),
    description: pickOptional(descriptionHu, descriptionEn),
  };
}

export async function listPublishedBooks(
  category?: BookCategory,
): Promise<BookRecord[]> {
  return prisma.book.findMany({
    where: { published: true, ...(category ? { category } : {}) },
    orderBy: [{ sortIndex: "asc" }, { createdAt: "desc" }],
    select: bookSelect,
  });
}

/** How many published titles sit on each shelf, for the tab labels. */
export async function countPublishedByCategory(): Promise<
  Record<BookCategory, number>
> {
  const rows = await prisma.book.groupBy({
    by: ["category"],
    where: { published: true },
    _count: { _all: true },
  });

  const counts: Record<BookCategory, number> = { BUDDHIST: 0, ESOTERIC: 0 };
  for (const row of rows) counts[row.category] = row._count._all;
  return counts;
}

export async function listAllBooks(): Promise<BookRecord[]> {
  return prisma.book.findMany({
    orderBy: [{ sortIndex: "asc" }, { createdAt: "desc" }],
    select: bookSelect,
  });
}

export async function getBookBySlug(slug: string): Promise<BookRecord | null> {
  return prisma.book.findUnique({ where: { slug }, select: bookSelect });
}

export async function getBookById(id: string): Promise<BookRecord | null> {
  return prisma.book.findUnique({ where: { id }, select: bookSelect });
}

/** Book ids the user owns, for "already yours" badges and cart filtering. */
export async function getOwnedBookIds(userId: string): Promise<Set<string>> {
  const rows = await prisma.entitlement.findMany({
    where: { userId },
    select: { bookId: true },
  });
  return new Set(rows.map((r) => r.bookId));
}

/** Everything the library page needs: owned books plus when they were bought. */
export async function getLibrary(userId: string) {
  const entitlements = await prisma.entitlement.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      createdAt: true,
      book: { select: bookSelect },
    },
  });

  return entitlements.map((e) => ({
    purchasedAt: e.createdAt,
    book: e.book,
  }));
}

/** Groups a book's files by language, for the download lists. */
export function groupFilesByLocale(files: BookRecord["files"]) {
  const groups: { locale: FileLocale; files: BookRecord["files"] }[] = [];

  for (const fileLocale of ["HU", "EN"] as const) {
    const matching = files.filter((f) => f.fileLocale === fileLocale);
    if (matching.length > 0) groups.push({ locale: fileLocale, files: matching });
  }

  return groups;
}
