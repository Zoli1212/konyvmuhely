import { NextResponse, after } from "next/server";

import { defaultLocale, isLocale, type Locale } from "@/i18n/config";
import { currentUser } from "@/lib/auth-guard";
import {
  CART_COOKIE,
  cartCookieOptions,
  readCart,
  serializeCart,
} from "@/lib/cart";
import { fulfillCheckoutSession } from "@/lib/checkout";
import { completePurchase } from "@/lib/post-purchase";
import { routes } from "@/lib/routes";
import { getStripe } from "@/lib/stripe";

/**
 * Where Stripe returns the buyer after a successful payment.
 *
 * This runs before the success page so it can do the two things a server
 * component cannot: write the cart cookie, and reconcile the payment without
 * waiting for the webhook. The webhook is still the authoritative path -
 * fulfilment is idempotent, so whichever arrives first wins and the other is
 * a no-op. That is what makes a local run without `stripe listen` work.
 *
 * The cart cookie is set on this response explicitly rather than through
 * next/headers, so there is no question of whether a redirect carries it.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function redirectTo(path: string, origin: string): NextResponse {
  return NextResponse.redirect(new URL(path, origin), 303);
}

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);

  const localeParam = url.searchParams.get("locale");
  const locale: Locale = isLocale(localeParam ?? undefined)
    ? (localeParam as Locale)
    : defaultLocale;

  const sessionId = url.searchParams.get("session_id");
  if (!sessionId) {
    return redirectTo(routes.library(locale), url.origin);
  }

  const stripe = getStripe();
  const user = await currentUser();

  if (!stripe) {
    return redirectTo(routes.library(locale), url.origin);
  }

  if (!user) {
    // Session cookie lost between Stripe and here: sign in, then the library.
    return redirectTo(
      `${routes.login(locale)}?next=${encodeURIComponent(routes.library(locale))}`,
      url.origin,
    );
  }

  let fulfilledBookIds: string[] = [];

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Someone else's session id in the URL must not reveal their purchase.
    if (session.metadata?.userId !== user.id) {
      return redirectTo(routes.library(locale), url.origin);
    }

    const result = await fulfillCheckoutSession(session);

    if (result.fulfilled) {
      fulfilledBookIds = result.bookIds;

      // Normally the webhook has already done this; both are idempotent, and
      // doing it here too means a deployment whose webhook is misconfigured
      // still invoices and emails the buyer.
      if (result.orderId) {
        const orderId = result.orderId;
        after(() => completePurchase(orderId));
      }
    }
  } catch {
    // An unreadable session is not worth an error page: the library is the
    // honest answer to "what do I own?".
    return redirectTo(routes.library(locale), url.origin);
  }

  const successUrl = new URL(routes.checkoutSuccess(locale), url.origin);
  successUrl.searchParams.set("session_id", sessionId);

  const response = NextResponse.redirect(successUrl, 303);

  if (fulfilledBookIds.length > 0) {
    // Only the books that were actually paid for leave the cart; anything the
    // buyer added in another tab meanwhile stays put.
    const paid = new Set(fulfilledBookIds);
    const remaining = (await readCart()).filter((id) => !paid.has(id));

    if (remaining.length === 0) {
      response.cookies.delete(CART_COOKIE);
    } else {
      response.cookies.set(
        CART_COOKIE,
        serializeCart(remaining),
        cartCookieOptions,
      );
    }
  }

  return response;
}
