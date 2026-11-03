"use client";

import { useActionState, useMemo, useRef, useState } from "react";

import { createBook, updateBook } from "@/actions/books";
import { emptyBookFormState } from "@/actions/form-state";
import { CheckIcon, TrashIcon, UploadIcon, WarningIcon } from "@/components/icons";
import { SubmitButton } from "@/components/submit-button";
import type { Locale } from "@/i18n/config";
import type { StorageDriver } from "@/lib/storage";
import { slugify } from "@/lib/slug";
import { uploadToStore, type UploadedFile } from "@/lib/upload-client";

/**
 * The admin book form.
 *
 * Files upload the moment they are chosen, not on submit: a 150 MB e-book
 * needs its own progress bar, and the Save button should stay instant. What
 * actually reaches the server action is two JSON fields describing uploads
 * and removals, derived from this component's state at render time - so
 * whatever the state says when Save is pressed is what gets saved.
 */

const SLOTS = [
  { fileLocale: "HU", format: "PDF" },
  { fileLocale: "HU", format: "EPUB" },
  { fileLocale: "EN", format: "PDF" },
  { fileLocale: "EN", format: "EPUB" },
] as const;

const EXTENSION = { PDF: "pdf", EPUB: "epub" } as const;

type FileLocale = "HU" | "EN";
type BookFormat = "PDF" | "EPUB";

export type ExistingFile = {
  id: string;
  fileLocale: FileLocale;
  format: BookFormat;
  fileName: string;
  sizeBytes: number;
};

export type BookFormValues = {
  id: string;
  slug: string;
  author: string;
  titleHu: string;
  titleEn: string;
  subtitleHu: string;
  subtitleEn: string;
  blurbHu: string;
  blurbEn: string;
  descriptionHu: string;
  descriptionEn: string;
  price: string;
  pageCount: string;
  published: boolean;
  featured: boolean;
  sortIndex: string;
  coverUrl: string | null;
  files: ExistingFile[];
};

export type BookFormLabels = {
  basics: string;
  slug: string;
  slugHint: string;
  author: string;
  titleHu: string;
  titleEn: string;
  subtitleHu: string;
  subtitleEn: string;
  blurbHu: string;
  blurbEn: string;
  blurbHint: string;
  descriptionHu: string;
  descriptionEn: string;
  descriptionHint: string;
  englishHint: string;
  pricing: string;
  price: string;
  priceHint: string;
  pageCount: string;
  published: string;
  featured: string;
  sortIndex: string;
  sortIndexHint: string;
  cover: string;
  coverHint: string;
  coverChange: string;
  coverRemove: string;
  files: string;
  filesHint: string;
  chooseFile: string;
  replaceFile: string;
  removeFile: string;
  uploading: string;
  uploaded: string;
  pendingUpload: string;
  uploadFailed: string;
  submit: string;
  saving: string;
  saved: string;
  optional: string;
  editionHu: string;
  editionEn: string;
};

type SlotState =
  | { kind: "empty" }
  | { kind: "existing"; fileName: string; sizeBytes: number }
  | { kind: "uploading"; fileName: string; percent: number }
  | { kind: "uploaded"; upload: UploadedFile }
  | { kind: "error"; message: string };

type CoverState =
  | { kind: "empty" }
  | { kind: "existing"; url: string }
  | { kind: "uploading"; percent: number }
  | { kind: "uploaded"; upload: UploadedFile }
  | { kind: "error"; message: string };

