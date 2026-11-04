import { prisma } from "./prisma";
import { minorUnitsPerMajor } from "./money";
import { storeFile } from "./storage";
import { issueInvoice, szamlazzConfigured } from "./szamlazz";

/**
 * Orchestrates invoicing around the Számlázz.hu client.
 *
 * The hard requirement is **exactly one invoice per order**. Two code paths
 * reach fulfilment (the Stripe webhook and the return URL), webhooks get
 * replayed, and an admin can press retry - so a duplicate is a realistic
 * accident, and a duplicate invoice is a genuine accounting problem.
 *
 * Three defences, in order:
 *  1. Invoice.orderId is unique, so there is only ever one row to work from.
 *  2. Claiming that row flips it to PROCESSING with a conditional update; the
 *     database decides who wins, and only the winner calls Számlázz.hu.
 *  3. The order id is sent as `szamlaKulsoAzon`, so Számlázz.hu itself rejects
 *     a second invoice for the same external id even if 1 and 2 were bypassed.
 */

/** Creates the PENDING row. Safe to call repeatedly. */
export async function ensureInvoiceRecord(orderId: string): Promise<void> {
  await prisma.invoice.createMany({
    data: [{ orderId }],
    skipDuplicates: true,
  });
}

export type InvoiceOutcome =
  | { status: "issued"; invoiceNumber: string }
  | { status: "skipped"; reason: string }
  | { status: "failed"; error: string };

/**
 * Issues the invoice for one paid order.
 *
 * Returns rather than throws: this runs from a webhook where a thrown error
 * would make Stripe retry the whole delivery, and the invoice has its own
 * retry path.
 */
export async function processInvoice(orderId: string): Promise<InvoiceOutcome> {
  if (!szamlazzConfigured()) {
    return { status: "skipped", reason: "szamlazz-not-configured" };
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: {
      id: true,
      status: true,
      currency: true,
      customerEmail: true,
      billingName: true,
      billingCountry: true,
      billingZip: true,
      billingCity: true,
      billingAddress: true,
      billingTaxId: true,
      user: { select: { name: true, email: true, locale: true } },
      items: {
        select: {
          titleSnapshot: true,
          priceMinor: true,
          book: { select: { titleHu: true, titleEn: true } },
        },
      },
    },
  });

  if (!order) return { status: "skipped", reason: "no-such-order" };
  if (order.status !== "PAID") return { status: "skipped", reason: "not-paid" };
  if (order.items.length === 0) return { status: "skipped", reason: "no-items" };

  // An invoice without a real name and address is not an invoice. Stripe
  // Checkout is configured to require a billing address, so this should not
  // happen - but if it does, fail loudly in the admin rather than send NAV
  // something invented.
  if (!order.billingName || !order.billingZip || !order.billingCity || !order.billingAddress) {
    await markFailed(orderId, "Missing billing address on the order.");
    return { status: "failed", error: "missing-billing-address" };
  }

  // --- claim ---
  const claim = await prisma.invoice.updateMany({
    where: { orderId, status: { in: ["PENDING", "FAILED"] } },
    data: { status: "PROCESSING", attempts: { increment: 1 }, lastError: null },
  });

  if (claim.count !== 1) {
    const existing = await prisma.invoice.findUnique({
      where: { orderId },
      select: { status: true, number: true },
    });

    if (existing?.status === "ISSUED" && existing.number) {
      return { status: "skipped", reason: "already-issued" };
    }
    return { status: "skipped", reason: "claimed-elsewhere" };
  }

  // --- issue ---
  const language = order.user.locale === "en" ? "en" : "hu";

  const result = await issueInvoice(
    {
      externalId: order.id,
      orderNumber: order.id,
      // The order id also goes in the comment, which no plan gates, so it
      // stays on the invoice even where rendelesSzam cannot be sent.
      comment: `Megrendelés: ${order.id}`,
      language,
      currency: order.currency,
      buyer: {
        name: order.billingName,
        zip: order.billingZip,
        city: order.billingCity,
        address: order.billingAddress,
        country: order.billingCountry,
        email: order.customerEmail ?? order.user.email,
        taxNumber: order.billingTaxId,
      },
      lines: order.items.map((item) => ({
        name:
          language === "en"
            ? item.book.titleEn || item.book.titleHu
            : item.titleSnapshot,
        grossMinor: item.priceMinor,
      })),
      // We attach the PDF to our own confirmation email, so Számlázz.hu should
      // not send a second one.
      sendEmail: false,
    },
    { minorPerMajor: minorUnitsPerMajor(order.currency) },
  );

  if (!result.ok) {
    await markFailed(orderId, `[${result.errorCode ?? "?"}] ${result.error}`);
    return { status: "failed", error: result.error };
  }

  // --- store the PDF ---
  let pdfFields: {
    pdfStorage?: "BLOB" | "LOCAL";
    pdfUrl?: string;
    pdfPathname?: string;
  } = {};

  if (result.pdf) {
    try {
      const stored = await storeFile(
        `invoices/${result.invoiceNumber.replace(/[^\w-]/g, "_")}.pdf`,
        result.pdf,
        { visibility: "private", contentType: "application/pdf" },
      );
      pdfFields = {
        pdfStorage: stored.storage,
        pdfUrl: stored.url,
        pdfPathname: stored.pathname,
      };
    } catch {
      // The invoice exists at Számlázz.hu and is reported to NAV; losing our
      // local copy is not worth failing the order over. It stays downloadable
      // from the Számlázz.hu account.
    }
  }

  await prisma.invoice.update({
    where: { orderId },
    data: {
      status: "ISSUED",
      number: result.invoiceNumber,
      netMinor: result.netMinor,
      vatMinor: result.vatMinor,
      grossMinor: result.grossMinor,
      vatRate: result.vatRate,
      issuedAt: new Date(),
      lastError: null,
      ...pdfFields,
    },
  });

  return { status: "issued", invoiceNumber: result.invoiceNumber };
}

async function markFailed(orderId: string, error: string): Promise<void> {
  await prisma.invoice.updateMany({
    where: { orderId },
    data: { status: "FAILED", lastError: error.slice(0, 2000) },
  });
}

/** The stored PDF for an order, if we kept a copy. */
export async function getInvoicePdfRef(orderId: string) {
  const invoice = await prisma.invoice.findUnique({
    where: { orderId },
    select: {
      number: true,
      status: true,
      pdfStorage: true,
      pdfPathname: true,
    },
  });

  if (
    !invoice ||
    invoice.status !== "ISSUED" ||
    !invoice.pdfStorage ||
    !invoice.pdfPathname
  ) {
    return null;
  }

  return {
    number: invoice.number ?? "szamla",
    storage: invoice.pdfStorage,
    pathname: invoice.pdfPathname,
  };
}
