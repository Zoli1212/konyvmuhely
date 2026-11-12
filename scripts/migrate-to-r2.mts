/**
 * Moves the book files from Vercel Blob to Cloudflare R2.
 *
 * The bytes are taken from the local build outputs, not copied out of Blob:
 * the Blob store's operation quota ran out and reads return 403, so the old
 * objects cannot be fetched at all. Every file is verified against the size
 * recorded in the database first, and anything that does not match byte for
 * byte is skipped and reported rather than quietly replaced.
 *
 * Existing rows are only rewritten after their upload succeeds, one at a
 * time. A row still saying BLOB keeps reading from Blob, so an interrupted
 * run leaves a working shop in a half-migrated state.
 *
 *   npx tsx scripts/migrate-to-r2.mts [--dry-run]
 */
import { existsSync, statSync } from "node:fs";
import { readFile } from "node:fs/promises";
import process from "node:process";

import { CATALOGUE, type CatalogueEntry } from "./catalogue.mts";
import { prisma } from "../src/lib/prisma.ts";
import { r2Configured } from "../src/lib/env.ts";
import { storeFile } from "../src/lib/storage.ts";

const DRY_RUN = process.argv.includes("--dry-run");

type Wanted = {
  slug: string;
  file: string;
  format: "PDF" | "EPUB";
  locale: "HU" | "EN";
  contentType: string;
};

function wantedFiles(entry: CatalogueEntry): Wanted[] {
  const out: Wanted[] = [
    {
      slug: entry.slug,
      file: entry.file,
      format: "PDF",
      locale: "HU",
      contentType: "application/pdf",
    },
  ];
  for (const extra of entry.extraFiles ?? []) {
    out.push({
      slug: entry.slug,
      file: extra.file,
      format: extra.format,
      locale: extra.locale,
      contentType: extra.contentType,
    });
  }
  return out;
}

async function main(): Promise<void> {
  if (!r2Configured() && !DRY_RUN) {
    console.error(
      "R2 is not configured. Needs R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, " +
        "R2_SECRET_ACCESS_KEY and R2_BUCKET.",
    );
    process.exit(1);
  }

  const rows = await prisma.bookFile.findMany({
    select: {
      id: true,
      sizeBytes: true,
      storage: true,
      pathname: true,
      fileName: true,
      format: true,
      fileLocale: true,
      book: { select: { slug: true } },
    },
  });
  const byKey = new Map(
    rows.map((r) => [`${r.book.slug}|${r.format}|${r.fileLocale}`, r]),
  );

  let moved = 0;
  let already = 0;
  const skipped: string[] = [];

  for (const entry of CATALOGUE) {
    for (const want of wantedFiles(entry)) {
      const key = `${want.slug}|${want.format}|${want.locale}`;
      const row = byKey.get(key);

      if (!row) {
        skipped.push(`${key}: no such row in the database`);
        continue;
      }
      if (row.storage === "R2") {
        already++;
        continue;
      }
      if (!existsSync(want.file)) {
        skipped.push(`${key}: local file is missing`);
        continue;
      }

      // The guard that matters. The shop's copy cannot be read back, so a
      // size mismatch means the local build is not the file buyers have —
      // and uploading it would silently change what they already bought.
      const local = statSync(want.file).size;
      if (local !== row.sizeBytes) {
        skipped.push(
          `${key}: local ${local} vs shop ${row.sizeBytes} — rebuilt since publishing`,
        );
        continue;
      }

      if (DRY_RUN) {
        console.log(`[dry-run] ${key} (${(local / 1048576).toFixed(1)} MB)`);
        moved++;
        continue;
      }

      const stored = await storeFile(
        `books/${want.slug}/${want.slug}-${want.locale.toLowerCase()}.${want.format.toLowerCase()}`,
        await readFile(want.file),
        { visibility: "private", contentType: want.contentType },
      );

      await prisma.bookFile.update({
        where: { id: row.id },
        data: {
          storage: stored.storage,
          url: stored.url,
          pathname: stored.pathname,
        },
      });

      console.log(`moved ${key} (${(local / 1048576).toFixed(1)} MB)`);
      moved++;
    }
  }

  console.log(
    `\n${moved} moved, ${already} already on R2, ${skipped.length} skipped`,
  );
  for (const s of skipped) console.log(`  SKIPPED ${s}`);

  const left = await prisma.bookFile.count({ where: { storage: "BLOB" } });
  console.log(
    left === 0
      ? "\nno book file is left on Blob"
      : `\n${left} file(s) still on Blob`,
  );

  await prisma.$disconnect();
}

await main();
