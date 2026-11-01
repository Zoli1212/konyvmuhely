"use server";

import { revalidatePath } from "next/cache";

import { assertAdmin } from "@/lib/auth-guard";
import { ensureInvoiceRecord, processInvoice } from "@/lib/invoicing";

/**
 * Retries a failed invoice from the admin table.
 *
 * processInvoice re-claims a FAILED row, so pressing this twice cannot produce
 * two invoices; and the order id travels to Számlázz.hu as the external id,
 * which refuses a duplicate on their side as well.
 */
export async function retryInvoice(formData: FormData): Promise<void> {
  await assertAdmin();

  const orderId = formData.get("orderId");
  if (typeof orderId !== "string" || orderId.length === 0) return;

  await ensureInvoiceRecord(orderId);
  await processInvoice(orderId);

  revalidatePath("/", "layout");
}
