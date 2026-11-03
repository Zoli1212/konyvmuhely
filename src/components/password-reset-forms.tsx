"use client";

import { useActionState } from "react";

import { emptyAccountState, emptyAuthState } from "@/actions/form-state";
import { requestPasswordReset, resetPassword } from "@/actions/password-reset";
import { CheckIcon } from "@/components/icons";
import { SubmitButton } from "@/components/submit-button";
import type { Locale } from "@/i18n/config";

/**
 * The two reset forms. Both are client components so the result appears in
 * place; the request form in particular must not reveal through a redirect
 * whether the address was found.
 */

export type RequestLabels = {
  email: string;
  submit: string;
  pending: string;
  sentTitle: string;
  sentLead: string;
};

export function RequestResetForm({
  locale,
  labels,
}: {
  locale: Locale;
  labels: RequestLabels;
}) {
  const [state, action, pending] = useActionState(
    requestPasswordReset,
    emptyAuthState,
  );

  // A null error after a submission means "accepted" - which is the same
  // answer whether or not an account exists.
  const submitted = !pending && state !== emptyAuthState && state.error === null;

  if (submitted) {
    return (
      <div className="flex items-start gap-3 rounded-lg border border-sage-400/30 bg-sage-400/10 px-4 py-3.5">
        <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-sage-400" />
        <div>
          <p className="text-sm font-semibold text-sage-400">
            {labels.sentTitle}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-paper-dim">
            {labels.sentLead}
          </p>
        </div>
      </div>
    );
  }

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

      <div>
        <label htmlFor="email" className="field-label">
          {labels.email}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="field"
          placeholder="nev@example.com"
        />
      </div>

      <SubmitButton className="btn btn-primary w-full" pendingLabel={labels.pending}>
        {labels.submit}
      </SubmitButton>
    </form>
  );
}

export type SetLabels = {
  password: string;
  confirm: string;
  hint: string;
  submit: string;
  pending: string;
  doneTitle: string;
  doneLead: string;
  signIn: string;
  signInHref: string;
};

export function SetNewPasswordForm({
  locale,
  token,
  labels,
}: {
  locale: Locale;
  token: string;
  labels: SetLabels;
}) {
  const [state, action] = useActionState(resetPassword, emptyAccountState);

  if (state.ok) {
    return (
      <div className="space-y-5">
        <div className="flex items-start gap-3 rounded-lg border border-sage-400/30 bg-sage-400/10 px-4 py-3.5">
          <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-sage-400" />
          <div>
            <p className="text-sm font-semibold text-sage-400">
              {labels.doneTitle}
            </p>
            <p className="mt-1 text-sm text-paper-dim">{labels.doneLead}</p>
          </div>
        </div>
        <a href={labels.signInHref} className="btn btn-primary w-full">
          {labels.signIn}
        </a>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="token" value={token} />

      {state.error ? (
        <p
          role="alert"
          className="rounded-lg border border-rose-400/30 bg-rose-400/10 px-3.5 py-2.5 text-sm text-rose-400"
        >
          {state.error}
        </p>
      ) : null}

      <div>
        <label htmlFor="password" className="field-label">
          {labels.password}
        </label>
        <input
          id="password"
          name="password"
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

      <SubmitButton className="btn btn-primary w-full" pendingLabel={labels.pending}>
        {labels.submit}
      </SubmitButton>
    </form>
  );
}
