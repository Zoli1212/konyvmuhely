/**
 * Renders the shop owner's sale notice both ways, so the difference between
 * a clean sale and a failed invoice can be seen rather than assumed.
 *
 *   npx tsx scripts/preview-sale-notice.mts
 */
import { saleNotificationEmail } from "../src/lib/email-templates.ts";

const common = {
  orderId: "cmw116un4000008l0pbm064vf",
  buyerName: "Kovács Anna",
  buyerEmail: "anna@example.com",
  amountMinor: 99_000,
  currency: "huf",
  titles: ["Az Aura Kézikönyve"],
};

const ok = saleNotificationEmail({ ...common, invoiceNumber: "E-CRB-2026-7" });

const bad = saleNotificationEmail({
  ...common,
  invoiceNumber: null,
  invoiceError: "[391] A szállító és a vevő adószáma nem lehet ugyanaz.",
});

for (const [label, mail] of [
  ["CLEAN SALE", ok],
  ["FAILED INVOICE", bad],
] as const) {
  console.log(`\n=== ${label} ===`);
  console.log(`subject: ${mail.subject}`);
  console.log("text:");
  for (const line of mail.text.split("\n")) console.log(`  ${line}`);
  console.log(`html carries the warning block: ${mail.html.includes("#c2410c")}`);
}

console.log(
  `\nSubjects differ: ${ok.subject !== bad.subject ? "yes" : "NO - inbox list would look identical"}`,
);
