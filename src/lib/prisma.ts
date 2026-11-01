import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "@/generated/prisma/client";
import { env } from "./env";

/**
 * Prisma 7 connects through a driver adapter rather than a URL in the schema.
 * `pg` pools connections per process, which is what we want on Vercel: each
 * warm serverless instance reuses its pool instead of opening a connection
 * per request.
 *
 * DATABASE_URL should be the *pooled* connection string (Neon's "-pooler"
 * host, Supabase's port 6543). Migrations use DIRECT_URL instead - see
 * prisma.config.ts.
 */
function createPrismaClient() {
  return new PrismaClient({
    adapter: new PrismaPg({ connectionString: env.databaseUrl }),
    log: env.isProduction ? ["error"] : ["error", "warn"],
  });
}

type Client = ReturnType<typeof createPrismaClient>;

// Next.js hot-reloads modules in development, which would otherwise leak a new
// pool on every edit.
const globalForPrisma = globalThis as unknown as { prisma?: Client };

export const prisma: Client = globalForPrisma.prisma ?? createPrismaClient();

if (!env.isProduction) {
  globalForPrisma.prisma = prisma;
}
