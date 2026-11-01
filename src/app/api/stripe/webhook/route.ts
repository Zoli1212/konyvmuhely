import { after } from "next/server";
import type Stripe from "stripe";

import {
  fulfillCheckoutSession,
  markCheckoutFailed,
  revokeRefundedOrder,
} from "@/lib/checkout";
import { env } from "@/lib/env";
import { completePurchase } from "@/lib/post-purchase";
import { getStripe } from "@/lib/stripe";

/**
 * Stripe webhook. This is the authoritative fulfilment path: entitlements are
 * granted here, from Stripe's own account of what was paid.
 *
 * Signature verification needs the exact bytes Stripe signed, so the body is
 * read as text and never parsed before verification.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  const stripe = getStripe();
  const webhookSecret = env.stripeWebhookSecret;

  if (!stripe || !webhookSecret) {
    // 500 rather than 200: Stripe should keep retrying until the deployment
    // is actually configured, instead of discarding the event.
    return new Response("Stripe is not configured.", { status: 500 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return new Response("Missing stripe-signature header.", { status: 400 });
  }

  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      rawBody,
      signature,
      webhookSecret,
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown error";
    return new Response(`Signature verification failed: ${message}`, {
      status: 400,
    });
  }

  try {
    switch (event.type) {
      // Card payments land here; delayed methods arrive as the async variant.
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded": {
        const result = await fulfillCheckoutSession(event.data.object);

        // Stripe wants a prompt 2xx and retries on a slow one. Invoicing talks
        // to Számlázz.hu and emailing talks to Resend, neither of which belongs
        // on the critical path of acknowledging a payment - so they run after
        // the response has gone out.
        if (result.fulfilled && result.orderId) {
          const orderId = result.orderId;
          after(() => completePurchase(orderId));
        }
        break;
      }

      case "checkout.session.expired":
      case "checkout.session.async_payment_failed": {
        await markCheckoutFailed(event.data.object.id);
        break;
      }

      case "charge.refunded": {
        const charge = event.data.object;
        const paymentIntentId =
          typeof charge.payment_intent === "string"
            ? charge.payment_intent
            : charge.payment_intent?.id;

        // Partial refunds leave the purchase intact; only a full refund
        // withdraws access.
        if (paymentIntentId && charge.amount_refunded >= charge.amount) {
          await revokeRefundedOrder(paymentIntentId);
        }
        break;
      }

      default:
        // Everything else is acknowledged and ignored.
        break;
    }
  } catch (error) {
    // A 500 makes Stripe retry with backoff, which is what we want for a
    // transient database problem.
    console.error("Stripe webhook handler failed", event.type, error);
    return new Response("Handler error.", { status: 500 });
  }

  return Response.json({ received: true });
}