function slotKey(fileLocale: FileLocale, format: BookFormat): string {
  return `${fileLocale}:${format}`;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} kB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function BookForm({
  mode,
  locale,
  driver,
  labels,
  initial,
}: {
  mode: "create" | "edit";
  locale: Locale;
  driver: StorageDriver;
  labels: BookFormLabels;
  initial: BookFormValues | null;
}) {
  const [state, action] = useActionState(
    mode === "create" ? createBook : updateBook,
    emptyBookFormState,
  );

  // Controlled, because the storage pathname for an upload is derived from the
  // title before the book exists, and because the slug preview follows along.
  const [titleHu, setTitleHu] = useState(initial?.titleHu ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initial?.slug));

  const effectiveSlug = slugTouched ? slugify(slug) : slugify(titleHu);
  const pathPrefix = effectiveSlug || "untitled";

  const [cover, setCover] = useState<CoverState>(
    initial?.coverUrl
      ? { kind: "existing", url: initial.coverUrl }
      : { kind: "empty" },
  );
  const [coverRemoved, setCoverRemoved] = useState(false);

  const [slots, setSlots] = useState<Record<string, SlotState>>(() => {
    const base: Record<string, SlotState> = {};
    for (const slot of SLOTS) {
      const key = slotKey(slot.fileLocale, slot.format);
      const existing = initial?.files.find(
        (f) => f.fileLocale === slot.fileLocale && f.format === slot.format,
      );
      base[key] = existing
        ? {
            kind: "existing",
            fileName: existing.fileName,
            sizeBytes: existing.sizeBytes,
          }
        : { kind: "empty" };
    }
    return base;
  });

  const [removedSlots, setRemovedSlots] = useState<string[]>([]);

  const busy =
    cover.kind === "uploading" ||
    Object.values(slots).some((s) => s.kind === "uploading");

  // --- what the server action receives ---

  const uploadsField = useMemo(() => {
    const files = SLOTS.flatMap((slot) => {
      const current = slots[slotKey(slot.fileLocale, slot.format)];
      if (current?.kind !== "uploaded") return [];
      return [
        {
          fileLocale: slot.fileLocale,
          format: slot.format,
          ...current.upload,
        },
      ];
    });

    return JSON.stringify({
      cover: cover.kind === "uploaded" ? cover.upload : null,
      files,
    });
  }, [slots, cover]);

  const removalsField = useMemo(
    () => JSON.stringify({ cover: coverRemoved, files: removedSlots }),
    [coverRemoved, removedSlots],
  );

  // --- upload handlers ---

  async function handleCoverPick(file: File) {
    setCover({ kind: "uploading", percent: 0 });
    setCoverRemoved(false);

    try {
      const extension =
        file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") ||
        "jpg";

      const upload = await uploadToStore({
        file,
        pathname: `covers/${pathPrefix}.${extension}`,
        driver,
        // Private like every other blob; /api/assets serves it publicly.
        visibility: "private",
        onProgress: (percent) => setCover({ kind: "uploading", percent }),
      });

      setCover({ kind: "uploaded", upload });
    } catch (error) {
      setCover({
        kind: "error",
        message: error instanceof Error ? error.message : labels.uploadFailed,
      });
    }
  }

  async function handleFilePick(
    fileLocale: FileLocale,
    format: BookFormat,
    file: File,
  ) {
    const key = slotKey(fileLocale, format);

    setSlots((previous) => ({
      ...previous,
      [key]: { kind: "uploading", fileName: file.name, percent: 0 },
    }));
    setRemovedSlots((previous) => previous.filter((s) => s !== key));

    try {
      const upload = await uploadToStore({
        file,
        pathname: `books/${pathPrefix}/${pathPrefix}-${fileLocale.toLowerCase()}.${EXTENSION[format]}`,
        driver,
        visibility: "private",
        onProgress: (percent) =>
          setSlots((previous) => ({
            ...previous,
            [key]: { kind: "uploading", fileName: file.name, percent },
          })),
      });

      setSlots((previous) => ({
        ...previous,
        [key]: { kind: "uploaded", upload },
      }));
    } catch (error) {
      setSlots((previous) => ({
        ...previous,
        [key]: {
          kind: "error",
          message:
            error instanceof Error ? error.message : labels.uploadFailed,
        },
      }));
    }
  }

  function handleFileRemove(fileLocale: FileLocale, format: BookFormat) {
    const key = slotKey(fileLocale, format);
    const current = slots[key];

    setSlots((previous) => ({ ...previous, [key]: { kind: "empty" } }));

    // Only a file already in the database needs a removal instruction; an
    // upload that has not been saved yet simply stops being mentioned.
    if (current?.kind === "existing") {
      setRemovedSlots((previous) => [...new Set([...previous, key])]);
    }
  }

  return (
    <form action={action} className="space-y-10">
      <input type="hidden" name="locale" value={locale} />
      {initial ? (
        <input type="hidden" name="bookId" value={initial.id} />
      ) : null}
      <input type="hidden" name="uploads" value={uploadsField} />
      <input type="hidden" name="removals" value={removalsField} />

      {state.error ? (
        <p
          role="alert"
          className="flex items-start gap-2.5 rounded-lg border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-400"
        >
          <WarningIcon className="mt-0.5 h-4 w-4 shrink-0" />
          {state.error}
        </p>
      ) : null}

      {state.ok ? (
        <p className="flex items-center gap-2.5 rounded-lg border border-sage-400/30 bg-sage-400/10 px-4 py-3 text-sm text-sage-400">
          <CheckIcon className="h-4 w-4" />
          {labels.saved}
        </p>
      ) : null}

      {/* ---------------- basics ---------------- */}
      <Section title={labels.basics}>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label={labels.titleHu} htmlFor="titleHu" required>
            <input
              id="titleHu"
              name="titleHu"
              required
              value={titleHu}
              onChange={(event) => setTitleHu(event.target.value)}
              className="field"
            />
          </Field>

          <Field label={labels.titleEn} htmlFor="titleEn" optional={labels.optional}>
            <input
              id="titleEn"
              name="titleEn"
              defaultValue={initial?.titleEn ?? ""}
              className="field"
            />
          </Field>

          <Field label={labels.subtitleHu} htmlFor="subtitleHu" optional={labels.optional}>
            <input
              id="subtitleHu"
              name="subtitleHu"
              defaultValue={initial?.subtitleHu ?? ""}
              className="field"
            />
          </Field>

          <Field label={labels.subtitleEn} htmlFor="subtitleEn" optional={labels.optional}>
            <input
              id="subtitleEn"
              name="subtitleEn"
              defaultValue={initial?.subtitleEn ?? ""}
              className="field"
            />
          </Field>

          <Field label={labels.author} htmlFor="author" required>
            <input
              id="author"
              name="author"
              required
              defaultValue={initial?.author ?? ""}
              className="field"
            />
          </Field>

          <Field label={labels.slug} htmlFor="slug" hint={labels.slugHint}>
            <input
              id="slug"
              name="slug"
              value={slugTouched ? slug : effectiveSlug}
              onChange={(event) => {
                setSlugTouched(true);
                setSlug(event.target.value);
              }}
              className="field font-mono text-sm"
              placeholder="gyertya-es-tukormagia"
            />
          </Field>
        </div>

        <p className="field-hint">{labels.englishHint}</p>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label={labels.blurbHu} htmlFor="blurbHu" required hint={labels.blurbHint}>
            <textarea
              id="blurbHu"
              name="blurbHu"
              required
              rows={3}
              defaultValue={initial?.blurbHu ?? ""}
              className="field resize-y"
            />
          </Field>

          <Field label={labels.blurbEn} htmlFor="blurbEn" optional={labels.optional}>
            <textarea
              id="blurbEn"
              name="blurbEn"
              rows={3}
              defaultValue={initial?.blurbEn ?? ""}
              className="field resize-y"
            />
          </Field>

          <Field
            label={labels.descriptionHu}
            htmlFor="descriptionHu"
            hint={labels.descriptionHint}
          >
            <textarea
              id="descriptionHu"
              name="descriptionHu"
              rows={10}
              defaultValue={initial?.descriptionHu ?? ""}
              className="field resize-y"
            />
          </Field>

          <Field
            label={labels.descriptionEn}
            htmlFor="descriptionEn"
            optional={labels.optional}
          >
            <textarea
              id="descriptionEn"
              name="descriptionEn"
              rows={10}
              defaultValue={initial?.descriptionEn ?? ""}
              className="field resize-y"
            />
          </Field>
        </div>
      </Section>

      {/* ---------------- pricing ---------------- */}
      <Section title={labels.pricing}>
        <div className="grid gap-5 sm:grid-cols-3">
          <Field label={labels.price} htmlFor="price" required hint={labels.priceHint}>
            <input
              id="price"
              name="price"
              required
              inputMode="decimal"
              defaultValue={initial?.price ?? ""}
              className="field tabular-nums"
              placeholder="4990"
            />
          </Field>

          <Field label={labels.pageCount} htmlFor="pageCount" optional={labels.optional}>
            <input
              id="pageCount"
              name="pageCount"
              type="number"
              min={1}
              defaultValue={initial?.pageCount ?? ""}
              className="field tabular-nums"
            />
          </Field>

          <Field
            label={labels.sortIndex}
            htmlFor="sortIndex"
            hint={labels.sortIndexHint}
          >
            <input
              id="sortIndex"
              name="sortIndex"
              type="number"
              defaultValue={initial?.sortIndex ?? "0"}
              className="field tabular-nums"
            />
          </Field>
        </div>

        <div className="flex flex-wrap gap-x-8 gap-y-3">
          <Checkbox
            name="published"
            label={labels.published}
            defaultChecked={initial?.published ?? false}
          />
          <Checkbox
            name="featured"
            label={labels.featured}
            defaultChecked={initial?.featured ?? false}
          />
        </div>
      </Section>

      {/* ---------------- cover ---------------- */}
      <Section title={labels.cover} hint={labels.coverHint}>
        <CoverPicker
          state={cover}
          labels={labels}
          onPick={handleCoverPick}
          onRemove={() => {
            setCover({ kind: "empty" });
            setCoverRemoved(true);
          }}
        />
      </Section>

      {/* ---------------- files ---------------- */}
      <Section title={labels.files} hint={labels.filesHint}>
        <div className="grid gap-4 sm:grid-cols-2">
          {SLOTS.map((slot) => (
            <FileSlot
              key={slotKey(slot.fileLocale, slot.format)}
              fileLocale={slot.fileLocale}
              format={slot.format}
              state={slots[slotKey(slot.fileLocale, slot.format)] ?? { kind: "empty" }}
              labels={labels}
              onPick={(file) =>
                handleFilePick(slot.fileLocale, slot.format, file)
              }
              onRemove={() => handleFileRemove(slot.fileLocale, slot.format)}
            />
          ))}
        </div>
      </Section>

      <div className="flex items-center gap-4 border-t border-ink-800 pt-7">
        <SubmitButton
          className="btn btn-primary btn-lg"
          pendingLabel={labels.saving}
          disabled={busy}
        >
          {labels.submit}
        </SubmitButton>

        {busy ? (
          <span className="text-sm text-mute">{labels.uploading}…</span>
        ) : null}
      </div>
    </form>
  );
}

