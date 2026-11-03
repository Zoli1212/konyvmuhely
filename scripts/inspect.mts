/**
 * Prints what the shop currently knows: accounts, orders, invoices, mail.
 *
 * Written for the walk-through of a test purchase, where the question is
 * never "did Stripe charge" — Stripe says so plainly — but whether the five
 * things that must follow a payment actually happened: the order went PAID,
 * the entitlement exists, the invoice was issued, the confirmation went out,
 * and the buyer can download.
 *
 *   DATABASE_URL=... npx tsx scripts/inspect.mts
 */
import { prisma } from "../src/lib/prisma.ts";

function when(value: Date | null): string {
  if (!value) return "never";
  const seconds = Math.round((Date.now() - value.getTime()) / 1000);
  if (seconds < 90) return `${seconds}s ago`;
  if (seconds < 5400) return `${Math.round(seconds / 60)}m ago`;
  return `${Math.round(seconds / 3600)}h ago`;
}

const users = await prisma.user.findMany({
  orderBy: { createdAt: "asc" },
  select: {
    email: true,
    role: true,
    emailVerified: true,
    _count: { select: { entitlements: true, orders: true } },
  },
});

console.log(`USERS (${users.length})`);
for (const u of users) {
  console.log(
    `  ${u.role.padEnd(5)} ${u.email.padEnd(34)} ` +
      `verified=${u.emailVerified ? "yes" : "no "}  ` +
      `books=${String(u._count.entitlements).padStart(2)}  orders=${u._count.orders}`,
  );
}

const orders = await prisma.order.findMany({
  orderBy: { createdAt: "desc" },
  take: 10,
  select: {
    id: true,
    status: true,
    amountMinor: true,
    currency: true,
    createdAt: true,
    paidAt: true,
    customerEmail: true,
    billingName: true,
    billingCountry: true,
    billingZip: true,
    billingCity: true,
    confirmationEmailSentAt: true,
    _count: { select: { items: true, entitlements: true } },
    invoice: {
      select: {
        status: true,
        number: true,
        lastError: true,
        issuedAt: true,
        netMinor: true,
        vatMinor: true,
        grossMinor: true,
        vatRate: true,
        pdfPathname: true,
      },
    },
  },
});

console.log(`\nORDERS (latest ${orders.length})`);
if (orders.length === 0) console.log("  none yet");

for (const o of orders) {
  const money = `${(o.amountMinor / 100).toLocaleString("hu-HU")} ${o.currency.toUpperCase()}`;
  console.log(`\n  ${o.status.padEnd(9)} ${money.padStart(12)}   ${when(o.createdAt)}`);
  console.log(`    buyer:        ${o.customerEmail ?? "—"}`);
  console.log(
    `    billing:      ${o.billingName ?? "—"} · ${o.billingCountry ?? "?"} ` +
      `${o.billingZip ?? ""} ${o.billingCity ?? ""}`.trimEnd(),
  );
  console.log(`    items:        ${o._count.items}   entitlements granted: ${o._count.entitlements}`);
  const inv = o.invoice;
  console.log(
    `    invoice:      ${inv ? `${inv.status} ${inv.number ?? ""}`.trim() : "no row"}` +
      (inv?.pdfPathname ? "  pdf stored" : ""),
  );
  if (inv && inv.status === "ISSUED") {
    console.log(
      `    invoice sums: net ${inv.netMinor / 100} + vat ${inv.vatMinor / 100} ` +
        `= ${inv.grossMinor / 100}  (rate ${inv.vatRate}%)`,
    );
  }
  if (inv?.lastError) console.log(`    invoice error: ${inv.lastError.slice(0, 200)}`);
  console.log(`    confirmation: ${when(o.confirmationEmailSentAt)}`);
}

await prisma.$disconnect();
