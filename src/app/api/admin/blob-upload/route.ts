import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";

import { assertAdmin } from "@/lib/auth-guard";
import { blobConfigured, env } from "@/lib/env";
import {
  BOOK_FILE_CONTENT_TYPES,
  COVER_CONTENT_TYPES,
  MAX_BOOK_FILE_MB,
  MAX_COVER_MB,
} from "@/lib/storage";

/**
 * Issues short-lived client tokens so the browser can upload straight to
 * Vercel Blob.
 *
 * This is why a 150 MB book works at all: a serverless function may only
 * receive about 4.5 MB of request body, so routing an e-book through the
 * server is not an option. The bytes go browser -> Blob; the server only
 * authorises the transfer and constrains what may be written.
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

  if (!blobConfigured()) {
    return Response.json(
      { error: "No Blob store is connected (BLOB_READ_WRITE_TOKEN or BLOB_STORE_ID)." },
      { status: 500 },
    );
  }

  const body = (await request.json()) as HandleUploadBody;

  try {
    const result = await handleUpload({
      body,
      request,
      // Undefined on purpose when only BLOB_STORE_ID is set: the SDK then
      // authenticates with the deployment's short-lived OIDC token instead.
      token: env.blobToken,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        const isCover = pathname.startsWith("covers/");
        const isBook = pathname.startsWith("books/");

        // The token is scoped to the pathname the client asked for, so this
        // is where an upload outside the store's own prefixes is refused.
        if (!isCover && !isBook) {
          throw new Error("Uploads are only allowed under covers/ or books/.");
        }

        return {
          allowedContentTypes: isCover
            ? COVER_CONTENT_TYPES
            : [...BOOK_FILE_CONTENT_TYPES.PDF, ...BOOK_FILE_CONTENT_TYPES.EPUB],
          maximumSizeInBytes: (isCover ? MAX_COVER_MB : MAX_BOOK_FILE_MB) * MB,
          // Makes the final URL unguessable, which matters for covers: they
          // are public, and we would rather an unreleased cover not be
          // discoverable from the slug alone.
          addRandomSuffix: true,
          tokenPayload: clientPayload ?? undefined,
        };
      },
      // No onUploadCompleted: the admin form records the returned metadata
      // itself when the book is saved, and a localhost callback URL would not
      // be reachable from Vercel's side anyway.
    });

    return Response.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed.";
    return Response.json({ error: message }, { status: 400 });
  }
}
