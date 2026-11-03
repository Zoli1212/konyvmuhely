"use server";

import { redirect } from "next/navigation";

import { defaultLocale, isLocale, type Locale } from "@/i18n/config";
import { currentUser } from "@/lib/auth-guard";
import { readBilling } from "@/lib/billing";
import { readCart } from "@/lib/cart";
import { startCheckout } from "@/lib/checkout";
import { prisma } from "@/lib/prisma";
import { routes } from "@/lib/routes";
import type { CheckoutFormState } from "./form-state";

/**
 * The last step before Stripe: billing details and the withdrawal waiver.
 *
 * Both have to happen here rather than on Stripe's page. Stripe's address
 * form cannot be limited to one country, and Stripe has no field for the
 * acknowledgement that 45/2014. (II. 26.) Korm. rendelet requires before a
 * digital download may begin.
 */
export async function submitCheckout(
  _previous: CheckoutFormState,
  formData: FormData,
): Promise<CheckoutFormState> {
  const raw = formData.get("locale");
  const locale: Locale = isLocale(typeof raw === "string" ? raw : undefined)
    ? (raw as Locale)
    : defaultLocale;

  const user = await currentUser();
  if (!user) {
    redirect(
      `${routes.login(locale)}?next=${encodeURIComponent(routes.checkout(locale))}`,
    );
  }

  const { values, errors: billingErrors } = readBilling(formData);
  const errors: CheckoutFormState["errors"] = { ...billingErrors };

  // Not a checkbox we can treat as optional: without it there is no lawful
  // basis to start the download, so it gates the purchase like any other
  // required field.
  const consented = formData.get("withdrawalConsent") === "on";
  if (!consented) errors.consent = "consent";

  if (Object.keys(errors).length > 0) {
    return { errors, values, failed: false };
  }

  const cart = await readCart();

  // Remembered for next time. Saved before payment on purpose: a buyer who
  // abandons at Stripe and comes back should not retype their address.
  await prisma.user.update({
    where: { id: user.id },
    data: {
      billingName: values.name,
      billingZip: values.zip,
      billingCity: values.city,
      billingAddress: values.address,
      billingTaxId: values.taxId,
    },
  });

  const result = await startCheckout({
    userId: user.id,
    userEmail: user.email,
    bookIds: cart,
    locale,
    billing: values,
    withdrawalConsentAt: new Date(),
  });

  if (!result.ok) {
    if (result.reason === "empty") redirect(`${routes.cart(locale)}?problem=empty`);
    return { errors: {}, values, failed: true };
  }

  // The cart is intentionally left alone until the webhook confirms payment,
  // so an abandoned checkout does not lose the visitor's selection.
  redirect(result.url);
}
