import { blobAuthMode, blobConfigured } from "@/lib/env";
import { prisma } from "@/lib/prisma";

/**
 * Configuration and connectivity check.
 *
 * Reports only whether each variable is *set* and whether the database
 * answers - never a value, never a fragment of a secret. That is enough to
 * tell a misconfigured deployment from a broken one without the Vercel logs,
 * which is exactly the question you have right after a first deploy.
 *
 * `required` must all be true for the site to serve a page at all. The rest
 * gate individual features, and the shop degrades honestly without them.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isSet(name: string): boolean {
  const value = process.env[name];
  return typeof value === "string" && value.trim().length > 0;
}

export async function GET(): Promise<Response> {
  const required = {
    DATABASE_URL: isSet("DATABASE_URL"),
    AUTH_SECRET: isSet("AUTH_SECRET"),
  };

  const features = {
    migrations_DIRECT_URL: isSet("DIRECT_URL"),
    uploads: blobConfigured(),
    uploadsAuthMode: blobAuthMode(),
    uploads_VERCEL_OIDC_TOKEN: isSet("VERCEL_OIDC_TOKEN"),
    checkout_STRIPE_SECRET_KEY: isSet("STRIPE_SECRET_KEY"),
    fulfilment_STRIPE_WEBHOOK_SECRET: isSet("STRIPE_WEBHOOK_SECRET"),
    googleSignIn: isSet("AUTH_GOOGLE_ID") && isSet("AUTH_GOOGLE_SECRET"),
    email_RESEND_API_KEY: isSet("RESEND_API_KEY"),
    email_EMAIL_FROM: isSet("EMAIL_FROM"),
    invoicing_SZAMLAZZ_AGENT_KEY: isSet("SZAMLAZZ_AGENT_KEY"),
  };

  let database: { ok: boolean; detail: string };

  if (!required.DATABASE_URL) {
    database = { ok: false, detail: "DATABASE_URL is not set." };
  } else {
    const started = Date.now();
    try {
      // Cheapest possible round trip that still proves credentials and TLS.
      await prisma.$queryRaw`SELECT 1`;
      database = { ok: true, detail: `reachable in ${Date.now() - started}ms` };
    } catch (error) {
      // The message can name the host, which is not a secret and is the single
      // most useful thing when a connection string is wrong.
      database = {
        ok: false,
        detail:
          error instanceof Error ? error.message.slice(0, 300) : "query failed",
      };
    }
  }

  const healthy = required.DATABASE_URL && required.AUTH_SECRET && database.ok;

  return Response.json(
    {
      healthy,
      required,
      database,
      features,
      deployment: {
        env: process.env.VERCEL_ENV ?? "local",
        region: process.env.VERCEL_REGION ?? null,
        commit: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? null,
      },
    },
    {
      status: healthy ? 200 : 503,
      headers: { "Cache-Control": "no-store" },
    },
  );
}
