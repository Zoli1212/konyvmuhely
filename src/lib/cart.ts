import { cookies } from "next/headers";

/**
 * The cart is a cookie holding book ids. Digital goods have no quantity - you
 * either own a title or you do not - so a set of ids is the whole model. This
 * keeps carts working for visitors who have not signed in yet, with no
 * database writes before a purchase exists.
 *
 * Prices are never stored here. Checkout re-reads every price from the
 * database, so a tampered cookie can only ever change *which* books are being
 * bought, not what they cost.
 */
export const CART_COOKIE = "cart";

const MAX_ITEMS = 40;
const CART_MAX_AGE = 60 * 60 * 24 * 30;

function parse(raw: string | undefined): string[] {
  if (!raw) return [];

  return [
    ...new Set(
      raw
        .split(",")
        .map((id) => id.trim())
        // cuid: safe to whitelist, and it keeps junk out of the id list.
        .filter((id) => /^[a-z0-9]{20,36}$/i.test(id)),
    ),
  ].slice(0, MAX_ITEMS);
}

/** Book ids currently in the cart. Read-only; safe in server components. */
export async function readCart(): Promise<string[]> {
  const store = await cookies();
  return parse(store.get(CART_COOKIE)?.value);
}

/** Shared so a route handler can set the same cookie on its own response. */
export const cartCookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: CART_MAX_AGE,
} as const;

export function serializeCart(ids: string[]): string {
  return [...new Set(ids)].slice(0, MAX_ITEMS).join(",");
}

/** Only callable from a server action or route handler. */
export async function writeCart(ids: string[]): Promise<void> {
  const store = await cookies();
  const value = serializeCart(ids);

  if (value.length === 0) {
    store.delete(CART_COOKIE);
    return;
  }

  store.set(CART_COOKIE, value, cartCookieOptions);
}
