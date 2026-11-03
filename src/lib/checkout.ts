import type Stripe from "stripe";

import type { Locale } from "@/i18n/config";
import { prisma } from "./prisma";
import { routes } from "./routes";
import { siteUrl } from "./env";
import { ensureInvoiceRecord } from "./invoicing";
import { getStripe, stripeLocale } from "./stripe";
import {
  BILLING_COUNTRY,
  toStripeAddress,
  type BillingDetails,
} from "./billing";

/**
 * Both halves of the payment flow live here.
 *
 * `startCheckout` is the only place a price is turned into money, and it reads
 * every price from the database - never from the cart cookie or the request
 * body. `fulfillCheckoutSession` is the only place an entitlement is granted.
 *
 * Fulfilment is idempotent and is called from two places on purpose: the
 * Stripe webhook (the authoritative path) and the success page (so a local
 * run without `stripe listen`, or a webhook that is briefly down, still
 * delivers the book the buyer just paid for).
 */

export type StartCheckoutResult =
  | { ok: true; url: string }
  | { ok: false; reason: "empty" | "stripe-unconfigured" | "mixed-currency" };

export async function startCheckout(params: {
  userId: string;
  userEmail: string;
  bookIds: string[];
  locale: Locale;
  /** Collected by the shop, not by Stripe. See src/lib/billing.ts. */
  billing: BillingDetails;
  /** When the buyer waived the right of withdrawal. */
  withdrawalConsentAt: Date;
}): Promise<StartCheckoutResult> {
  const stripe = getStripe();
  if (!stripe) return { ok: false, reason: "stripe-unconfigured" };

  if (params.bookIds.length === 0) return { ok: false, reason: "empty" };

  // Published books only, and nothing the buyer already owns.
  const owned = await prisma.entitlement.findMany({
    where: { userId: params.userId, bookId: { in: params.bookIds } },
    select: { bookId: true },
  });
  const ownedIds = new Set(owned.map((o) => o.bookId));

  const books = await prisma.book.findMany({
    where: {
      id: { in: params.bookIds.filter((id) => !ownedIds.has(id)) },
      published: true,
    },
    select: {
      id: true,
      slug: true,
      titleHu: true,
      titleEn: true,
      blurbHu: true,
      blurbEn: true,
      priceMinor: true,
      currency: true,
      coverUrl: true,
    },
  });

  if (books.length === 0) return { ok: false, reason: "empty" };

  const currency = books[0].currency;
  if (books.some((b) => b.currency !== currency)) {
    // Stripe Checkout cannot mix currencies in one session.
    return { ok: false, reason: "mixed-currency" };
  }

  const base = siteUrl();
  const isEnglish = params.locale === "en";

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = books.map(
    (book) => ({
      quantity: 1,
      price_data: {
        currency,
        unit_amount: book.priceMinor,
        product_data: {
          name: (isEnglish && book.titleEn) || book.titleHu,
          description:
            ((isEnglish && book.blurbEn) || book.blurbHu).slice(0, 500) ||
            undefined,
          // Stripe only accepts absolute, publicly reachable image URLs.
          images: book.coverUrl?.startsWith("https://")
            ? [book.coverUrl]
            : undefined,
        },
      },
    }),
  );

  const amountMinor = books.reduce((sum, b) => sum + b.priceMinor, 0);
  const customerId = await ensureStripeCustomer(stripe, params);

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: lineItems,
    locale: stripeLocale[params.locale],
    customer: customerId,
    success_url: `${base}${routes.checkoutReturn(params.locale)}`,
    cancel_url: `${base}${routes.checkoutCancelled(params.locale)}`,
    // The webhook can rebuild the whole order from this, which is what makes
    // fulfilment independent of whether the PENDING row below got written.
    metadata: {
      userId: params.userId,
      bookIds: books.map((b) => b.id).join(","),
      locale: params.locale,
    },
    // The address is already on the Customer and must stay there. Stripe
    // Checkout's own address form always offers every country in the world
    // with no way to narrow it, and this shop sells to Hungary only - so the
    // shop collects the address itself and tells Stripe not to touch it.
    customer_update: { address: "never", name: "never" },
    // Digital goods: nothing to ship, and the buyer gets an emailed receipt.
    payment_intent_data: {
      metadata: { userId: params.userId },
    },
  });

  if (!session.url) return { ok: false, reason: "stripe-unconfigured" };

  // Record the pending order so it shows up in the buyer's order list even if
  // they abandon the payment. Fulfilment does not depend on this row existing
  // - except for the withdrawal consent, which is written here because it was
  // given here, and which the law requires the seller to be able to show.
  await prisma.order.create({
    data: {
      userId: params.userId,
      stripeSessionId: session.id,
      amountMinor,
      currency,
      status: "PENDING",
      customerEmail: params.userEmail,
      withdrawalConsentAt: params.withdrawalConsentAt,
      billingName: params.billing.name,
      billingCountry: BILLING_COUNTRY,
      billingZip: params.billing.zip,
      billingCity: params.billing.city,
      billingAddress: params.billing.address,
      billingTaxId: params.billing.taxId,
      items: {
        create: books.map((book) => ({
          bookId: book.id,
          titleSnapshot: book.titleHu,
          priceMinor: book.priceMinor,
        })),
      },
    },
  });

  return { ok: true, url: session.url };
}

