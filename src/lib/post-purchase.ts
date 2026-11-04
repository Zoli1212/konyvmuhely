import { isLocale, type Locale } from "@/i18n/config";
import { emailConfigured, sendEmail } from "./email";
import {
  invoiceReadyEmail,
  purchaseConfirmationEmail,
  saleNotificationEmail,
} from "./email-templates";
import { getInvoicePdfRef, processInvoice } from "./invoicing";
import { pickText } from "./books";
import { prisma } from "./prisma";
import { readStoredFile } from "./storage";

/**
 * Everything that happens after the money has arrived: issue the invoice,
 * email the buyer their downloads with the invoice attached, and tell the shop
 * owner about the sale.
 *
 * Called from both fulfilment paths and designed to be run after the response
 * has gone out. Each step is independently idempotent, and none of them can
 * undo the purchase: a buyer who paid owns their books whether or not
 * Számlázz.hu or Resend were reachable at that moment. Failures are recorded
 * so the admin can retry.
 */
export async function completePurchase(orderId: string): Promise<void> {
  // The invoice comes first so the confirmation can carry its PDF.
  const invoice = await processInvoice(orderId).catch((error) => {
    console.error("invoice failed", orderId, error);
    return { status: "failed" as const, error: "threw" };
  });

  if (invoice.status === "failed") {
    console.error("invoice not issued", orderId, invoice.error);
  }

  await sendPurchaseEmails(orderId).catch((error) => {
    console.error("purchase emails failed", orderId, error);
  });
}

async function sendPurchaseEmails(orderId: string): Promise<void> {
  if (!emailConfigured()) return;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: {
      id: true,
      status: true,
      amountMinor: true,
      currency: true,
      customerEmail: true,
      confirmationEmailSentAt: true,
      user: { select: { name: true, email: true, locale: true } },
      invoice: { select: { number: true, status: true, lastError: true } },
      items: {
        select: {
          titleSnapshot: true,
          book: {
            select: {
              author: true,
              titleHu: true,
              titleEn: true,
              files: {
                select: { id: true, format: true, fileLocale: true },
                orderBy: [{ fileLocale: "asc" }, { format: "asc" }],
              },
            },
          },
        },
      },
    },
  });

  if (!order || order.status !== "PAID") return;
  // Already told them. A webhook replay must not send a second copy.
  if (order.confirmationEmailSentAt) return;

  const locale: Locale = isLocale(order.user.locale) ? order.user.locale : "hu";
  const to = order.customerEmail ?? order.user.email;

  // --- invoice attachment, if we kept a copy ---
  const pdfRef = await getInvoicePdfRef(orderId);
  let attachment: { filename: string; content: Buffer; contentType: string } | null =
    null;

  if (pdfRef) {
    const stored = await readStoredFile({
      storage: pdfRef.storage,
      pathname: pdfRef.pathname,
      visibility: "private",
    });

    if (stored) {
      const chunks: Uint8Array[] = [];
      for await (const chunk of streamChunks(stored.stream)) chunks.push(chunk);

      attachment = {
        filename: `szamla-${pdfRef.number.replace(/[^\w-]/g, "_")}.pdf`,
        content: Buffer.concat(chunks),
        contentType: "application/pdf",
      };
    }
  }

  const books = order.items.map((item) => ({
    title: pickText(item.book.titleHu, item.book.titleEn, locale),
    author: item.book.author,
    files: item.book.files,
  }));

  const message = purchaseConfirmationEmail({
    locale,
    orderId: order.id,
    amountMinor: order.amountMinor,
    currency: order.currency,
    books,
    invoiceNumber: order.invoice?.number ?? null,
    invoiceAttached: attachment !== null,
  });

  const sent = await sendEmail({
    to,
    subject: message.subject,
    html: message.html,
    text: message.text,
    attachments: attachment ? [attachment] : undefined,
    // Belt and braces alongside confirmationEmailSentAt.
    idempotencyKey: `purchase-${order.id}`,
  });

  if (!sent.ok) {
    console.error("purchase confirmation not sent", order.id, sent.error);
    return;
  }

  await prisma.order.update({
    where: { id: order.id },
    data: { confirmationEmailSentAt: new Date() },
  });

  // Only when the PDF was really on the message. A confirmation sent before
  // the invoice existed must not count as delivery, or the retry would stay
  // silent and the buyer would never get it.
  if (attachment) {
    await prisma.invoice.updateMany({
      where: { orderId: order.id },
      data: { sentToBuyerAt: new Date() },
    });
  }

  // --- notify the shop owner ---
  const ownerAddress = await shopOwnerAddress();
  if (!ownerAddress) return;

  const notice = saleNotificationEmail({
    orderId: order.id,
    buyerName: order.user.name ?? "-",
    buyerEmail: to,
    amountMinor: order.amountMinor,
    currency: order.currency,
    titles: order.items.map((item) => item.titleSnapshot),
    invoiceNumber: order.invoice?.number ?? null,
    invoiceError:
      order.invoice?.status === "FAILED" ? order.invoice.lastError : null,
  });

  await sendEmail({
    to: ownerAddress,
    subject: notice.subject,
    html: notice.html,
    text: notice.text,
    idempotencyKey: `sale-notice-${order.id}`,
  });
}

