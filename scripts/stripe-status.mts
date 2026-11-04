/**
 * What Stripe still wants before the account can take real money.
 *
 * `charges_enabled` alone does not say why an account is held up, and the
 * dashboard buries the reason. requirements.currently_due is the actual
 * answer, so print it.
 *
 *   STRIPE_SECRET_KEY=sk_... npx tsx scripts/stripe-status.mts
 */
import Stripe from "stripe";

const key = process.env.STRIPE_SECRET_KEY;
if (!key) {
  console.error("Set STRIPE_SECRET_KEY.");
  process.exit(1);
}

const stripe = new Stripe(key, { appInfo: { name: "ebook-shop status" } });
const live = key.startsWith("sk_live_");

const account = await stripe.accounts.retrieve();

console.log(`Mode:             ${live ? "LIVE" : "test / sandbox"}`);
console.log(`Account:          ${account.id}`);
console.log(`Country:          ${account.country}`);
console.log(`Default currency: ${account.default_currency?.toUpperCase()}`);
console.log(`Charges enabled:  ${account.charges_enabled}`);
console.log(`Payouts enabled:  ${account.payouts_enabled}`);
console.log(`Details submitted:${account.details_submitted}`);

const required = account.requirements;
const list = (label: string, items: string[] | null | undefined) => {
  if (!items || items.length === 0) return;
  console.log(`\n${label}:`);
  for (const item of items) console.log(`  - ${item}`);
};

list("Currently due", required?.currently_due);
list("Past due", required?.past_due);
list("Eventually due", required?.eventually_due);
list("Pending verification", required?.pending_verification);

if (required?.disabled_reason) {
  console.log(`\nDisabled reason:  ${required.disabled_reason}`);
}

if (account.charges_enabled && account.payouts_enabled) {
  console.log("\nReady to take real payments.");
} else {
  console.log("\nNot ready yet. Clear the items above in the Stripe dashboard.");
}

// The endpoints belong to this key's mode; a live key sees none of the test ones.
const endpoints = await stripe.webhookEndpoints.list({ limit: 100 });
console.log(`\nWebhook endpoints for this key: ${endpoints.data.length}`);
for (const endpoint of endpoints.data) {
  console.log(`  ${endpoint.status.padEnd(8)} ${endpoint.url}`);
}
