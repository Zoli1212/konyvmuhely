/**
 * Creates the first admin account, and a draft book so the catalogue has
 * something to look at on a fresh install.
 *
 * Safe to re-run: the admin is upserted by email and the sample book by slug.
 *
 *   npm run seed
 */
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../src/generated/prisma/client.ts";

for (const file of [".env.local", ".env"]) {
  try {
    process.loadEnvFile(file);
  } catch {
    // Not present - the platform supplies the variables.
  }
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is not set. Copy .env.example to .env first.");
  process.exit(1);
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

const SAMPLE_SLUG = "pelda-kotet";

async function main() {
  const email = (process.env.SEED_ADMIN_EMAIL || "").trim().toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD || "";
  const name = process.env.SEED_ADMIN_NAME || "Administrator";

  if (!email || !password) {
    console.error(
      "Set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD in .env before seeding.",
    );
    process.exit(1);
  }

  if (password.length < 8) {
    console.error("SEED_ADMIN_PASSWORD must be at least 8 characters.");
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const admin = await prisma.user.upsert({
    where: { email },
    update: { role: "ADMIN", passwordHash, name },
    create: { email, name, passwordHash, role: "ADMIN" },
    select: { id: true, email: true },
  });

  console.log(`Admin ready: ${admin.email}`);

  const existing = await prisma.book.findUnique({
    where: { slug: SAMPLE_SLUG },
    select: { id: true },
  });

  if (existing) {
    console.log("Sample book already present; leaving it alone.");
  } else {
    // Left unpublished on purpose: it is a shape to edit, not a product.
    await prisma.book.create({
      data: {
        slug: SAMPLE_SLUG,
        author: "Minta Szerző",
        titleHu: "Példa kötet",
        titleEn: "Sample Title",
        subtitleHu: "Ezt a kötetet bátran átírhatod",
        subtitleEn: "Feel free to rewrite this one",
        blurbHu:
          "Ez egy vázlat állapotú példakönyv, hogy legyen mit szerkeszteni. A kezelőfelületen írd át, töltsd fel a borítót és a fájlokat, majd tedd láthatóvá.",
        blurbEn:
          "A draft sample book so there is something to edit. Rewrite it in the admin area, upload a cover and files, then make it visible.",
        descriptionHu:
          "A hosszú leírás bekezdéseit üres sor választja el.\n\nA könyv oldalán ez a szöveg jelenik meg a rövid ismertető alatt, a megvásárolható kiadások fölött.",
        descriptionEn:
          "Paragraphs in the long description are separated by a blank line.\n\nOn the book page this text appears under the short description, above the list of editions.",
        priceMinor: 499000,
        currency: process.env.NEXT_PUBLIC_STORE_CURRENCY?.toLowerCase() || "huf",
        pageCount: 248,
        published: false,
        featured: false,
        sortIndex: 0,
      },
    });

    console.log(`Sample draft book created: /${SAMPLE_SLUG}`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
