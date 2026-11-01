/**
 * Promotes an existing account to admin.
 *
 *   npm run make-admin -- nev@example.com
 *
 * Sessions are JWTs, so the role on an already-signed-in session only changes
 * at the next sign-in. Sign out and back in after running this.
 */
import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../src/generated/prisma/client.ts";

for (const file of [".env.local", ".env"]) {
  try {
    process.loadEnvFile(file);
  } catch {
    // Not present.
  }
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is not set.");
  process.exit(1);
}

const email = process.argv[2]?.trim().toLowerCase();
if (!email) {
  console.error("Usage: npm run make-admin -- someone@example.com");
  process.exit(1);
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

try {
  const user = await prisma.user.update({
    where: { email },
    data: { role: "ADMIN" },
    select: { email: true, role: true },
  });

  console.log(`${user.email} is now ${user.role}.`);
  console.log("Sign out and back in for the new role to take effect.");
} catch {
  console.error(`No account found for ${email}.`);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
