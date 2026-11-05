/**
 * Bulk publisher.
 *
 * Takes a catalogue definition, renders a cover for each title, uploads the
 * PDF and the cover to Vercel Blob, and writes the rows. Re-running it is
 * safe: a book is matched on its slug and updated rather than duplicated,
 * and a file is only re-uploaded when its bytes have changed.
 *
 * It talks to the *live* site rather than holding the Blob token itself. The
 * browser-upload route already issues scoped, short-lived tokens to an admin,
 * so signing in as one and reusing that route means this script needs no
 * secret beyond the admin password - and it exercises the same path a real
 * upload takes.
 *
 *   SITE_URL=https://konyvmuhely.vercel.app \
 *   ADMIN_EMAIL=... ADMIN_PASSWORD=... \
 *   DATABASE_URL=... \
 *   npx tsx scripts/publish-books.mts [--dry-run]
 */
import { createHash } from "node:crypto";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

import { upload } from "@vercel/blob/client";
import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../src/generated/prisma/client.ts";
import { renderCover, type AccentName, type MarkName } from "./make-cover.mts";
import { CATALOGUE, type CatalogueEntry } from "./catalogue.mts";

for (const file of [".env.local", ".env"]) {
  try {
    process.loadEnvFile(file);
  } catch {
    // Not present.
  }
}

const SITE = (process.env.SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
const DRY_RUN = process.argv.includes("--dry-run");
const COVER_DIR = path.join(process.cwd(), ".covers");

function need(name: string): string {
  const value = process.env[name];
  if (!value) {
    console.error(`Missing ${name}`);
    process.exit(1);
  }
  return value;
}

// --- a cookie jar just large enough for the Auth.js handshake ---

const jar = new Map<string, string>();

function remember(response: Response): void {
  for (const raw of response.headers.getSetCookie()) {
    const [pair] = raw.split(";");
    const index = pair.indexOf("=");
    if (index > 0) jar.set(pair.slice(0, index).trim(), pair.slice(index + 1).trim());
  }
}

function cookieHeader(): string {
  return [...jar].map(([k, v]) => `${k}=${v}`).join("; ");
}

/**
 * Signs in the way the browser does. Auth.js requires the CSRF token both as
 * a cookie and in the body, so the order here matters.
 */
async function signIn(email: string, password: string): Promise<void> {
  const csrfResponse = await fetch(`${SITE}/api/auth/csrf`);
  remember(csrfResponse);
  const { csrfToken } = (await csrfResponse.json()) as { csrfToken: string };

  const body = new URLSearchParams({
    csrfToken,
    email,
    password,
    callbackUrl: `${SITE}/hu/admin`,
    redirect: "false",
  });

  const signInResponse = await fetch(`${SITE}/api/auth/callback/credentials`, {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      cookie: cookieHeader(),
    },
    body,
    redirect: "manual",
  });
  remember(signInResponse);

  const session = await fetch(`${SITE}/api/auth/session`, {
    headers: { cookie: cookieHeader() },
  });
  const data = (await session.json()) as { user?: { email?: string; role?: string } };

  if (data.user?.role !== "ADMIN") {
    console.error(
      `Sign-in failed or the account is not an admin (got ${JSON.stringify(data)}).`,
    );
    process.exit(1);
  }
  console.log(`signed in as ${data.user.email} (${data.user.role})`);
}

// --- uploading ---

async function uploadToBlob(
  pathname: string,
  bytes: Buffer,
  visibility: "public" | "private",
  contentType: string,
): Promise<{ url: string; pathname: string }> {
  const result = await upload(pathname, bytes, {
    access: visibility,
    contentType,
    handleUploadUrl: `${SITE}/api/admin/blob-upload`,
    headers: { cookie: cookieHeader() },
    multipart: bytes.byteLength > 20 * 1024 * 1024,
  });
  return { url: result.url, pathname: result.pathname };
}

function sha(bytes: Buffer): string {
  return createHash("sha256").update(bytes).digest("hex").slice(0, 16);
}

// --- main ---

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: need("DATABASE_URL") }),
});

