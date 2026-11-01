"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { defaultLocale, isLocale, type Locale } from "@/i18n/config";
import { currentUser } from "@/lib/auth-guard";
import { readCart, writeCart } from "@/lib/cart";
import { startCheckout } from "@/lib/checkout";
import { routes } from "@/lib/routes";

function localeFrom(formData: FormData): Locale {
  const raw = formData.get("locale");
  return isLocale(typeof raw === "string" ? raw : undefined)
    ? (raw as Locale)
    : defaultLocale;
}

function bookIdFrom(formData: FormData): string | null {
  const raw = formData.get("bookId");
  return typeof raw === "string" && raw.length > 0 ? raw : null;
}

export async function addToCart(formData: FormData): Promise<void> {
  const bookId = bookIdFrom(formData);
  if (!bookId) return;

  const cart = await readCart();
  if (!cart.includes(bookId)) {
    await writeCart([...cart, bookId]);
  }

  // The header's cart badge lives in the layout, so refresh the whole tree.
  revalidatePath("/", "layout");
}

export async function removeFromCart(formData: FormData): Promise<void> {
  const bookId = bookIdFrom(formData);
  if (!bookId) return;

  const cart = await readCart();
  await writeCart(cart.filter((id) => id !== bookId));

  revalidatePath("/", "layout");
}

export async function clearCart(): Promise<void> {
  await writeCart([]);
  revalidatePath("/", "layout");
}

/**
 * Starts a Stripe Checkout session and hands the browser over to Stripe.
 * On any refusal the visitor comes back to the cart with a reason in the
 * query string, which the cart page renders.
 */
export async function checkoutAction(formData: FormData): Promise<void> {
  const locale = localeFrom(formData);

  const user = await currentUser();
  if (!user) {
    redirect(
      `${routes.login(locale)}?next=${encodeURIComponent(routes.cart(locale))}`,
    );
  }

  const cart = await readCart();

  const result = await startCheckout({
    userId: user.id,
    userEmail: user.email,
    bookIds: cart,
    locale,
  });

  if (!result.ok) {
    redirect(`${routes.cart(locale)}?problem=${result.reason}`);
  }

  // The cart is intentionally left alone until the webhook confirms payment,
  // so an abandoned checkout does not lose the visitor's selection.
  redirect(result.url);
}

/**
 * Buy a single title without a detour through the cart. The book still joins
 * the cart first, so an abandoned payment leaves the visitor somewhere sane.
 */
export async function buyNow(formData: FormData): Promise<void> {
  const locale = localeFrom(formData);
  const bookId = bookIdFrom(formData);

  if (!bookId) redirect(routes.books(locale));

  const cart = await readCart();
  if (!cart.includes(bookId)) {
    await writeCart([...cart, bookId]);
  }

  const user = await currentUser();
  if (!user) {
    redirect(
      `${routes.login(locale)}?next=${encodeURIComponent(routes.cart(locale))}`,
    );
  }

  const result = await startCheckout({
    userId: user.id,
    userEmail: user.email,
    bookIds: [bookId],
    locale,
  });

  if (!result.ok) {
    redirect(`${routes.cart(locale)}?problem=${result.reason}`);
  }

  // The cart is intentionally left alone until the webhook confirms payment,
  // so an abandoned checkout does not lose the visitor's selection.
  redirect(result.url);
}