/* ------------------------------------------------------------------ *
 *  Pieces
 * ------------------------------------------------------------------ */

function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-5">
      <div className="border-b border-ink-800 pb-3">
        <h2 className="font-display text-lg font-semibold text-paper">
          {title}
        </h2>
        {hint ? <p className="field-hint">{hint}</p> : null}
      </div>
      {children}
    </section>
  );
}

function Field({
  label,
  htmlFor,
  hint,
  required = false,
  optional,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  required?: boolean;
  optional?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="field-label">
        {label}
        {required ? <span className="ml-1 text-gold-400">*</span> : null}
        {!required && optional ? (
          <span className="ml-1.5 font-normal text-mute">({optional})</span>
        ) : null}
      </label>
      {children}
      {hint ? <p className="field-hint">{hint}</p> : null}
    </div>
  );
}

function Checkbox({
  name,
  label,
  defaultChecked,
}: {
  name: string;
  label: string;
  defaultChecked: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-sm text-paper-dim">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="h-4 w-4 cursor-pointer rounded border-ink-600 bg-ink-900 accent-gold-500"
      />
      {label}
    </label>
  );
}

function CoverPicker({
  state,
  labels,
  onPick,
  onRemove,
}: {
  state: CoverState;
  labels: BookFormLabels;
  onPick: (file: File) => void;
  onRemove: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const previewUrl =
    state.kind === "existing"
      ? state.url
      : state.kind === "uploaded"
        ? state.upload.url
        : null;

  return (
    <div className="flex items-start gap-5">
      <div className="w-28 shrink-0">
        {previewUrl ? (
          // Deliberately a plain <img>: this is a transient admin preview that
          // may point at a just-written blob, where next/image's optimiser has
          // nothing cached and would only add a round trip.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewUrl}
            alt=""
            className="aspect-2/3 w-full rounded-sm object-cover shadow-cover"
          />
        ) : (
          <div className="aspect-2/3 w-full rounded-sm border border-dashed border-ink-600 bg-ink-900" />
        )}
      </div>

      <div className="space-y-2.5">
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) onPick(file);
            event.target.value = "";
          }}
        />

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={state.kind === "uploading"}
            className="btn btn-secondary btn-sm"
          >
            <UploadIcon className="h-3.5 w-3.5" />
            {previewUrl ? labels.coverChange : labels.cover}
          </button>

          {previewUrl ? (
            <button
              type="button"
              onClick={onRemove}
              disabled={state.kind === "uploading"}
              className="btn btn-danger btn-sm"
            >
              <TrashIcon className="h-3.5 w-3.5" />
              {labels.coverRemove}
            </button>
          ) : null}
        </div>

        {state.kind === "uploading" ? (
          <Progress percent={state.percent} label={labels.uploading} />
        ) : null}

        {state.kind === "uploaded" ? (
          <p className="flex items-center gap-1.5 text-xs text-sage-400">
            <CheckIcon className="h-3 w-3" />
            {labels.pendingUpload}
          </p>
        ) : null}

        {state.kind === "error" ? (
          <p className="text-xs text-rose-400">{state.message}</p>
        ) : null}
      </div>
    </div>
  );
}