/**
 * Where sale notices go: an explicit address if configured, otherwise the
 * oldest admin account, so this keeps working without extra configuration.
 */
async function shopOwnerAddress(): Promise<string | null> {
  const configured = process.env.STORE_OWNER_EMAIL;
  if (configured && configured.trim().length > 0) return configured.trim();

  const admin = await prisma.user.findFirst({
    where: { role: "ADMIN" },
    orderBy: { createdAt: "asc" },
    select: { email: true },
  });

  return admin?.email ?? null;
}

async function* streamChunks(stream: ReadableStream<Uint8Array>) {
  const reader = stream.getReader();
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) yield value;
    }
  } finally {
    reader.releaseLock();
  }
}


/**
 * Sends the invoice on its own, but only to a buyer who has not had it.
 *
 * The case this exists for: the invoice failed at purchase time, the
 * confirmation went out without it, and someone pressed retry afterwards.
 * Nothing else would tell the buyer their invoice now exists.
 *
 * Does nothing when the confirmation has not gone out yet - that message
 * will carry the PDF itself - and nothing when the invoice has already
 * reached them, because a second copy is worse than none.
 */
export async function sendInvoiceIfBuyerHasNotGotIt(
  orderId: string,
): Promise<"sent" | "already-had-it" | "not-yet-issued" | "no-confirmation-yet" | "skipped"> {
  if (!emailConfigured()) return "skipped";

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: {
      id: true,
      status: true,
      customerEmail: true,
      confirmationEmailSentAt: true,
      user: { select: { email: true, locale: true } },
      invoice: { select: { status: true, number: true, sentToBuyerAt: true } },
    },
  });

  if (!order || order.status !== "PAID") return "skipped";

  const invoice = order.invoice;
  if (!invoice || invoice.status !== "ISSUED" || !invoice.number) {
    return "not-yet-issued";
  }
  if (invoice.sentToBuyerAt) return "already-had-it";
  // The confirmation is still to come and will carry the PDF.
  if (!order.confirmationEmailSentAt) return "no-confirmation-yet";

  const pdfRef = await getInvoicePdfRef(orderId);
  if (!pdfRef) return "not-yet-issued";

  const stored = await readStoredFile({
    storage: pdfRef.storage,
    pathname: pdfRef.pathname,
    visibility: "private",
  });
  if (!stored) return "not-yet-issued";

  const chunks: Uint8Array[] = [];
  for await (const chunk of streamChunks(stored.stream)) chunks.push(chunk);

  const locale: Locale = isLocale(order.user.locale) ? order.user.locale : "hu";
  const message = invoiceReadyEmail({
    locale,
    orderId: order.id,
    invoiceNumber: invoice.number,
  });

  const sent = await sendEmail({
    to: order.customerEmail ?? order.user.email,
    subject: message.subject,
    html: message.html,
    text: message.text,
    attachments: [
      {
        filename: `szamla-${invoice.number.replace(/[^\w-]/g, "_")}.pdf`,
        content: Buffer.concat(chunks),
        contentType: "application/pdf",
      },
    ],
    idempotencyKey: `invoice-${order.id}`,
  });

  if (!sent.ok) {
    console.error("invoice email not sent", order.id, sent.error);
    return "skipped";
  }

  await prisma.invoice.updateMany({
    where: { orderId: order.id },
    data: { sentToBuyerAt: new Date() },
  });

  return "sent";
}
