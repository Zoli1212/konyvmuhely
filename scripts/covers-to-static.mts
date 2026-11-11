/**
 * Moves every cover out of Blob storage and into the repository.
 *
 * Covers were private blobs, so each one cost a token-authenticated read
 * through /api/assets — a metered "advanced operation". With sixty books
 * that is a standing charge for images that never change between builds,
 * and when the store's operation quota ran out the whole shop lost its
 * covers at once.
 *
 * They are 16 kB apiece: the entire set is under a megabyte, which belongs
 * in the repo and on the CDN, not behind an authenticated read. Book files
 * stay in Blob — those are gigabytes and must stay entitlement-checked.
 *
 * Run once to migrate; publish-books.mts writes covers here from now on.
 */
import { mkdir, readdir, writeFile, readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

import { prisma } from "../src/lib/prisma.ts";

const HERE = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1"));
const ROOT = path.resolve(HERE, "..");
const FROM = path.join(ROOT, ".covers");
const TO = path.join(ROOT, "public", "covers");

async function main(): Promise<void> {
  await mkdir(TO, { recursive: true });

  const files = (await readdir(FROM)).filter((f) => f.endsWith(".webp"));
  if (files.length === 0) {
    console.error("No covers in .covers/ — run publish-books.mts --dry-run first.");
    process.exit(1);
  }

  let moved = 0;
  let updated = 0;

  for (const file of files) {
    const slug = file.replace(/\.webp$/, "");
    await writeFile(path.join(TO, file), await readFile(path.join(FROM, file)));
    moved++;

    const res = await prisma.book.updateMany({
      where: { slug },
      // No pathname and no storage kind: the URL is a plain static path, so
      // nothing downstream should try to resolve it through a driver.
      data: {
        coverUrl: `/covers/${file}`,
        coverPathname: null,
        coverStorage: null,
      },
    });
    updated += res.count;
  }

  console.log(`copied ${moved} covers into public/covers/`);
  console.log(`pointed ${updated} books at the static path`);

  const left = await prisma.book.count({
    where: { coverUrl: { startsWith: "/api/assets/" } },
  });
  console.log(
    left === 0
      ? "no book still reads its cover through Blob"
      : `WARNING: ${left} book(s) still point at /api/assets/`,
  );

  await prisma.$disconnect();
}

await main();