/**
 * The buyer's Stripe Customer, carrying the address the shop collected.
 *
 * Reused across purchases so a repeat buyer appears once in the dashboard
 * rather than once per order, and refreshed every time because the address
 * on the Customer is what Stripe shows on the payment page - a stale one
 * would quietly contradict the invoice.
 */
async function ensureStripeCustomer(
  stripe: Stripe,
  params: {
    userId: string;
    userEmail: string;
    billing: BillingDetails;
  },
): Promise<string> {
  const user = await prisma.user.findUnique({
    where: { id: params.userId },
    select: { stripeCustomerId: true },
  });

  const fields = {
    email: params.userEmail,
    name: params.billing.name,
    address: toStripeAddress(params.billing),
    metadata: { userId: params.userId },
  };

  if (user?.stripeCustomerId) {
    try {
      const existing = await stripe.customers.update(user.stripeCustomerId, fields);
      return existing.id;
    } catch {
      // The stored id can be from a different Stripe account - switching
      // from test keys to live keys is exactly when that happens. Fall
      // through and make a new one rather than failing the purchase.
    }
  }

  const created = await stripe.customers.create(fields);

  await prisma.user.update({
    where: { id: params.userId },
    data: { stripeCustomerId: created.id },
  });

  return created.id;
}

export type FulfillResult = {
  fulfilled: boolean;
  orderId: string | null;
  bookIds: string[];
};

/**
 * Marks an order paid and grants entitlements. Safe to call repeatedly with
 * the same session: the order is keyed on the Stripe session id and both
 * child tables are written with `skipDuplicates`.
 */
