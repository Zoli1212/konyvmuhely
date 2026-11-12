"use server";

import { head } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { defaultLocale, isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { assertAdmin } from "@/lib/auth-guard";
import { env } from "@/lib/env";
import {
  inputDecimals,
  majorToMinor,
  validateMinorAmount,
} from "@/lib/money";
import { prisma } from "@/lib/prisma";
import { routes } from "@/lib/routes";
import { slugify, uniqueSlug } from "@/lib/slug";
import { deleteStoredFile } from "@/lib/storage";
import type { BookFormState } from "./form-state";

/** Describes a file the browser already uploaded, as sent back by the form. */
const uploadedFileSchema = z.object({
  storage: z.enum(["BLOB", "LOCAL"]),
  url: z.string(),
  pathname: z.string().min(1),
  fileName: z.string().min(1),
  sizeBytes: z.number().int().nonnegative(),
});

const uploadsSchema = z.object({
  cover: uploadedFileSchema.nullable().optional(),
  files: z
    .array(
      uploadedFileSchema.extend({
        fileLocale: z.enum(["HU", "EN"]),
        format: z.enum(["PDF", "EPUB"]),
      }),
    )
    .max(4)
    .optional(),
});

const removalsSchema = z.object({
  cover: z.boolean().optional(),
  // Slot keys such as "HU:PDF".
  files: z.array(z.string()).optional(),
});

function localeFrom(formData: FormData): Locale {
  const raw = formData.get("locale");
  return isLocale(typeof raw === "string" ? raw : undefined)
    ? (raw as Locale)
    : defaultLocale;
}

function text(formData: FormData, key: string): string {
  const raw = formData.get(key);
  return typeof raw === "string" ? raw.trim() : "";
}

function optionalText(formData: FormData, key: string): string | null {
  const value = text(formData, key);
  return value.length > 0 ? value : null;
}

function checkbox(formData: FormData, key: string): boolean {
  return formData.get(key) === "on" || formData.get(key) === "true";
}

function parseJson<T>(
  formData: FormData,
  key: string,
  schema: z.ZodType<T>,
  fallback: T,
): T {
  const raw = formData.get(key);
  if (typeof raw !== "string" || raw.length === 0) return fallback;

  try {
    const parsed = schema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : fallback;
  } catch {
    return fallback;
  }
}

/**
 * Parses a price typed by a human. Accepts both "19.90" and "19,90", and
 * tolerates thousands separators, because a Hungarian admin will type
 * "4 990" as readily as "4990".
 */
function parsePriceToMinor(
  input: string,
  currency: string,
): { minor: number } | { error: "invalid" | "step" } {
  const cleaned = input
    .replace(/\s| /g, "")
    .replace(/,/g, ".")
    // Keep only the last dot as the decimal separator.
    .replace(/\.(?=.*\.)/g, "");

  const major = Number(cleaned);
  if (!Number.isFinite(major) || major <= 0) return { error: "invalid" };

  const decimals = inputDecimals(currency);
  const rounded = Number(major.toFixed(decimals));
  const minor = majorToMinor(rounded, currency);

  const problem = validateMinorAmount(minor, currency);
  if (problem === "needs-whole-major-unit") return { error: "step" };
  if (problem) return { error: "invalid" };

  return { minor };
}

/**
 * Confirms a client-side upload really landed, and takes the size from the
 * store rather than from the browser. A pathname that does not resolve means
 * the upload failed somewhere between the browser and Blob, and recording it
 * would produce a book with a download that 404s.
 */
async function verifyUpload(file: {
  storage: "BLOB" | "LOCAL" | "R2";
  url: string;
  pathname: string;
  sizeBytes: number;
}): Promise<{ url: string; pathname: string; sizeBytes: number } | null> {
  if (file.storage !== "BLOB") {
    return {
      url: file.url,
      pathname: file.pathname,
      sizeBytes: file.sizeBytes,
    };
  }

  try {
    const meta = await head(file.url || file.pathname, { token: env.blobToken });
    return { url: meta.url, pathname: meta.pathname, sizeBytes: meta.size };
  } catch {
    return null;
  }
}

async function readFormValues(formData: FormData) {
  const currency = env.storeCurrency;

  const titleHu = text(formData, "titleHu");
  const blurbHu = text(formData, "blurbHu");
  const author = text(formData, "author");

  const requestedSlug = slugify(text(formData, "slug") || titleHu);
  const price = parsePriceToMinor(text(formData, "price"), currency);

  const pageCountRaw = text(formData, "pageCount");
  const pageCount = pageCountRaw ? Number.parseInt(pageCountRaw, 10) : null;

  const sortIndexRaw = text(formData, "sortIndex");
  const sortIndex = sortIndexRaw ? Number.parseInt(sortIndexRaw, 10) : 0;

  return {
    currency,
    titleHu,
    blurbHu,
    author,
    requestedSlug,
    price,
    data: {
      author,
      titleHu,
      titleEn: optionalText(formData, "titleEn"),
      subtitleHu: optionalText(formData, "subtitleHu"),
      subtitleEn: optionalText(formData, "subtitleEn"),
      blurbHu,
      blurbEn: optionalText(formData, "blurbEn"),
      descriptionHu: optionalText(formData, "descriptionHu"),
      descriptionEn: optionalText(formData, "descriptionEn"),
      currency,
      pageCount: Number.isFinite(pageCount) && pageCount! > 0 ? pageCount : null,
      published: checkbox(formData, "published"),
      featured: checkbox(formData, "featured"),
      sortIndex: Number.isFinite(sortIndex) ? sortIndex : 0,
    },
    uploads: parseJson(formData, "uploads", uploadsSchema, {}),
    removals: parseJson(formData, "removals", removalsSchema, {}),
  };
}

export async function createBook(
  _prev: BookFormState,
  formData: FormData,
): Promise<BookFormState> {
  const locale = localeFrom(formData);
  const t = getDictionary(locale);

  try {
    await assertAdmin();
  } catch {
    return { error: t.errors.unauthorized };
  }

  const values = await readFormValues(formData);

  if (!values.titleHu) return { error: t.errors.fieldRequired };
  if (!values.author) return { error: t.errors.fieldRequired };
  if (!values.blurbHu) return { error: t.errors.fieldRequired };

  if ("error" in values.price) {
    return {
      error:
        values.price.error === "step"
          ? t.errors.priceStep(values.currency)
          : t.errors.priceInvalid,
    };
  }

  const existingSlugs = await prisma.book.findMany({ select: { slug: true } });
  const slug = uniqueSlug(
    values.requestedSlug,
    existingSlugs.map((b) => b.slug),
  );

  const cover = values.uploads.cover
    ? await verifyUpload(values.uploads.cover)
    : null;

  if (values.uploads.cover && !cover) {
    return { error: t.errors.uploadFailed };
  }

  const bookFiles: {
    fileLocale: "HU" | "EN";
    format: "PDF" | "EPUB";
    storage: "BLOB" | "LOCAL" | "R2";
    url: string;
    pathname: string;
    fileName: string;
    sizeBytes: number;
  }[] = [];

  for (const file of values.uploads.files ?? []) {
    const verified = await verifyUpload(file);
    if (!verified) return { error: t.errors.uploadFailed };

    bookFiles.push({
      fileLocale: file.fileLocale,
      format: file.format,
      storage: file.storage,
      fileName: file.fileName,
      ...verified,
    });
  }

  const book = await prisma.book.create({
    data: {
      ...values.data,
      slug,
      priceMinor: values.price.minor,
      coverUrl: cover?.url ?? null,
      coverPathname: cover?.pathname ?? null,
      coverStorage: cover ? values.uploads.cover!.storage : null,
      files: { create: bookFiles },
    },
    select: { id: true },
  });

  revalidatePath("/", "layout");
  redirect(routes.adminEditBook(locale, book.id));
}

export async function updateBook(
  _prev: BookFormState,
  formData: FormData,
): Promise<BookFormState> {
  const locale = localeFrom(formData);
  const t = getDictionary(locale);

  try {
    await assertAdmin();
  } catch {
    return { error: t.errors.unauthorized };
  }

  const bookId = text(formData, "bookId");
  if (!bookId) return { error: t.errors.generic };

  const current = await prisma.book.findUnique({
    where: { id: bookId },
    select: {
      id: true,
      slug: true,
      coverUrl: true,
      coverPathname: true,
      coverStorage: true,
      files: {
        select: {
          id: true,
          format: true,
          fileLocale: true,
          storage: true,
          url: true,
          pathname: true,
        },
      },
    },
  });

  if (!current) return { error: t.errors.notFound };

  const values = await readFormValues(formData);

  if (!values.titleHu || !values.author || !values.blurbHu) {
    return { error: t.errors.fieldRequired };
  }

  if ("error" in values.price) {
    return {
      error:
        values.price.error === "step"
          ? t.errors.priceStep(values.currency)
          : t.errors.priceInvalid,
    };
  }

  // Keep the existing slug unless the admin actually changed it.
  let slug = current.slug;
  if (values.requestedSlug && values.requestedSlug !== current.slug) {
    const taken = await prisma.book.findFirst({
      where: { slug: values.requestedSlug, NOT: { id: bookId } },
      select: { id: true },
    });
    if (taken) return { error: t.errors.slugTaken };
    slug = values.requestedSlug;
  }

  // --- cover ---

  const newCover = values.uploads.cover
    ? await verifyUpload(values.uploads.cover)
    : null;

  if (values.uploads.cover && !newCover) {
    return { error: t.errors.uploadFailed };
  }

  const dropCover = values.removals.cover === true;

  const coverFields =
    newCover !== null
      ? {
          coverUrl: newCover.url,
          coverPathname: newCover.pathname,
          coverStorage: values.uploads.cover!.storage,
        }
      : dropCover
        ? { coverUrl: null, coverPathname: null, coverStorage: null }
        : {};

  // --- files ---

  const removeSlots = new Set(values.removals.files ?? []);
  const replacedSlots = new Set(
    (values.uploads.files ?? []).map((f) => `${f.fileLocale}:${f.format}`),
  );

  const filesToDelete = current.files.filter((f) => {
    const slot = `${f.fileLocale}:${f.format}`;
    return removeSlots.has(slot) || replacedSlots.has(slot);
  });

  const newFiles: {
    fileLocale: "HU" | "EN";
    format: "PDF" | "EPUB";
    storage: "BLOB" | "LOCAL" | "R2";
    url: string;
    pathname: string;
    fileName: string;
    sizeBytes: number;
  }[] = [];

  for (const file of values.uploads.files ?? []) {
    const verified = await verifyUpload(file);
    if (!verified) return { error: t.errors.uploadFailed };

    newFiles.push({
      fileLocale: file.fileLocale,
      format: file.format,
      storage: file.storage,
      fileName: file.fileName,
      ...verified,
    });
  }

  await prisma.$transaction(async (tx) => {
    if (filesToDelete.length > 0) {
      await tx.bookFile.deleteMany({
        where: { id: { in: filesToDelete.map((f) => f.id) } },
      });
    }

    await tx.book.update({
      where: { id: bookId },
      data: {
        ...values.data,
        slug,
        priceMinor: (values.price as { minor: number }).minor,
        ...coverFields,
        ...(newFiles.length > 0 ? { files: { create: newFiles } } : {}),
      },
    });
  });

  // Storage cleanup happens after the database agrees, so a failed commit
  // never leaves rows pointing at deleted files. Both drivers give every
  // upload a unique pathname, but the equality guards below mean that even if
  // that ever stopped being true, a replacement could not delete itself.
  const livePathnames = new Set([
    ...newFiles.map((f) => f.pathname),
    ...(newCover ? [newCover.pathname] : []),
  ]);

  for (const file of filesToDelete) {
    if (livePathnames.has(file.pathname)) continue;

    await deleteStoredFile({
      storage: file.storage,
      pathname: file.pathname,
      url: file.url,
    });
  }

  const coverReplaced = newCover !== null || dropCover;
  if (
    coverReplaced &&
    current.coverPathname &&
    current.coverStorage &&
    !livePathnames.has(current.coverPathname)
  ) {
    await deleteStoredFile({
      storage: current.coverStorage,
      pathname: current.coverPathname,
      url: current.coverUrl,
    });
  }

  revalidatePath("/", "layout");
  return { error: null, ok: true };
}

export async function deleteBook(formData: FormData): Promise<void> {
  const locale = localeFrom(formData);
  await assertAdmin();

  const bookId = text(formData, "bookId");
  if (!bookId) return;

  const book = await prisma.book.findUnique({
    where: { id: bookId },
    select: {
      coverUrl: true,
      coverPathname: true,
      coverStorage: true,
      files: {
        select: { storage: true, pathname: true, url: true },
      },
      _count: { select: { orderItems: true } },
    },
  });

  if (!book) return;

  // A sold book is part of someone's order history and someone's library.
  // OrderItem deliberately restricts the delete; rather than surface a foreign
  // key error, send the admin back with an explanation. Unpublishing takes the
  // book out of the shop without rewriting the past.
  if (book._count.orderItems > 0) {
    redirect(`${routes.adminEditBook(locale, bookId)}?problem=has-sales`);
  }

  // BookFile and Entitlement both cascade from Book.
  await prisma.book.delete({ where: { id: bookId } });

  for (const file of book.files) {
    await deleteStoredFile({
      storage: file.storage,
      pathname: file.pathname,
      url: file.url,
    });
  }

  if (book.coverPathname && book.coverStorage) {
    await deleteStoredFile({
      storage: book.coverStorage,
      pathname: book.coverPathname,
      url: book.coverUrl,
    });
  }

  revalidatePath("/", "layout");
  redirect(routes.adminBooks(locale));
}
