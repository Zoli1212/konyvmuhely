import Stripe from "stripe";

import { env } from "./env";

let client: Stripe | null = null;

/**
 * Lazily built Stripe client. Returns null when the store has no secret key,
 * which lets the admin area and the catalogue work on a fresh checkout before
 * Stripe is wired up.
 *
 * The API version is deliberately not pinned here: the installed SDK major
 * already pins the version it was built against, and overriding it with a
 * literal is how clients silently drift out of sync with their types.
 */
export function getStripe(): Stripe | null {
  const key = env.stripeSecretKey;
  if (!key) return null;

  if (!client) {
    client = new Stripe(key, {
      appInfo: { name: "ebook-shop" },
    });
  }
  return client;
}

/** Stripe Checkout's own `locale` values for the languages we support. */
export const stripeLocale = { hu: "hu", en: "en" } as const;
