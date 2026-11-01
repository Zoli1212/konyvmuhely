"use client";

import { useActionState } from "react";

import { registerWithPassword, signInWithPassword } from "@/actions/auth";
import { emptyAuthState } from "@/actions/form-state";
import { SubmitButton } from "@/components/submit-button";
import type { Locale } from "@/i18n/config";

/**
 * The two password forms. They are client components only so that
 * useActionState can show the server's error message in place, without a
 * round trip through the query string.
 *
 * Labels arrive as a flat object of plain strings rather than as the whole
 * dictionary: the dictionary holds functions for interpolated copy, and
 * functions cannot cross the server/client boundary.
 */

export type SignInLabels = {
  email: string;
  password: string;
  submit: string;
  pending: string;
};

export type SignUpLabels = SignInLabels & {
  name: string;
  passwordConfirm: string;
  passwordHint: string;
};

function ErrorNote({ message }: { message: string | null }) {
  if (!message) return null;

  return (
    <p
      role="alert"
      className="rounded-lg border border-rose-400/30 bg-rose-400/10 px-3.5 py-2.5 text-sm text-rose-400"
    >
      {message}
    </p>
  );
}

export function SignInForm({
  locale,
  next,
  labels,
  initialError = null,
}: {
  locale: Locale;
  next?: string;
  labels: SignInLabels;
  initialError?: string | null;
}) {
  const [state, action] = useActionState(signInWithPassword, {
    error: initialError,
  });

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="locale" value={locale} />
      {next ? <input type="hidden" name="next" value={next} /> : null}

      <ErrorNote message={state.error} />

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

      <div>
        <label htmlFor="password" className="field-label">
          {labels.password}
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="field"
        />
      </div>

      <SubmitButton
        className="btn btn-primary w-full"
        pendingLabel={labels.pending}
      >
        {labels.submit}
      </SubmitButton>
    </form>
  );
}

export function SignUpForm({
  locale,
  next,
  labels,
}: {
  locale: Locale;
  next?: string;
  labels: SignUpLabels;
}) {
  const [state, action] = useActionState(registerWithPassword, emptyAuthState);

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="locale" value={locale} />
      {next ? <input type="hidden" name="next" value={next} /> : null}

      <ErrorNote message={state.error} />

      <div>
        <label htmlFor="name" className="field-label">
          {labels.name}
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required
          className="field"
        />
      </div>

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
        <p className="field-hint">{labels.passwordHint}</p>
      </div>

      <div>
        <label htmlFor="passwordConfirm" className="field-label">
          {labels.passwordConfirm}
        </label>
        <input
          id="passwordConfirm"
          name="passwordConfirm"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          className="field"
        />
      </div>

      <SubmitButton
        className="btn btn-primary w-full"
        pendingLabel={labels.pending}
      >
        {labels.submit}
      </SubmitButton>
    </form>
  );
}
