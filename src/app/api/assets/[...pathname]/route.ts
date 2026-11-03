import { readStoredFile, storageDriver } from "@/lib/storage";

/**
 * Serves cover images.
 *
 * Covers are stored as private blobs like everything else, so they cannot be
 * fetched from the Blob CDN directly; this route is how they reach a browser.
 * Pathnames carry a random suffix, so the response is marked immutable and
 * the edge serves it after the first request.
 *
 * Only the covers/ prefix is served. Book files live under books/ in the same
 * store and must never be reachable without an entitlement check, so the
 * prefix test below is a security boundary, not a tidiness rule.
 */
export const runtime = "nodejs";

const CONTENT_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  avif: "image/avif",
  gif: "image/gif",
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ pathname: string[] }> },
): Promise<Response> {
  const { pathname } = await params;
  const joined = pathname.join("/");

  if (!joined.startsWith("covers/")) {
    return new Response("Not found.", { status: 404 });
  }

  const stored = await readStoredFile({
    storage: storageDriver() === "blob" ? "BLOB" : "LOCAL",
    pathname: joined,
    visibility: "private",
  });

  if (!stored) {
    return new Response("Not found.", { status: 404 });
  }

  const extension = joined.split(".").pop()?.toLowerCase() ?? "";

  const headers = new Headers({
    "Content-Type": CONTENT_TYPES[extension] ?? "application/octet-stream",
    // Pathnames carry a random suffix, so a given URL never changes content.
    "Cache-Control": "public, max-age=31536000, immutable",
    "X-Content-Type-Options": "nosniff",
  });

  if (stored.size) headers.set("Content-Length", String(stored.size));

  return new Response(stored.stream, { status: 200, headers });
}
