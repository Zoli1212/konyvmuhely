/**
 * Points Stripe's webhook at this deployment and prints the signing secret.
 *
 * Done here rather than by hand because the signing secret is shown once in
 * the dashboard and is easy to mistype, and because the event list has to
 * match what the route actually handles — subscribe to less and a paid order
 * silently never gets fulfilled.
 *
 *   STRIPE_SECRET_KEY=sk_test_... npx tsx scripts/stripe-webhook.mts
 *
 * Run it again for the live key when going live; each key has its own
 * endpoints and its own signing secret.
 */
import Stripe from "stripe";

/** Exactly the events src/app/api/stripe/webhook/route.ts acts on. */
const EVENTS: Stripe.WebhookEndpointCreateParams.EnabledEvent[] = [
  "checkout.session.completed",
  "checkout.session.async_payment_succeeded",
  "checkout.session.async_payment_failed",
  "checkout.session.expired",
  "charge.refunded",
];

const key = process.env.STRIPE_SECRET_KEY;
const site = process.env.SITE_URL ?? "https://buddhista-konyvmuhely.vercel.app";

if (!key) {
  console.error("Set STRIPE_SECRET_KEY.");
  process.exit(1);
}

const url = `${site.replace(/\/$/, "")}/api/stripe/webhook`;
const stripe = new Stripe(key, { appInfo: { name: "ebook-shop setup" } });
const live = key.startsWith("sk_live_");

console.error(`Mode: ${live ? "LIVE" : "test"}`);

// --- the account itself ---

const account = await stripe.accounts.retrieve();
console.error(`Account: ${account.id}`);
console.error(`  country:          ${account.country}`);
console.error(`  default currency: ${account.default_currency?.toUpperCase()}`);
console.error(`  charges enabled:  ${account.charges_enabled}`);
console.error(`  payouts enabled:  ${account.payouts_enabled}`);

if (account.country !== "HU") {
  console.error(`\n  ! Country is ${account.country}, not HU. It cannot be changed later.`);
}
if (account.default_currency && account.default_currency.toLowerCase() !== "huf") {
  console.error(`\n  ! Default currency is ${account.default_currency.toUpperCase()}, not HUF.`);
}

// --- the endpoint ---

const existing = await stripe.webhookEndpoints.list({ limit: 100 });
for (const endpoint of existing.data) {
  if (endpoint.url === url) {
    await stripe.webhookEndpoints.del(endpoint.id);
    console.error(`\nRemoved duplicate endpoint ${endpoint.id}`);
  }
}

const endpoint = await stripe.webhookEndpoints.create({
  url,
  enabled_events: EVENTS,
  description: "Buddhista Könyvműhely — order fulfilment",
  api_version: account.default_currency ? undefined : undefined,
});

console.error(`\nEndpoint created: ${endpoint.id}`);
console.error(`  url:    ${endpoint.url}`);
console.error(`  events: ${EVENTS.join(", ")}`);

/**
 * The signing secret goes to stdout as JSON so it can be piped straight into
 * scripts/vercel-env.mts. Everything else is on stderr, which keeps the one
 * value Stripe will never show again out of the terminal scrollback:
 *
 *   npx tsx scripts/stripe-webhook.mts | VERCEL_TOKEN=... npx tsx scripts/vercel-env.mts
 */
process.stdout.write(
  JSON.stringify({
    STRIPE_SECRET_KEY: key,
    STRIPE_WEBHOOK_SECRET: endpoint.secret,
  }),
);
