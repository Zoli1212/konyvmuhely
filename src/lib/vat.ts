/**
 * VAT handling for a Hungarian store selling e-books.
 *
 * Worth knowing before you change the rate: an e-book is **27%** in Hungary,
 * not the 5% that printed books enjoy. The EU directive treats a printed book
 * as goods and an e-book as an electronically supplied service, and Hungary
 * has not applied the reduced rate to electronic publications. Confirm with
 * your accountant before pricing.
 *
 * Catalogue prices are gross - what the buyer actually pays - so the net and
 * VAT parts are derived here, per line, and the invoice totals are the sum of
 * the lines. Deriving the total first and splitting afterwards would produce
 * a total that disagrees with its own lines by a filler or two.
 */

export const DEFAULT_VAT_RATE = 27;

/** Reads the rate from the environment so a different rate is a config change. */
export function storeVatRate(): number {
  const raw = Number(process.env.STORE_VAT_RATE);
  return Number.isFinite(raw) && raw >= 0 && raw <= 100 ? raw : DEFAULT_VAT_RATE;
}

export type VatSplit = {
  netMinor: number;
  vatMinor: number;
  grossMinor: number;
  rate: number;
};

/**
 * Splits a gross amount into net and VAT. The VAT part is the remainder
 * rather than a second rounding, so net + vat always equals gross exactly.
 */
export function splitGross(grossMinor: number, rate = storeVatRate()): VatSplit {
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
