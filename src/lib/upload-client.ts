import { upload } from "@vercel/blob/client";

import type { StorageDriver, Visibility } from "./storage";

/**
 * Browser-side upload. The two drivers differ in where the bytes go:
 *
 *  - blob:  straight from the browser to Vercel Blob, authorised by a token
 *           this app issues. Never passes through a serverless function, so
 *           the ~4.5 MB request body limit does not apply.
 *  - local: multipart POST to our own route, which writes to .storage.
 *           Development only.
 */

export type UploadedFile = {
  storage: "BLOB" | "LOCAL";
  url: string;
  pathname: string;
  fileName: string;
  sizeBytes: number;
};

/** Above this size the Blob SDK splits the upload and retries failed parts. */
const MULTIPART_THRESHOLD = 20 * 1024 * 1024;

export async function uploadToStore(options: {
  file: File;
  pathname: string;
  driver: StorageDriver;
  visibility: Visibility;
  onProgress?: (percent: number) => void;
  signal?: AbortSignal;
}): Promise<UploadedFile> {
  const { file, pathname, driver, visibility, onProgress, signal } = options;

  if (driver === "blob") {
    const result = await upload(pathname, file, {
      access: visibility,
      handleUploadUrl: "/api/admin/blob-upload",
      contentType: file.type || undefined,
      multipart: file.size > MULTIPART_THRESHOLD,
      abortSignal: signal,
      onUploadProgress: ({ percentage }) =>
        onProgress?.(Math.round(percentage)),
    });

    return {
      storage: "BLOB",
      url: result.url,
      pathname: result.pathname,
      fileName: file.name,
      sizeBytes: file.size,
    };
  }

  return uploadLocal({ file, pathname, onProgress, signal });
}

/**
 * XMLHttpRequest rather than fetch, purely because it reports upload progress.
 * A 150 MB file with no feedback feels broken.
 */
function uploadLocal(options: {
  file: File;
  pathname: string;
  onProgress?: (percent: number) => void;
  signal?: AbortSignal;
}): Promise<UploadedFile> {
  const { file, pathname, onProgress, signal } = options;

  return new Promise((resolve, reject) => {
    const form = new FormData();
    form.set("file", file);
    form.set("pathname", pathname);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/admin/upload");

    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        onProgress?.(Math.round((event.loaded / event.total) * 100));
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status < 200 || xhr.status >= 300) {
        reject(new Error(readError(xhr.responseText, xhr.status)));
        return;
      }

      try {
        resolve(JSON.parse(xhr.responseText) as UploadedFile);
      } catch {
        reject(new Error("The upload route returned an unreadable response."));
      }
    });

    xhr.addEventListener("error", () =>
      reject(new Error("The upload could not be sent.")),
    );
    xhr.addEventListener("abort", () => reject(new Error("Upload cancelled.")));

    signal?.addEventListener("abort", () => xhr.abort(), { once: true });

    xhr.send(form);
  });
}

function readError(responseText: string, status: number): string {
  try {
    const parsed = JSON.parse(responseText) as { error?: string };
    if (parsed.error) return parsed.error;
  } catch {
    // Fall through to the status code.
  }
  return `Upload failed (HTTP ${status}).`;
}
