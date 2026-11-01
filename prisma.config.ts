import { defineConfig, env } from "prisma/config";

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
