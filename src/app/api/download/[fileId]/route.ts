import { currentUser } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import {
  contentDisposition,
  readStoredFile,
  signedDownloadUrl,
} from "@/lib/storage";

/**
 * The only way a book file reaches a buyer.
 *
 * Book files are stored privately, so their locations are useless on their
 * own; this route is the gate. It checks the entitlement, then delivers the
 * file one of two ways:
 *
 *  - R2: a 302 to a short-lived signed URL. The bytes go R2 -> buyer, which
 *        keeps 240 MB of books off the platform's metered egress. This is the
 *        whole reason for preferring R2.
 *  - everything else: streamed through without buffering, so a 150 MB PDF
 *        costs the function almost no heap.
 *
 * The entitlement check and the download log happen before either path, so
 * the redirect is never issued to someone who has not bought the book.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CONTENT_TYPE: Record<"PDF" | "EPUB", string> = {
  PDF: "application/pdf",
  EPUB: "application/epub+zip",
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ fileId: string }> },
): Promise<Response> {
  const { fileId } = await params;

  const user = await currentUser();
  if (!user) {
    return new Response("Sign in to download.", { status: 401 });
  }

  const file = await prisma.bookFile.findUnique({
    where: { id: fileId },
    select: {
      id: true,
      bookId: true,
      format: true,
      fileName: true,
      storage: true,
      pathname: true,
      sizeBytes: true,
    },
  });

  if (!file) {
    return new Response("No such file.", { status: 404 });
  }

  // Admins can download anything, so they can check an upload without buying
  // their own book. Everyone else needs an entitlement.
  if (user.role !== "ADMIN") {
    const entitlement = await prisma.entitlement.findUnique({
      where: { userId_bookId: { userId: user.id, bookId: file.bookId } },
      select: { id: true },
    });

    if (!entitlement) {
      return new Response("You do not own this book.", { status: 403 });
    }
  }

  // Logged before delivery, not after: on the R2 path the response is a
  // redirect and the function is gone long before the download finishes, so
  // there is no later moment at which to record it.
  //
  // Best effort either way - a logging failure must not cost the buyer their
  // download.
  try {
    await prisma.downloadLog.create({
      data: {
        userId: user.id,
        bookFileId: file.id,
        ip:
          request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
        userAgent: request.headers.get("user-agent")?.slice(0, 500) ?? null,
      },
    });
  } catch {
    // Ignored on purpose.
  }

  // The R2 path: hand the browser a signed URL and stay out of the data path.
  try {
    const signed = await signedDownloadUrl({
      storage: file.storage,
      pathname: file.pathname,
      fileName: file.fileName,
      contentType: CONTENT_TYPE[file.format],
    });

    if (signed) {
      return new Response(null, {
        status: 302,
        headers: {
          Location: signed,
          // The redirect itself carries an entitlement decision and a URL
          // that expires. Neither may be cached by anything.
          "Cache-Control": "private, no-store, max-age=0",
        },
      });
    }
  } catch (error) {
    // Signing failed - fall through to streaming rather than failing the
    // download. Worth knowing about, since it means paying for egress.
    console.error("download: presigning failed, streaming instead", {
      fileId: file.id,
      detail: error instanceof Error ? error.message : String(error),
    });
  }

  // A storage failure used to surface as an opaque 500. Buyers still get a
  // neutral message, but the reason is logged, and an admin - who is the only
  // person who can act on it - sees it in the response.
  let stored;
  try {
    stored = await readStoredFile({
      storage: file.storage,
      pathname: file.pathname,
      visibility: "private",
    });
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    console.error("download: storage read failed", {
      fileId: file.id,
      storage: file.storage,
      pathname: file.pathname,
      detail,
    });

    return new Response(
      user.role === "ADMIN"
        ? `Storage read failed: ${detail}`
        : "This file is temporarily unavailable. Please try again shortly.",
      { status: 502 },
    );
  }

  if (!stored) {
    return new Response("The file is missing from storage.", { status: 404 });
  }

  const headers = new Headers({
    "Content-Type": CONTENT_TYPE[file.format],
    "Content-Disposition": contentDisposition(file.fileName),
    // Never let a shared cache hold on to a paid file.
    "Cache-Control": "private, no-store, max-age=0",
    "X-Content-Type-Options": "nosniff",
  });

  const size = stored.size ?? file.sizeBytes;
  if (size > 0) headers.set("Content-Length", String(size));

  return new Response(stored.stream, { status: 200, headers });
}