function FileSlot({
  fileLocale,
  format,
  state,
  labels,
  onPick,
  onRemove,
}: {
  fileLocale: FileLocale;
  format: BookFormat;
  state: SlotState;
  labels: BookFormLabels;
  onPick: (file: File) => void;
  onRemove: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const filled = state.kind === "existing" || state.kind === "uploaded";

  return (
    <div
      className={`rounded-lg border px-4 py-3.5 transition-colors ${
        filled ? "border-ink-600 bg-ink-900/60" : "border-dashed border-ink-700"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-paper">
          {fileLocale === "HU" ? labels.editionHu : labels.editionEn}
          <span className="mx-1.5 text-ink-500">·</span>
          <span className="text-gold-300">{format}</span>
        </p>

        <input
          ref={inputRef}
          type="file"
          accept={format === "PDF" ? ".pdf,application/pdf" : ".epub,application/epub+zip"}
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) onPick(file);
            event.target.value = "";
          }}
        />

        <div className="flex shrink-0 gap-1.5">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={state.kind === "uploading"}
            className="btn btn-ghost btn-sm"
          >
            <UploadIcon className="h-3.5 w-3.5" />
            {filled ? labels.replaceFile : labels.chooseFile}
          </button>

          {filled ? (
            <button
              type="button"
              onClick={onRemove}
              className="btn btn-ghost btn-sm text-rose-400"
              aria-label={labels.removeFile}
            >
              <TrashIcon className="h-3.5 w-3.5" />
            </button>
          ) : null}
        </div>
      </div>

      <div className="mt-2">
        {state.kind === "existing" ? (
          <p className="truncate text-xs text-mute">
            {state.fileName}
            <span className="ml-2 tabular-nums">
              {formatBytes(state.sizeBytes)}
            </span>
          </p>
        ) : null}

        {state.kind === "uploading" ? (
          <Progress percent={state.percent} label={labels.uploading} />
        ) : null}

        {state.kind === "uploaded" ? (
          <p className="flex items-center gap-1.5 text-xs text-sage-400">
            <CheckIcon className="h-3 w-3" />
            <span className="truncate">{state.upload.fileName}</span>
            <span className="tabular-nums">
              {formatBytes(state.upload.sizeBytes)}
            </span>
            <span className="text-mute">· {labels.pendingUpload}</span>
          </p>
        ) : null}

        {state.kind === "error" ? (
          <p className="text-xs text-rose-400">{state.message}</p>
        ) : null}
      </div>
    </div>
  );
}

function Progress({ percent, label }: { percent: number; label: string }) {
  return (
    <div>
      <div className="h-1 w-full overflow-hidden rounded-full bg-ink-700">
        <div
          className="h-full rounded-full bg-gold-500 transition-[width] duration-200"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="mt-1 text-xs text-mute tabular-nums">
        {label} {percent}%
      </p>
    </div>
  );
}
