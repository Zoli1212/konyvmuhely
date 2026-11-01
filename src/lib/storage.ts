import { randomUUID } from "node:crypto";
import { createReadStream } from "node:fs";
import { mkdir, stat, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";

import { del, get, put } from "@vercel/blob";

import { blobConfigured, env } from "./env";

/**
 * Two storage drivers behind one interface.
 *
 *  - `blob`  - Vercel Blob. Covers are public (so <Image> can load them
 *              straight from the CDN); book files are private, so even a
 *              leaked URL is useless without the store token.
 *  - `local` - a .storage directory in the project. Only usable while
 *              developing, because Vercel's filesystem is read-only. It
 *              exists so the whole app can be run without a Vercel account.
 *
 * Which driver a given row used is recorded on the row itself
 * (`StorageKind`), so switching drivers never orphans existing files.
 */

export type StorageDriver = "blob" | "local";
export type Visibility = "public" | "private";

export const LOCAL_ROOT = path.join(process.cwd(), ".storage");

/** Maximum size we accept for a book file, in megabytes. */
export const MAX_BOOK_FILE_MB = 200;
/** Maximum size we accept for a cover image, in megabytes. */
export const MAX_COVER_MB = 8;

export function storageDriver(): StorageDriver {
  return blobConfigured() ? "blob" : "local";
}

/** True when the deployment cannot possibly write uploads anywhere. */
export function storageMisconfigured(): boolean {
  return storageDriver() === "local" && Boolean(process.env.VERCEL);
}

export type StoredFile = {
  storage: "BLOB" | "LOCAL";
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
  if (storageDriver() === "blob") {
    const result = await put(pathname, body, {
      access: options.visibility,
      contentType: options.contentType,
      addRandomSuffix: true,
      token: env.blobToken,
    });
    return { storage: "BLOB", url: result.url, pathname: result.pathname };
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
  storage: "BLOB" | "LOCAL";
  pathname: string;
  visibility: Visibility;
}): Promise<ReadResult | null> {
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

// --- Deleting ---

/** Best-effort delete. A missing file is not an error worth surfacing. */
export async function deleteStoredFile(ref: {
  storage: "BLOB" | "LOCAL";
  pathname: string;
  url?: string | null;
}): Promise<void> {
  try {
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
