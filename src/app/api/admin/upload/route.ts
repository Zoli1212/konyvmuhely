import { assertAdmin } from "@/lib/auth-guard";
import {
  BOOK_FILE_CONTENT_TYPES,
  COVER_CONTENT_TYPES,
  MAX_BOOK_FILE_MB,
  MAX_COVER_MB,
  formatFromFileName,
  storageDriver,
  storeFile,
} from "@/lib/storage";

/**
 * Upload endpoint for the local development file store.
 *
 * Only active when BLOB_READ_WRITE_TOKEN is absent. On Vercel, uploads go
 * browser -> Blob instead (see ../blob-upload/route.ts), because this path
 * would hit both the request body limit and a read-only filesystem.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MB = 1024 * 1024;

export async function POST(request: Request): Promise<Response> {
  try {
    await assertAdmin();
  } catch {
    return new Response("Forbidden.", { status: 403 });
  }

  if (storageDriver() !== "local") {
    return Response.json(
      { error: "Blob storage is configured; use the client upload route." },
      { status: 400 },
    );
  }

  const form = await request.formData();

  const file = form.get("file");
  const pathname = form.get("pathname");

  if (!(file instanceof File) || typeof pathname !== "string") {
    return Response.json({ error: "Missing file or pathname." }, { status: 400 });
  }

  const isCover = pathname.startsWith("covers/");
  const isBook = pathname.startsWith("books/");

  if (!isCover && !isBook) {
    return Response.json({ error: "Invalid pathname." }, { status: 400 });
  }

  const maxBytes = (isCover ? MAX_COVER_MB : MAX_BOOK_FILE_MB) * MB;
  if (file.size > maxBytes) {
    return Response.json(
      { error: `File exceeds ${isCover ? MAX_COVER_MB : MAX_BOOK_FILE_MB} MB.` },
      { status: 413 },
    );
  }

  if (isCover) {
    if (!COVER_CONTENT_TYPES.includes(file.type)) {
      return Response.json({ error: "Unsupported image type." }, { status: 415 });
    }
  } else {
    const format = formatFromFileName(file.name);
    // Browsers are inconsistent about the EPUB media type, so the extension
    // decides and the reported type only has to be plausible.
    if (
      !format ||
      (file.type && !BOOK_FILE_CONTENT_TYPES[format].includes(file.type))
    ) {
      return Response.json({ error: "Unsupported file type." }, { status: 415 });
    }
  }

  const stored = await storeFile(
    pathname,
    Buffer.from(await file.arrayBuffer()),
    {
      visibility: isCover ? "public" : "private",
      contentType: file.type || undefined,
    },
  );

  return Response.json({
    storage: stored.storage,
    url: stored.url,
    pathname: stored.pathname,
    fileName: file.name,
    sizeBytes: file.size,
  });
}
