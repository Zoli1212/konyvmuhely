import { assertAdmin } from "@/lib/auth-guard";
import { presignUpload, storageDriver } from "@/lib/storage";

/**
 * Issues a short-lived URL the browser can PUT one file to.
 *
 * The bytes must not pass through this function: Vercel caps a request
 * body at a few megabytes and the books run to tens. Blob has its own
 * client-upload handshake for this; R2 uses a presigned PUT, and this is
 * the only place that signs one.
 *
 * The key is derived here from the slug and the file name, never taken
 * from the caller, so an admin cannot be tricked into signing a write to
 * somewhere else in the bucket.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  try {
    await assertAdmin();
  } catch {
    return new Response("Forbidden.", { status: 403 });
  }

  if (storageDriver() !== "r2") {
    return Response.json(
      { error: "R2 is not the active storage driver." },
      { status: 400 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Expected JSON." }, { status: 400 });
  }

  const { pathname, contentType } = (body ?? {}) as {
    pathname?: unknown;
    contentType?: unknown;
  };

  if (typeof pathname !== "string" || pathname.length === 0) {
    return Response.json({ error: "Missing pathname." }, { status: 400 });
  }

  // Keep the key inside the two prefixes the app knows about, and reject
  // any attempt to climb out of them.
  const safe = pathname.replace(/^\/+/, "");
  if (
    (!safe.startsWith("books/") && !safe.startsWith("covers/")) ||
    safe.includes("..")
  ) {
    return Response.json({ error: "Bad pathname." }, { status: 400 });
  }

  const signed = await presignUpload(
    safe,
    typeof contentType === "string" && contentType
      ? contentType
      : "application/octet-stream",
  );

  return Response.json(signed);
}
