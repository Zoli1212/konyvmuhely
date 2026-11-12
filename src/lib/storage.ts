import { randomUUID } from "node:crypto";
import { createReadStream } from "node:fs";
import { mkdir, stat, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";

import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { del, get, put } from "@vercel/blob";

import { blobConfigured, env, r2Configured } from "./env";

/**
 * Two storage drivers behind one interface.
 *
 *  - `r2`    - Cloudflare R2 over the S3 API. The preferred driver: it
 *              meters stored bytes and requests, not "advanced operations",
 *              and charges nothing for egress. Objects are private and
 *              reached only through our own routes.
 *  - `blob`  - Vercel Blob. Everything is written as a *private* blob: a
 *              Blob store created with private access refuses public ones
 *              outright, and defaulting to private works on either kind of
 *              store. Covers are therefore served through /api/assets with a
 *              long immutable cache header rather than straight from the
 *              Blob CDN - after the first request the edge serves them, so
 *              the indirection costs one invocation per cover per region.
 *  - `local` - a .storage directory in the project. Only usable while
 *              developing, because Vercel's filesystem is read-only. It
 *              exists so the whole app can be run without a Vercel account.
 *
 * Which driver a given row used is recorded on the row itself
 * (`StorageKind`), so switching drivers never orphans existing files.
 */

export type StorageDriver = "r2" | "blob" | "local";
export type Visibility = "public" | "private";

export const LOCAL_ROOT = path.join(process.cwd(), ".storage");

/** Maximum size we accept for a book file, in megabytes. */
export const MAX_BOOK_FILE_MB = 200;
/** Maximum size we accept for a cover image, in megabytes. */
export const MAX_COVER_MB = 8;

export function storageDriver(): StorageDriver {
  // R2 wins when configured. Blob stays wired up underneath: rows written
  // before the move still say BLOB and keep reading from there, and
  // unsetting the R2 variables puts everything back as it was.
  if (r2Configured()) return "r2";
  return blobConfigured() ? "blob" : "local";
}

/** True when the deployment cannot possibly write uploads anywhere. */
export function storageMisconfigured(): boolean {
  return storageDriver() === "local" && Boolean(process.env.VERCEL);
}

let r2: S3Client | null = null;

function r2Client(): S3Client {
  r2 ??= new S3Client({
    region: "auto",
    endpoint: `https://${env.r2AccountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: env.r2AccessKeyId!,
      secretAccessKey: env.r2SecretAccessKey!,
    },
  });
  return r2;
}

export type StoredFile = {
  storage: "BLOB" | "LOCAL" | "R2";
  url: string;
  pathname: string;
};

// --- Writing (server-side; used by the local driver and by cover uploads) ---

function localDiskPath(pathname: string): string {
  // Reject traversal before touching the filesystem.
  const normalised = path
    .normalize(pathname)
    .replace(/^(\.\.(\/|\\|$))+/, "")
    .replace(/^[/\\]+/, "");

  const full = path.join(LOCAL_ROOT, normalised);

  if (!full.startsWith(LOCAL_ROOT)) {
    throw new Error("Refusing to resolve a path outside the local store.");
  }
  return full;
}

/**
 * Stores a file from the server. Used for covers and by the local-development
 * upload route; large book files on Vercel go straight from the browser to
 * Blob instead (see src/lib/upload-client.ts).
 */
export async function storeFile(
  pathname: string,
  body: Buffer,
  options: { visibility: Visibility; contentType?: string },
): Promise<StoredFile> {
  if (storageDriver() === "r2") {
    // Suffixed for the same reason the other drivers do it: replacing a
    // file must not overwrite the old key, which is deleted afterwards.
    const key = withRandomSuffix(pathname);
    await r2Client().send(
      new PutObjectCommand({
        Bucket: env.r2Bucket!,
        Key: key,
        Body: body,
        ContentType: options.contentType,
      }),
    );

    return {
      storage: "R2",
      // The bucket is private, so there is no browser-reachable URL; both
      // kinds go through our routes, which is already true of Blob.
      url: options.visibility === "public" ? `/api/assets/${key}` : "",
      pathname: key,
    };
  }

  if (storageDriver() === "blob") {
    const result = await put(pathname, body, {
      // Always private - see the note at the top of this file.
      access: "private",
      contentType: options.contentType,
      addRandomSuffix: true,
      token: env.blobToken,
    });

    return {
      storage: "BLOB",
      // A public asset is addressed by our own route, never by the Blob URL,
      // because a private blob cannot be fetched without the store token.
      url:
        options.visibility === "public"
          ? `/api/assets/${result.pathname}`
          : result.url,
      pathname: result.pathname,
    };
  }

  // Blob gets `addRandomSuffix`, and the local driver needs the equivalent for
  // the same reason: replacing a file must not write over the old one, because
  // the old one is deleted afterwards and would take the new bytes with it.
  const suffixed = withRandomSuffix(pathname);

  const diskPath = localDiskPath(suffixed);
  await mkdir(path.dirname(diskPath), { recursive: true });
  await writeFile(diskPath, body);

  return {
    storage: "LOCAL",
    // Public local files are served by the /api/assets route; private ones are
    // only ever reachable through /api/download, which needs no URL.
    url: options.visibility === "public" ? `/api/assets/${suffixed}` : "",
    pathname: suffixed,
  };
}

function withRandomSuffix(pathname: string): string {
  const token = randomUUID().slice(0, 8);
  const lastSlash = pathname.lastIndexOf("/");
  const dir = lastSlash >= 0 ? pathname.slice(0, lastSlash + 1) : "";
  const name = pathname.slice(lastSlash + 1);

  const lastDot = name.lastIndexOf(".");
  if (lastDot <= 0) return `${dir}${name}-${token}`;

  return `${dir}${name.slice(0, lastDot)}-${token}${name.slice(lastDot)}`;
}

// --- Reading ---

export type ReadResult = {
  stream: ReadableStream<Uint8Array>;
  size: number | null;
  contentType: string | null;
};

/**
 * Opens a stored file for streaming to the client. Nothing is buffered in
 * memory, so a 150 MB PDF costs the function almost no heap.
 */
export async function readStoredFile(ref: {
  storage: "BLOB" | "LOCAL" | "R2";
  pathname: string;
  visibility: Visibility;
}): Promise<ReadResult | null> {
  if (ref.storage === "R2") {
    try {
      const out = await r2Client().send(
        new GetObjectCommand({ Bucket: env.r2Bucket!, Key: ref.pathname }),
      );
      if (!out.Body) return null;

      return {
        stream: out.Body.transformToWebStream(),
        size: out.ContentLength ?? null,
        contentType: out.ContentType ?? null,
      };
    } catch {
      return null;
    }
  }

  if (ref.storage === "BLOB") {
    const result = await get(ref.pathname, {
      access: ref.visibility,
      token: env.blobToken,
    });

    if (!result || result.statusCode !== 200) return null;

    return {
      stream: result.stream,
      size: result.blob.size,
      contentType: result.blob.contentType,
    };
  }

  const diskPath = localDiskPath(ref.pathname);

  let size: number;
  try {
    size = (await stat(diskPath)).size;
  } catch {
    return null;
  }

  return {
    stream: Readable.toWeb(
      createReadStream(diskPath),
    ) as ReadableStream<Uint8Array>,
    size,
    contentType: null,
  };
}

/**
 * A short-lived URL the buyer's browser can fetch straight from R2.
 *
 * This is the reason R2 is worth the move. `readStoredFile` works for R2 too,
 * but streaming through our own route means every paid megabyte leaves via the
 * platform's egress - 240 MB of books served that way is exactly the bill we
 * are trying to stop paying. Handing the browser a signed URL instead takes
 * the bytes R2 -> buyer and the function out of the data path entirely.
 *
 * The trade-off is that the URL is a bearer token for as long as it lives, so
 * it lives briefly (see `env.r2SignedUrlTtl`) and is only ever issued to a
 * request that already proved its entitlement.
 *
 * Returns null for any other driver, so the caller falls back to streaming.
 */
export async function signedDownloadUrl(ref: {
  storage: "BLOB" | "LOCAL" | "R2";
  pathname: string;
  fileName: string;
  contentType?: string;
}): Promise<string | null> {
  if (ref.storage !== "R2" || !r2Configured()) return null;

  // Asking R2 to set the download headers on the response means the browser
  // saves "Gyertya és tükörmágia.pdf" rather than a random key, even though
  // our route is no longer in the way to set them itself.
  const command = new GetObjectCommand({
    Bucket: env.r2Bucket!,
    Key: ref.pathname,
    ResponseContentDisposition: contentDisposition(ref.fileName),
    ResponseContentType: ref.contentType,
    ResponseCacheControl: "private, no-store, max-age=0",
  });

  return getSignedUrl(r2Client(), command, {
    expiresIn: env.r2SignedUrlTtl,
  });
}

/**
 * Content-Disposition with a non-ASCII file name needs both forms: a stripped
 * ASCII `filename` for old clients and an RFC 5987 `filename*` for the rest.
 * Without this, "Gyertya és tükörmágia.pdf" either breaks the header or
 * arrives mangled.
 */
export function contentDisposition(fileName: string): string {
  const ascii = fileName.replace(/[^\x20-\x7e]/g, "_").replace(/["\\]/g, "_");
  const encoded = encodeURIComponent(fileName);
  return `attachment; filename="${ascii}"; filename*=UTF-8''${encoded}`;
}

// --- Deleting ---

/** Best-effort delete. A missing file is not an error worth surfacing. */
export async function deleteStoredFile(ref: {
  storage: "BLOB" | "LOCAL" | "R2";
  pathname: string;
  url?: string | null;
}): Promise<void> {
  try {
    if (ref.storage === "R2") {
      await r2Client().send(
        new DeleteObjectCommand({ Bucket: env.r2Bucket!, Key: ref.pathname }),
      );
      return;
    }
    if (ref.storage === "BLOB") {
      await del(ref.url || ref.pathname, { token: env.blobToken });
      return;
    }
    await unlink(localDiskPath(ref.pathname));
  } catch {
    // Already gone, or never written. Nothing to clean up.
  }
}

// --- Naming ---

const EXTENSION_BY_FORMAT = { PDF: "pdf", EPUB: "epub" } as const;

export const BOOK_FILE_ACCEPT = ".pdf,.epub,application/pdf,application/epub+zip";
export const COVER_ACCEPT = "image/jpeg,image/png,image/webp,image/avif";

/** Content types we accept for a book file, keyed by format. */
export const BOOK_FILE_CONTENT_TYPES: Record<"PDF" | "EPUB", string[]> = {
  PDF: ["application/pdf"],
  EPUB: ["application/epub+zip", "application/zip", "application/octet-stream"],
};

export const COVER_CONTENT_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
];

/** Infers PDF/EPUB from a file name, or null when it is neither. */
export function formatFromFileName(name: string): "PDF" | "EPUB" | null {
  const lower = name.toLowerCase();
  if (lower.endsWith(".pdf")) return "PDF";
  if (lower.endsWith(".epub")) return "EPUB";
  return null;
}

/**
 * Storage pathname for a book file. The slug keeps the store browsable in the
 * Blob dashboard; `addRandomSuffix` makes the final URL unguessable.
 */
export function bookFilePathname(
  slug: string,
  fileLocale: "HU" | "EN",
  format: "PDF" | "EPUB",
): string {
  return `books/${slug}/${slug}-${fileLocale.toLowerCase()}.${EXTENSION_BY_FORMAT[format]}`;
}

export function coverPathname(slug: string, originalName: string): string {
  const ext = originalName.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  return `covers/${slug}.${ext}`;
}

/** Human-readable size for the admin tables, e.g. "12,4 MB". */
export function formatBytes(bytes: number, locale: string): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) {
    return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(bytes / 1024)} kB`;
  }
  return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(bytes / (1024 * 1024))} MB`;
}
