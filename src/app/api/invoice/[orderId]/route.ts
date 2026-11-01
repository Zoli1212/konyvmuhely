import { currentUser } from "@/lib/auth-guard";
import { getInvoicePdfRef } from "@/lib/invoicing";
import { prisma } from "@/lib/prisma";
import { readStoredFile } from "@/lib/storage";

/**
 * Serves the stored invoice PDF. Only to the buyer it belongs to, or to an
 * admin. Invoices are stored privately for the same reason book files are:
 * they carry a name and a home address.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ orderId: string }> },
): Promise<Response> {
  const { orderId } = await params;

  const user = await currentUser();
  if (!user) return new Response("Sign in first.", { status: 401 });

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: { userId: true },
  });

  if (!order) return new Response("No such order.", { status: 404 });

  if (order.userId !== user.id && user.role !== "ADMIN") {
    return new Response("Not your order.", { status: 403 });
  }

  const ref = await getInvoicePdfRef(orderId);
  if (!ref) return new Response("No invoice for this order yet.", { status: 404 });

  const stored = await readStoredFile({
    storage: ref.storage,
    pathname: ref.pathname,
    visibility: "private",
  });

  if (!stored) return new Response("The invoice file is missing.", { status: 404 });

  const fileName = `szamla-${ref.number.replace(/[^\w-]/g, "_")}.pdf`;

  const headers = new Headers({
    "Content-Type": "application/pdf",
    "Content-Disposition": `attachment; filename="${fileName}"`,
    "Cache-Control": "private, no-store, max-age=0",
    "X-Content-Type-Options": "nosniff",
  });

  if (stored.size) headers.set("Content-Length", String(stored.size));

  return new Response(stored.stream, { status: 200, headers });
}
