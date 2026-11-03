/**
 * Billing details, collected by the shop rather than by Stripe.
 *
 * Stripe Checkout can ask for an address, but it always offers every country
 * in the world and there is no option to narrow it. This shop sells to
 * Hungary only — the invoice goes to NAV through Számlázz.hu, and a seller
 * under the Hungarian small-business VAT exemption cannot lawfully sell
 * across the border on that basis — so the address is collected here, where
 * the country is fixed, and handed to Stripe already filled in.
 */

/** Everything an invoice needs from the buyer. Country is always Hungary. */
export type BillingDetails = {
  name: string;
  zip: string;
  city: string;
  address: string;
  taxId: string | null;
};

export const BILLING_COUNTRY = "HU";

export type BillingField = keyof BillingDetails;
export type BillingErrors = Partial<Record<BillingField, string>>;

/**
 * Hungarian postal codes are four digits and never start with zero. 1011 is
 * valid, 0123 is not, and neither is a five-digit code pasted from abroad.
 */
const ZIP = /^[1-9]\d{3}$/;

/**
 * Hungarian adószám: eight digits, a VAT code of 1-5, then a two-digit
 * county code. Also accepts the EU form (HU plus the first eight digits),
 * because that is what a company's own paperwork often shows.
 *
 * Deliberately a shape check, not a checksum: a buyer who mistypes their own
 * tax number should get the invoice they asked for and a correction later,
 * not a blocked purchase.
 */
const TAX_ID = /^(\d{8}-[1-5]-\d{2}|HU\d{8})$/i;

function squash(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "";
}

/**
 * Reads and checks the form. Returns the cleaned values whatever happens, so
 * a rejected form can be rendered back with what the buyer typed rather than
 * emptied — retyping an address because of one wrong digit is how people
 * abandon a purchase.
 */
export function readBilling(formData: FormData): {
  values: BillingDetails;
  errors: BillingErrors;
} {
  const rawTaxId = squash(formData.get("taxId"));

  const values: BillingDetails = {
    name: squash(formData.get("name")),
    zip: squash(formData.get("zip")),
    city: squash(formData.get("city")),
    address: squash(formData.get("address")),
    taxId: rawTaxId.length > 0 ? rawTaxId.toUpperCase() : null,
  };

  const errors: BillingErrors = {};

  if (values.name.length < 3) errors.name = "name";
  if (!ZIP.test(values.zip)) errors.zip = "zip";
  if (values.city.length < 2) errors.city = "city";
  // Short enough to catch "Budapest" pasted into the street field, long
  // enough to allow a genuinely short rural address.
  if (values.address.length < 4) errors.address = "address";
  if (values.taxId !== null && !TAX_ID.test(values.taxId)) errors.taxId = "taxId";

  return { values, errors };
}

/** The address in the shape Stripe stores on a Customer. */
export function toStripeAddress(billing: BillingDetails) {
  return {
    line1: billing.address,
    city: billing.city,
    postal_code: billing.zip,
    country: BILLING_COUNTRY,
  };
}
