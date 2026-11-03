"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { defaultLocale, isLocale, type Locale } from "@/i18n/config";
import { currentUser } from "@/lib/auth-guard";
import { readCart, writeCart } from "@/lib/cart";
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
 * Buy a single title without a detour through the cart. The book still joins
 * the cart first, so an abandoned purchase leaves the visitor somewhere sane,
 * and the billing step reads the cart like any other purchase.
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
  const next = routes.checkout(locale);

  redirect(
    user ? next : `${routes.login(locale)}?next=${encodeURIComponent(next)}`,
  );
}
