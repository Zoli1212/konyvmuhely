import { defineConfig, env } from "prisma/config";

// A Prisma 7 CLI szándékosan nem olvas .env fájlt, ezért kézzel töltjük be.
// Vercelen (és minden CI-ben) nincs .env fájl, ott a platform adja a változókat,
// így a hiányzó fájl nem hiba.
for (const file of [".env.local", ".env"]) {
  try {
    process.loadEnvFile(file);
  } catch {
    // nincs ilyen fájl – rendben
  }
}

/**
 * Prisma 7 óta a kapcsolati URL-ek itt vannak, nem a schema.prisma-ban.
 *
 * A migrációk és az introspekció DIRECT_URL-t használnak: ez a poolerrel
 * nem átjátszott, közvetlen kapcsolat (Neon/Supabase esetén az 5432-es port).
 * A futásidejű, poolozott kapcsolatot a DATABASE_URL adja, azt a
 * PrismaClient driver-adaptere olvassa (lásd src/lib/prisma.ts).
 */
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx scripts/seed.ts",
  },
  datasource: {
    url: env("DIRECT_URL"),
  },
});
