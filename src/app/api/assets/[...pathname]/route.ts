import { readStoredFile, storageDriver } from "@/lib/storage";

/**
 * Serves cover images from the local development file store.
 *
 * On Vercel, covers are public Blob URLs and this route is never used. It
 * exists so the app runs end to end without a Blob token.
 *
 * Only the covers/ prefix is served. Book files live under books/ in the same
 * directory and must never be reachable without an entitlement check, so the
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
  if (storageDriver() !== "local") {
    return new Response("Not found.", { status: 404 });
  }

  const { pathname } = await params;
  const joined = pathname.join("/");

  if (!joined.startsWith("covers/")) {
    return new Response("Not found.", { status: 404 });
  }

  const stored = await readStoredFile({
    storage: "LOCAL",
    pathname: joined,
    visibility: "public",
  });

  if (!stored) {
    return new Response("Not found.", { status: 404 });
  }

  const extension = joined.split(".").pop()?.toLowerCase() ?? "";

  const headers = new Headers({
    "Content-Type": CONTENT_TYPES[extension] ?? "application/octet-stream",
    "Cache-Control": "public, max-age=3600",
    "X-Content-Type-Options": "nosniff",
  });

  if (stored.size) headers.set("Content-Length", String(stored.size));

  return new Response(stored.stream, { status: 200, headers });
}
