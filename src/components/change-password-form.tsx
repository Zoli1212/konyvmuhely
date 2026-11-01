"use client";

import { useActionState } from "react";

import { changePassword } from "@/actions/account";
import { emptyAccountState } from "@/actions/form-state";
import { CheckIcon } from "@/components/icons";
import { SubmitButton } from "@/components/submit-button";
import type { Locale } from "@/i18n/config";

export type ChangePasswordLabels = {
  current: string;
  next: string;
  confirm: string;
  hint: string;
  submit: string;
  pending: string;
  saved: string;
};

export function ChangePasswordForm({
  locale,
  labels,
}: {
  locale: Locale;
  labels: ChangePasswordLabels;
}) {
  const [state, action] = useActionState(changePassword, emptyAccountState);

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="locale" value={locale} />

      {state.error ? (
        <p
          role="alert"
          className="rounded-lg border border-rose-400/30 bg-rose-400/10 px-3.5 py-2.5 text-sm text-rose-400"
        >
          {state.error}
        </p>
      ) : null}

      {state.ok ? (
        <p className="flex items-center gap-2 rounded-lg border border-sage-400/30 bg-sage-400/10 px-3.5 py-2.5 text-sm text-sage-400">
          <CheckIcon className="h-4 w-4" />
          {labels.saved}
        </p>
      ) : null}

      <div>
        <label htmlFor="current" className="field-label">
          {labels.current}
        </label>
        <input
          id="current"
          name="current"
          type="password"
          autoComplete="current-password"
          required
          className="field"
        />
      </div>

      <div>
        <label htmlFor="next" className="field-label">
          {labels.next}
        </label>
        <input
          id="next"
          name="next"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          className="field"
        />
        <p className="field-hint">{labels.hint}</p>
      </div>

      <div>
        <label htmlFor="confirm" className="field-label">
          {labels.confirm}
        </label>
        <input
          id="confirm"
          name="confirm"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          className="field"
        />
      </div>

      <SubmitButton className="btn btn-primary" pendingLabel={labels.pending}>
        {labels.submit}
      </SubmitButton>
    </form>
  );
}
