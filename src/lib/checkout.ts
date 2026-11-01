import type Stripe from "stripe";

import type { Locale } from "@/i18n/config";
import { prisma } from "./prisma";
import { routes } from "./routes";
import { siteUrl } from "./env";
import { getStripe, stripeLocale } from "./stripe";

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

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: lineItems,
    locale: stripeLocale[params.locale],
    customer_email: params.userEmail,
    success_url: `${base}${routes.checkoutReturn(params.locale)}`,
    cancel_url: `${base}${routes.checkoutCancelled(params.locale)}`,
    // The webhook can rebuild the whole order from this, which is what makes
    // fulfilment independent of whether the PENDING row below got written.
    metadata: {
      userId: params.userId,
      bookIds: books.map((b) => b.id).join(","),
      locale: params.locale,
    },
    // Digital goods: nothing to ship, and the buyer gets an emailed receipt.
    payment_intent_data: {
      metadata: { userId: params.userId },
    },
  });

  if (!session.url) return { ok: false, reason: "stripe-unconfigured" };

  // Record the pending order so it shows up in the buyer's order list even if
  // they abandon the payment. Fulfilment does not depend on this row existing.
  await prisma.order.create({
    data: {
      userId: params.userId,
      stripeSessionId: session.id,
      amountMinor,
      currency,
      status: "PENDING",
      customerEmail: params.userEmail,
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

  const orderId = await prisma.$transaction(async (tx) => {
    const order = await tx.order.upsert({
      where: { stripeSessionId: session.id },
      update: {
        status: "PAID",
        paidAt: new Date(),
        stripePaymentIntentId: paymentIntentId,
        customerEmail: session.customer_details?.email ?? undefined,
        amountMinor: session.amount_total ?? undefined,
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

  return { fulfilled: true, orderId, bookIds: books.map((b) => b.id) };
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
