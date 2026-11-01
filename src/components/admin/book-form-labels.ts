import type { Dictionary } from "@/i18n/dictionaries";
import { env } from "@/lib/env";
import { examplePrice } from "@/lib/money";

import type { BookFormLabels } from "./book-form";

/**
 * Flattens the dictionary into the plain-string props the client form needs.
 * Interpolated copy is resolved here, on the server, because a function
 * cannot be passed to a client component.
 */
export function buildBookFormLabels(
  t: Dictionary,
  mode: "create" | "edit",
): BookFormLabels {
  const f = t.admin.form;
  const currency = env.storeCurrency;

  return {
    basics: f.basics,
    slug: f.slug,
    slugHint: f.slugHint,
    author: f.author,
    titleHu: f.titleHu,
    titleEn: f.titleEn,
    subtitleHu: f.subtitleHu,
    subtitleEn: f.subtitleEn,
    blurbHu: f.blurbHu,
    blurbEn: f.blurbEn,
    blurbHint: f.blurbHint,
    descriptionHu: f.descriptionHu,
    descriptionEn: f.descriptionEn,
    descriptionHint: f.descriptionHint,
    englishHint: f.englishHint,
    pricing: f.pricing,
    price: f.price,
    priceHint: f.priceHint(currency, examplePrice(currency)),
    pageCount: f.pageCount,
    published: f.published,
    featured: f.featured,
    sortIndex: f.sortIndex,
    sortIndexHint: f.sortIndexHint,
    cover: f.cover,
    coverHint: f.coverHint,
    coverChange: f.coverChange,
    coverRemove: f.coverRemove,
    files: f.files,
    filesHint: f.filesHint,
    chooseFile: f.chooseFile,
    replaceFile: f.replaceFile,
    removeFile: f.removeFile,
    uploading: f.uploading,
    uploaded: f.uploaded,
    pendingUpload: f.pendingUpload,
    uploadFailed: f.uploadFailed,
    submit: mode === "create" ? f.create : f.update,
    saving: f.saving,
    saved: f.saved,
    optional: t.common.optional,
    editionHu: t.book.editionHu,
    editionEn: t.book.editionEn,
  };
}
