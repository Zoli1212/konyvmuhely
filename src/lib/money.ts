import { localeTags, type Locale } from "@/i18n/config";

/**
 * Stripe always wants amounts in the currency's smallest unit, but what that
 * unit is depends on the currency, and a handful of currencies carry an extra
 * rule. Everything about that lives here; the rest of the app only ever passes
 * around `priceMinor` plus a currency code.
 */

/** Currencies Stripe treats as having no fractional unit at all. */
const ZERO_DECIMAL = new Set([
  "bif",
  "clp",
  "djf",
  "gnf",
  "jpy",
  "kmf",
  "krw",
  "mga",
  "pyg",
  "rwf",
  "ugx",
  "vnd",
  "vuv",
  "xaf",
  "xof",
  "xpf",
]);

/**
 * Currencies that do have a fractional unit on paper, but where Stripe only
 * accepts amounts that are an exact multiple of 100 minor units. HUF is the
 * relevant one here: 4990 Ft must be sent as 499000, and a price of 4990.50 Ft
 * is not an amount Stripe will take.
 */
const WHOLE_MAJOR_UNIT_ONLY = new Set(["huf", "isk", "twd", "ugx"]);

export function currencyDecimals(currency: string): number {
  return ZERO_DECIMAL.has(currency.toLowerCase()) ? 0 : 2;
}

/** How many minor units make up one major unit (100 for EUR, 1 for JPY). */
export function minorUnitsPerMajor(currency: string): number {
  return currencyDecimals(currency) === 0 ? 1 : 100;
}

/** True when Stripe rejects fractional major units for this currency. */
export function requiresWholeMajorUnit(currency: string): boolean {
  return WHOLE_MAJOR_UNIT_ONLY.has(currency.toLowerCase());
}

/**
 * Number of decimals a price input should accept for this currency.
 * HUF gets 0 even though its minor unit is fillér, because Stripe will not
 * take a fractional forint.
 */
export function inputDecimals(currency: string): number {
  if (requiresWholeMajorUnit(currency)) return 0;
  return currencyDecimals(currency);
}

/** "4990" (forint typed by the admin) -> 499000 (what Stripe stores). */
export function majorToMinor(major: number, currency: string): number {
  return Math.round(major * minorUnitsPerMajor(currency));
}

/** 499000 -> 4990. */
export function minorToMajor(minor: number, currency: string): number {
  return minor / minorUnitsPerMajor(currency);
}

/**
 * Validates an amount against Stripe's rules for the currency.
 * Returns null when the amount is fine, or a machine-readable reason.
 */
export function validateMinorAmount(
  minor: number,
  currency: string,
): "not-an-integer" | "not-positive" | "needs-whole-major-unit" | null {
  if (!Number.isInteger(minor)) return "not-an-integer";
  if (minor <= 0) return "not-positive";
  if (requiresWholeMajorUnit(currency) && minor % 100 !== 0) {
    return "needs-whole-major-unit";
  }
  return null;
}

/** Formats a stored minor-unit amount for display, e.g. "4 990 Ft" or "€19.90". */
export function formatMoney(
  minor: number,
  currency: string,
  locale: Locale,
): string {
  const decimals = inputDecimals(currency);

  return new Intl.NumberFormat(localeTags[locale], {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(minorToMajor(minor, currency));
}

/**
 * A plain-number string for form inputs: no currency symbol, no grouping,
 * so it round-trips through `<input type="number">` unharmed.
 */
export function minorToInputValue(minor: number, currency: string): string {
  const major = minorToMajor(minor, currency);
  const decimals = inputDecimals(currency);
  return decimals === 0 ? String(Math.round(major)) : major.toFixed(decimals);
}

/** An example price to show in the admin hint, in the store's currency. */
export function examplePrice(currency: string): string {
  return requiresWholeMajorUnit(currency) || currencyDecimals(currency) === 0
    ? "4990"
    : "19.90";
}
