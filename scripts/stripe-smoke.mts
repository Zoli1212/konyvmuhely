/**
 * Proves Stripe will actually take the money, without involving the shop.
 *
 * Sends the exact parameters src/lib/checkout.ts sends, at a real catalogue
 * price, and then throws the session away. Worth running whenever the key
 * changes — above all when switching to the live key, where the first real
 * failure would be a customer's.
 *
 *   STRIPE_SECRET_KEY=sk_test_... npx tsx scripts/stripe-smoke.mts
 */
import Stripe from "stripe";

const key = process.env.STRIPE_SECRET_KEY;
if (!key) {
  console.error("Set STRIPE_SECRET_KEY.");
  process.exit(1);
}

const stripe = new Stripe(key, { appInfo: { name: "ebook-shop smoke test" } });
const site = process.env.SITE_URL ?? "https://buddhista-konyvmuhely.vercel.app";

console.log(`Mode: ${key.startsWith("sk_live_") ? "LIVE" : "test"}`);

const session = await stripe.checkout.sessions.create({
  mode: "payment",
  locale: "hu",
  customer_email: "teszt@example.com",
  line_items: [
    {
      quantity: 1,
      price_data: {
        currency: "huf",
        // 990 Ft. HUF is a two-decimal currency at Stripe even though Hungary
        // stopped minting fillér, and the amount must be a whole forint.
        unit_amount: 99_000,
        product_data: { name: "Probafuzet", description: "Smoke test" },
      },
    },
  ],
  success_url: `${site}/hu/checkout/success`,
  cancel_url: `${site}/hu/cart`,
  billing_address_collection: "required",
  tax_id_collection: { enabled: true },
  metadata: { smokeTest: "1" },
});

console.log(`session:        ${session.id}`);
console.log(
  `amount_total:   ${session.amount_total} ${session.currency} = ${session.amount_total! / 100} Ft`,
);
console.log(`payment_status: ${session.payment_status}`);
console.log(`hosted page:    ${session.url ? "yes" : "NO"}`);

// A reachable hosted page is the part that fails when an account cannot yet
// take payments, so check it rather than trusting the URL's existence.
const page = await fetch(session.url!, { redirect: "manual" });
console.log(`page responds:  ${page.status}`);

await stripe.checkout.sessions.expire(session.id);
console.log("cleaned up:     expired");
