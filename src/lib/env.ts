/**
 * Centralised environment access.
 *
 * Values are read lazily through getters so that an unconfigured optional
 * integration (Stripe, Google, Blob) never breaks an unrelated page at import
 * time. Anything genuinely required throws a message that names the variable.
 */

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing environment variable: ${name}. Copy .env.example to .env and fill it in.`,
    );
  }
  return value;
}

function optional(name: string): string | undefined {
  const value = process.env[name];
  return value && value.length > 0 ? value : undefined;
}

export const env = {
  get databaseUrl() {
    return required("DATABASE_URL");
  },

  get stripeSecretKey() {
    return optional("STRIPE_SECRET_KEY");
  },
  get stripeWebhookSecret() {
    return optional("STRIPE_WEBHOOK_SECRET");
  },

  get blobToken() {
    return optional("BLOB_READ_WRITE_TOKEN");
  },
  /**
   * Set by Vercel's Blob integration when the store is connected to the
   * project. Its presence means the SDK can authenticate with the short-lived
   * OIDC token instead of a long-lived read-write token.
   */
  get blobStoreId() {
    return optional("BLOB_STORE_ID");
  },

  get googleClientId() {
    return optional("AUTH_GOOGLE_ID");
  },
  get googleClientSecret() {
    return optional("AUTH_GOOGLE_SECRET");
  },

  get storeName() {
    return process.env.NEXT_PUBLIC_STORE_NAME || "Buddhista Könyvműhely";
  },
  get storeCurrency() {
    return (process.env.NEXT_PUBLIC_STORE_CURRENCY || "huf").toLowerCase();
  },

  get isProduction() {
    return process.env.NODE_ENV === "production";
  },
};

/**
 * The selling company. Hungarian law requires a webshop to publish its
 * registered name, seat, company registration number and tax number, so
 * these are read from configuration rather than written into the page -
 * and anything still missing is rendered as a visible gap instead of being
 * quietly omitted.
 */
export type Company = {
  name: string;
  seat: string | null;
  registrationNumber: string | null;
  taxNumber: string | null;
  email: string | null;
  phone: string | null;
  representative: string | null;
};

export function company(): Company {
  return {
    name: process.env.COMPANY_NAME || "Carboon-Code Kurzor Kft.",
    seat: optional("COMPANY_SEAT") ?? null,
    registrationNumber: optional("COMPANY_REG_NUMBER") ?? null,
    taxNumber: optional("COMPANY_TAX_NUMBER") ?? null,
    email: optional("COMPANY_EMAIL") ?? optional("STORE_REPLY_TO") ?? null,
    phone: optional("COMPANY_PHONE") ?? null,
    representative: optional("COMPANY_REPRESENTATIVE") ?? null,
  };
}

/**
 * True when Vercel Blob can be reached at all, by either authentication
 * route. Connecting a Blob store in the dashboard now provisions
 * BLOB_STORE_ID and OIDC rather than a read-write token, so checking only for
 * the token would silently fall back to local disk on a correctly configured
 * deployment.
 */
export function blobConfigured(): boolean {
  return Boolean(env.blobToken || env.blobStoreId);
}

/** Which credential the Blob SDK will end up using. For diagnostics. */
export function blobAuthMode(): "read-write-token" | "oidc" | "none" {
  if (env.blobToken) return "read-write-token";
  if (env.blobStoreId) return "oidc";
  return "none";
}

/** True when Google sign-in can actually be offered. */
export function googleEnabled(): boolean {
  return Boolean(env.googleClientId && env.googleClientSecret);
}

/** True when checkout can actually be started. */
export function stripeEnabled(): boolean {
  return Boolean(env.stripeSecretKey);
}

/**
 * Absolute origin of this deployment, used for Stripe return URLs and
 * canonical links. NEXT_PUBLIC_SITE_URL wins so a custom domain can override
 * the generated Vercel URL.
 */
export function siteUrl(): string {
  const explicit = optional("NEXT_PUBLIC_SITE_URL");
  if (explicit) return explicit.replace(/\/$/, "");

  const production = optional("VERCEL_PROJECT_PRODUCTION_URL");
  if (production) return `https://${production}`;

  const deployment = optional("VERCEL_URL");
  if (deployment) return `https://${deployment}`;

  return "http://localhost:3000";
}
