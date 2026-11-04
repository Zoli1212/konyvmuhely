/**
 * Removes test-mode purchases before the shop goes live.
 *
 * A Stripe test session id always starts with `cs_test_`, so test orders can
 * be told apart from real ones with certainty rather than by date or by eye.
 * Live orders are never matched and cannot be deleted by this script.
 *
 * Entitlements and invoices go with their order; the books, the users and
 * the uploaded files are left alone.
 *
 *   DATABASE_URL=... npx tsx scripts/clear-test-data.mts [--delete]
 *
 * Without --delete it only reports. Deleting is irreversible: the invoice
 * numbers it removes stay used at Szamlazz.hu either way.
 */
import { prisma } from "../src/lib/prisma.ts";

const DELETE = process.argv.includes("--delete");

const orders = await prisma.order.findMany({
  where: { stripeSessionId: { startsWith: "cs_test_" } },
  orderBy: { createdAt: "desc" },
  select: {
    id: true,
    status: true,
    amountMinor: true,
    currency: true,
    createdAt: true,
    customerEmail: true,
    billingName: true,
    invoice: { select: { status: true, number: true } },
    _count: { select: { items: true, entitlements: true } },
  },
});

const live = await prisma.order.count({
  where: { stripeSessionId: { startsWith: "cs_live_" } },
});

console.log(`Test orders found: ${orders.length}`);
console.log(`Live orders (never touched): ${live}\n`);

for (const o of orders) {
  console.log(
    `  ${o.status.padEnd(9)} ${(o.amountMinor / 100).toLocaleString("hu-HU")} ` +
      `${o.currency.toUpperCase()}  ${o.billingName ?? "—"} <${o.customerEmail ?? "—"}>`,
  );
  console.log(
    `    ${o._count.items} item(s), ${o._count.entitlements} entitlement(s), ` +
      `invoice ${o.invoice ? `${o.invoice.status} ${o.invoice.number ?? ""}`.trim() : "none"}`,
  );
}

if (orders.length === 0) {
  console.log("Nothing to clear.");
} else if (!DELETE) {
  console.log("\nDry run. Re-run with --delete to remove these.");
} else {
  const ids = orders.map((o) => o.id);

  // Order matters: the invoice and the entitlements reference the order.
  const [invoices, entitlements, items] = await prisma.$transaction([
    prisma.invoice.deleteMany({ where: { orderId: { in: ids } } }),
    prisma.entitlement.deleteMany({ where: { orderId: { in: ids } } }),
    prisma.orderItem.deleteMany({ where: { orderId: { in: ids } } }),
  ]);

  const deleted = await prisma.order.deleteMany({ where: { id: { in: ids } } });

  console.log(
    `\nDeleted ${deleted.count} order(s), ${items.count} item(s), ` +
      `${entitlements.count} entitlement(s), ${invoices.count} invoice row(s).`,
  );
  console.log("Books, users and uploaded files untouched.");
}

await prisma.$disconnect();
