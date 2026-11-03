/**
 * Pushes catalogue wording to the database and nothing else.
 *
 * publish-books re-renders covers and re-checks every PDF, which is a lot of
 * work when only a blurb changed. This touches the text columns alone, so a
 * wording fix costs one query per book and cannot disturb a stored file.
 *
 *   DATABASE_URL=... npx tsx scripts/sync-text.mts [--dry-run]
 */
import { CATALOGUE } from "./catalogue.mts";
import { prisma } from "../src/lib/prisma.ts";

const DRY_RUN = process.argv.includes("--dry-run");

const TEXT_COLUMNS = [
  "titleHu",
  "titleEn",
  "subtitleHu",
  "subtitleEn",
  "blurbHu",
  "blurbEn",
  "descriptionHu",
  "descriptionEn",
] as const;

let changed = 0;
let identical = 0;
let missing = 0;

for (const entry of CATALOGUE) {
  const book = await prisma.book.findUnique({
    where: { slug: entry.slug },
    select: Object.fromEntries(TEXT_COLUMNS.map((c) => [c, true])),
  });

  if (!book) {
    console.log(`  missing in database: ${entry.slug}`);
    missing += 1;
    continue;
  }

  const diffs = TEXT_COLUMNS.filter(
    (column) => (book[column] ?? null) !== (entry[column] ?? null),
  );

  if (diffs.length === 0) {
    identical += 1;
    continue;
  }

  console.log(`  ${entry.slug}: ${diffs.join(", ")}`);

  if (!DRY_RUN) {
    await prisma.book.update({
      where: { slug: entry.slug },
      data: Object.fromEntries(diffs.map((c) => [c, entry[c] ?? null])),
    });
  }
  changed += 1;
}

console.log(
  `\n${changed} updated, ${identical} already current, ${missing} not in the database.` +
    (DRY_RUN ? "  (dry run — nothing written)" : ""),
);

await prisma.$disconnect();