export async function fulfillCheckoutSession(
  session: Stripe.Checkout.Session,
): Promise<FulfillResult> {
  const empty: FulfillResult = { fulfilled: false, orderId: null, bookIds: [] };

  if (session.payment_status !== "paid") return empty;

  const userId = session.metadata?.userId;
  const bookIds = (session.metadata?.bookIds ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  if (!userId || bookIds.length === 0) return empty;

  // Already settled: nothing to do, and in particular a replayed
  // `checkout.session.completed` must not resurrect a refunded order.
  const existing = await prisma.order.findUnique({
    where: { stripeSessionId: session.id },
    select: { id: true, status: true, items: { select: { bookId: true } } },
  });

  if (existing && existing.status !== "PENDING") {
    return {
      fulfilled: existing.status === "PAID",
      orderId: existing.id,
      bookIds: existing.items.map((i) => i.bookId),
    };
  }

  const books = await prisma.book.findMany({
    where: { id: { in: bookIds } },
    select: { id: true, titleHu: true, priceMinor: true },
  });
  if (books.length === 0) return empty;

  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id ?? null;

  const billing = billingFromSession(session);

  const orderId = await prisma.$transaction(async (tx) => {
    const order = await tx.order.upsert({
      where: { stripeSessionId: session.id },
      update: {
        status: "PAID",
        paidAt: new Date(),
        stripePaymentIntentId: paymentIntentId,
        customerEmail: session.customer_details?.email ?? undefined,
        amountMinor: session.amount_total ?? undefined,
        ...billing,
      },
      create: {
        userId,
        stripeSessionId: session.id,
        stripePaymentIntentId: paymentIntentId,
        amountMinor:
          session.amount_total ?? books.reduce((s, b) => s + b.priceMinor, 0),
        currency: session.currency ?? "huf",
        status: "PAID",
        paidAt: new Date(),
        customerEmail: session.customer_details?.email ?? null,
        ...billing,
      },
      select: { id: true },
    });

    await tx.orderItem.createMany({
      data: books.map((book) => ({
        orderId: order.id,
        bookId: book.id,
        titleSnapshot: book.titleHu,
        priceMinor: book.priceMinor,
      })),
      skipDuplicates: true,
    });

    await tx.entitlement.createMany({
      data: books.map((book) => ({
        userId,
        bookId: book.id,
        orderId: order.id,
      })),
      skipDuplicates: true,
    });

    return order.id;
  });

  // The invoice row is created here, in PENDING, so that whichever path
  // fulfils the order leaves exactly one thing for the invoicing worker to
  // claim. Issuing it is deliberately not part of this transaction: a slow
  // Számlázz.hu must never hold a database transaction open, and must never
  // be able to roll back a payment that already happened.
  await ensureInvoiceRecord(orderId);

  return { fulfilled: true, orderId, bookIds: books.map((b) => b.id) };
}

/**
 * Billing details as Stripe has them, for the order row.
 *
 * Only fields Stripe actually filled are returned. The shop collects the
 * address itself and writes it on the pending order, so a blank coming back
 * from Stripe means "nothing to add" - spreading the nulls instead would
 * erase a good address and leave the invoice unissuable.
 *
 * `address.line2` is folded into one line because that is what a Hungarian
 * invoice expects.
 */
function billingFromSession(session: Stripe.Checkout.Session) {
  const details = session.customer_details;
  const address = details?.address;

  const line = [address?.line1, address?.line2].filter(Boolean).join(", ");

  const candidates = {
    billingName: details?.name,
    billingCountry: address?.country,
    billingZip: address?.postal_code,
    billingCity: address?.city,
    billingAddress: line.length > 0 ? line : undefined,
    billingTaxId: details?.tax_ids?.find((t) => t.value)?.value,
  };

  return Object.fromEntries(
    Object.entries(candidates).filter(([, value]) => Boolean(value)),
  ) as Partial<Record<keyof typeof candidates, string>>;
}

/**
 * Handles a refund: the order is marked REFUNDED and the entitlements it
 * granted are withdrawn, so the buyer loses access to the files. Entitlements
 * granted by a different order (or by hand) are left alone, which is why this
 * deletes by orderId rather than by user and book.
 */
export async function revokeRefundedOrder(
  paymentIntentId: string,
): Promise<boolean> {
  const order = await prisma.order.findFirst({
    where: { stripePaymentIntentId: paymentIntentId, status: "PAID" },
    select: { id: true },
  });

  if (!order) return false;

  await prisma.$transaction([
    prisma.entitlement.deleteMany({ where: { orderId: order.id } }),
    prisma.order.update({
      where: { id: order.id },
      data: { status: "REFUNDED" },
    }),
  ]);

  return true;
}

/**
 * Marks an order failed. Used for expired Stripe sessions. Scoped to PENDING
 * rows via updateMany so an expiry event arriving after a successful payment
 * can never undo a completed order.
 */
export async function markCheckoutFailed(sessionId: string): Promise<void> {
  await prisma.order.updateMany({
    where: { stripeSessionId: sessionId, status: "PENDING" },
    data: { status: "FAILED" },
  });
}
