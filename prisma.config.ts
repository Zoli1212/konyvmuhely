import { defineConfig } from "prisma/config";

// The Prisma 7 CLI deliberately does not read .env files, so we load them here.
// loadEnvFile does not overwrite variables that are already set, so listing
// .env.local first reproduces Next.js' precedence. On Vercel and in CI there is
// no .env file at all — the platform supplies the variables, so a missing file
// is not an error.
for (const file of [".env.local", ".env"]) {
  try {
    process.loadEnvFile(file);
  } catch {
    // No such file — fine.
  }
}

/**
 * Migrations and introspection use DIRECT_URL: the non-pooled connection
 * (port 5432 on Neon and Supabase). Schema changes through a transaction
 * pooler fail, which is why this is separate from DATABASE_URL.
 *
 * The datasource is only declared when the variable is actually present.
 * `prisma generate` needs no database, and it runs during `next build` on a
 * deployment that may not have one attached yet - prisma/config's `env()`
 * helper throws on a missing variable, which would fail that build for no
 * real reason. Migration commands still get the URL when it is set, and
 * complain clearly when it is not.
 */
const directUrl = process.env.DIRECT_URL;

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx scripts/seed.ts",
  },
  ...(directUrl ? { datasource: { url: directUrl } } : {}),
});
