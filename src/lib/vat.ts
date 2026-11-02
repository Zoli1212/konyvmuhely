/**
 * VAT handling.
 *
 * The store runs in one of two modes, set by STORE_VAT_MODE:
 *
 *  - `exempt` (default) - the seller is *alanyi adómentes*: not registered for
 *    VAT, so no VAT appears on the invoice at all. The invoice must carry the
 *    legal reference to the exemption, which Számlázz.hu adds when the VAT
 *    code is `AAM`. Sending `0%` instead is a common mistake and is **not
 *    lawful** for an exempt seller - it looks like a zero-rated taxable
 *    supply, which is a different thing.
 *
 *  - `standard` - the seller charges VAT at STORE_VAT_RATE. Note that an
 *    e-book is **27%** in Hungary, not the 5% that printed books enjoy: the
 *    EU directive treats a printed book as goods and an e-book as an
 *    electronically supplied service.
 *
 * The exemption has an annual turnover ceiling (20 million HUF in 2026,
 * rising to 22 million from 2027). Crossing it mid-year makes the seller
 * VAT-registered from that point, and this setting has to change with it.
 * Catalogue prices are gross either way - what the buyer actually pays.
 */

export type VatMode = "exempt" | "standard";

export const DEFAULT_VAT_RATE = 27;

export function storeVatMode(): VatMode {
  return process.env.STORE_VAT_MODE === "standard" ? "standard" : "exempt";
}

/** The percentage charged. Zero in exempt mode, where there is no VAT. */
export function storeVatRate(): number {
  if (storeVatMode() === "exempt") return 0;

  const raw = Number(process.env.STORE_VAT_RATE);
  return Number.isFinite(raw) && raw >= 0 && raw <= 100 ? raw : DEFAULT_VAT_RATE;
}

/**
 * What goes in Számlázz.hu's `afakulcs` field: the literal code `AAM` for an
 * exempt seller, otherwise the percentage as a plain number.
 */
export function vatCode(): string {
  return storeVatMode() === "exempt" ? "AAM" : String(storeVatRate());
}

export type VatSplit = {
  netMinor: number;
  vatMinor: number;
  grossMinor: number;
  rate: number;
};

/**
 * Splits a gross amount into net and VAT. In exempt mode there is nothing to
 * split: net equals gross and the VAT part is zero. Otherwise the VAT part is
 * the remainder rather than a second rounding, so net + vat always equals
 * gross exactly.
 */
export function splitGross(grossMinor: number, rate = storeVatRate()): VatSplit {
  if (rate === 0) {
    return { netMinor: grossMinor, vatMinor: 0, grossMinor, rate: 0 };
  }

  const netMinor = Math.round(grossMinor / (1 + rate / 100));
  return {
    netMinor,
    vatMinor: grossMinor - netMinor,
    grossMinor,
    rate,
  };
}

/** Sums per-line splits so the invoice totals match its lines. */
export function sumSplits(splits: VatSplit[], rate = storeVatRate()): VatSplit {
  return splits.reduce<VatSplit>(
    (total, line) => ({
      netMinor: total.netMinor + line.netMinor,
      vatMinor: total.vatMinor + line.vatMinor,
      grossMinor: total.grossMinor + line.grossMinor,
      rate,
    }),
    { netMinor: 0, vatMinor: 0, grossMinor: 0, rate },
  );
}
