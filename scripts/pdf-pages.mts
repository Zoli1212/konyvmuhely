import { inflateRawSync, inflateSync } from "node:zlib";

/**
 * How many pages a PDF actually has.
 *
 * Written by hand rather than pulled from a library: the publisher needs
 * one number, and a PDF toolkit is a large dependency to carry — and a
 * shell-out to `pdfinfo` would make publishing depend on a tool that
 * happens to be installed.
 *
 * The page tree root carries `/Count N`. In older files it sits in the
 * bytes; since PDF 1.5 it is usually inside a compressed object stream, so
 * the FlateDecode streams are inflated and searched too. Intermediate tree
 * nodes also carry a `/Count`, always smaller than the root's, so the
 * largest value found is the page count.
 */
export function pdfPageCount(bytes: Buffer): number | null {
  let best = 0;

  const scan = (text: string) => {
    for (const m of text.matchAll(/\/Count\s+(\d+)/g)) {
      const n = Number(m[1]);
      if (Number.isFinite(n) && n > best) best = n;
    }
  };

  scan(bytes.toString("latin1"));

  // Stream payloads sit between `stream` and `endstream`. The end-of-line
  // before `endstream` belongs to the file, not to the compressed data, so
  // it has to come off or the inflate fails and the stream is skipped —
  // which is exactly where a page tree root tends to hide.
  const raw = bytes.toString("latin1");
  for (const m of raw.matchAll(/stream\r?\n/g)) {
    const from = m.index + m[0].length;
    const marker = raw.indexOf("endstream", from);
    if (marker < 0) continue;

    let to = marker;
    while (to > from && (raw[to - 1] === "\n" || raw[to - 1] === "\r")) to--;

    const chunk = bytes.subarray(from, to);
    for (const inflate of [inflateSync, inflateRawSync]) {
      try {
        scan(inflate(chunk).toString("latin1"));
        break;
      } catch {
        // Not deflated this way; try the other, then give up on this one.
        // The raw scan above already covered whatever was legible.
      }
    }
  }

  return best > 0 ? best : null;
}