async function publish(entry: CatalogueEntry, index: number): Promise<void> {
  const pdf = await readFile(entry.file);
  const label = `${entry.slug} (${(pdf.byteLength / 1024 / 1024).toFixed(1)} MB)`;

  const cover = renderCover({
    title: entry.coverTitle ?? entry.titleHu,
    subtitle: entry.coverSubtitle ?? entry.subtitleHu,
    author: entry.author,
    eyebrow: entry.series,
    accent: entry.accent as AccentName,
    mark: entry.mark as MarkName,
  });

  await mkdir(COVER_DIR, { recursive: true });
  await writeFile(path.join(COVER_DIR, `${entry.slug}.png`), cover);

  if (DRY_RUN) {
    console.log(`[dry-run] ${label} — cover written to .covers/${entry.slug}.png`);
    return;
  }

  const existing = await prisma.book.findUnique({
    where: { slug: entry.slug },
    select: { id: true, files: { select: { id: true, sizeBytes: true } } },
  });

  // Only pay for an upload when there is something new to upload.
  const alreadyHasFile = existing?.files.some((f) => f.sizeBytes === pdf.byteLength);

  // Private like every other blob - the store forbids public ones - and
  // reachable through our own /api/assets route.
  const coverBlob = await uploadToBlob(
    `covers/${entry.slug}-${sha(cover)}.png`,
    cover,
    "private",
    "image/png",
  );

  const pdfBlob = alreadyHasFile
    ? null
    : await uploadToBlob(
        `books/${entry.slug}/${entry.slug}-hu.pdf`,
        pdf,
        "private",
        "application/pdf",
      );

  const data = {
    slug: entry.slug,
    author: entry.author,
    titleHu: entry.titleHu,
    titleEn: entry.titleEn,
    subtitleHu: entry.subtitleHu,
    subtitleEn: entry.subtitleEn,
    blurbHu: entry.blurbHu,
    blurbEn: entry.blurbEn,
    descriptionHu: entry.descriptionHu,
    descriptionEn: entry.descriptionEn,
    priceMinor: entry.priceHuf * 100,
    currency: "huf",
    pageCount: entry.pages,
    published: true,
    featured: entry.featured ?? false,
    ageRestricted: entry.ageRestricted ?? false,
    category: entry.category ?? "BUDDHIST",
    sortIndex: index,
    coverUrl: `/api/assets/${coverBlob.pathname}`,
    coverPathname: coverBlob.pathname,
    coverStorage: "BLOB" as const,
  };

  const book = await prisma.book.upsert({
    where: { slug: entry.slug },
    update: data,
    create: data,
    select: { id: true },
  });

  if (pdfBlob) {
    await prisma.bookFile.upsert({
      where: {
        bookId_format_fileLocale: {
          bookId: book.id,
          format: "PDF",
          fileLocale: "HU",
        },
      },
      update: {
        storage: "BLOB",
        url: pdfBlob.url,
        pathname: pdfBlob.pathname,
        fileName: entry.downloadName,
        sizeBytes: pdf.byteLength,
      },
      create: {
        bookId: book.id,
        format: "PDF",
        fileLocale: "HU",
        storage: "BLOB",
        url: pdfBlob.url,
        pathname: pdfBlob.pathname,
        fileName: entry.downloadName,
        sizeBytes: pdf.byteLength,
      },
    });
  }

  // Further editions, if the entry lists any. Same skip-when-unchanged rule
  // as the main file: re-uploading 80 MB to fix a blurb helps nobody.
  for (const extra of entry.extraFiles ?? []) {
    const bytes = await readFile(extra.file);
    const slot = { format: extra.format, fileLocale: extra.locale };

    const stored = await prisma.bookFile.findUnique({
      where: { bookId_format_fileLocale: { bookId: book.id, ...slot } },
      select: { sizeBytes: true },
    });

    const extension = extra.format.toLowerCase();
    const blob =
      stored?.sizeBytes === bytes.byteLength
        ? null
        : await uploadToBlob(
            `books/${entry.slug}/${entry.slug}-${extra.locale.toLowerCase()}.${extension}`,
            bytes,
            "private",
            extra.contentType,
          );

    if (!blob) {
      console.log(`  ${extra.format} ${extra.locale}: unchanged`);
      continue;
    }

    const fileData = {
      storage: "BLOB" as const,
      url: blob.url,
      pathname: blob.pathname,
      fileName: extra.downloadName,
      sizeBytes: bytes.byteLength,
    };

    await prisma.bookFile.upsert({
      where: { bookId_format_fileLocale: { bookId: book.id, ...slot } },
      update: fileData,
      create: { bookId: book.id, ...slot, ...fileData },
    });

    console.log(
      `  ${extra.format} ${extra.locale}: ${(bytes.byteLength / 1024 / 1024).toFixed(1)} MB uploaded`,
    );
  }

  console.log(
    `published ${label}${pdfBlob ? "" : " (file unchanged, cover refreshed)"}`,
  );
}

async function main(): Promise<void> {
  if (!DRY_RUN) {
    await signIn(need("ADMIN_EMAIL"), need("ADMIN_PASSWORD"));
  }

  for (const [index, entry] of CATALOGUE.entries()) {
    try {
      await publish(entry, index);
    } catch (error) {
      console.error(
        `FAILED ${entry.slug}:`,
        error instanceof Error ? error.message : error,
      );
    }
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
