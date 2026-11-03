"use client";

import { useActionState } from "react";

import { submitCheckout } from "@/actions/checkout";
import { emptyCheckoutState } from "@/actions/form-state";
import { ArrowRightIcon, WarningIcon } from "@/components/icons";
import { SubmitButton } from "@/components/submit-button";
import type { Locale } from "@/i18n/config";

/**
 * Billing details and the withdrawal waiver, in one form.
 *
 * Labels arrive as flat strings rather than a dictionary object, because a
 * dictionary holds functions and functions cannot cross the server/client
 * boundary.
 */
export type CheckoutLabels = {
  billingHeading: string;
  billingLead: string;
  name: string;
  namePlaceholder: string;
  zip: string;
  city: string;
  address: string;
  addressPlaceholder: string;
  country: string;
  countryNote: string;
  taxId: string;
  taxIdHint: string;
  optional: string;
  consentHeading: string;
  consentLabel: string;
  consentNote: string;
  submit: string;
  pending: string;
  failed: string;
  errorName: string;
  errorZip: string;
  errorCity: string;
  errorAddress: string;
  errorTaxId: string;
  errorConsent: string;
};

export type CheckoutDefaults = {
  name: string;
  zip: string;
  city: string;
  address: string;
  taxId: string;
};

export function CheckoutForm({
  locale,
  labels,
  defaults,
  termsHref,
}: {
  locale: Locale;
  labels: CheckoutLabels;
  defaults: CheckoutDefaults;
  termsHref: string;
}) {
  const [state, formAction] = useActionState(submitCheckout, emptyCheckoutState);

  // What the buyer last typed wins over the remembered profile, so a rejected
  // form comes back as they left it.
  const value = (field: keyof CheckoutDefaults): string =>
    state.values?.[field] ?? defaults[field] ?? "";

  const message: Partial<Record<string, string>> = {
    name: labels.errorName,
    zip: labels.errorZip,
    city: labels.errorCity,
    address: labels.errorAddress,
    taxId: labels.errorTaxId,
    consent: labels.errorConsent,
  };

  const field = (name: keyof CheckoutDefaults) => ({
    name,
    id: `billing-${name}`,
    defaultValue: value(name),
    "aria-invalid": state.errors[name] ? true : undefined,
    "aria-describedby": state.errors[name] ? `error-${name}` : undefined,
    className: `field ${state.errors[name] ? "field-invalid" : ""}`.trim(),
  });

  const Error = ({ name }: { name: string }) =>
    state.errors[name as keyof typeof state.errors] ? (
      <p id={`error-${name}`} className="field-error">
        {message[name]}
      </p>
    ) : null;

  return (
    <form action={formAction} noValidate>
      <input type="hidden" name="locale" value={locale} />

      <h2 className="font-display text-xl font-semibold text-paper">
        {labels.billingHeading}
      </h2>
      <p className="mt-1.5 text-sm text-paper-dim">{labels.billingLead}</p>

      <div className="mt-6 grid gap-5">
        <div>
          <label htmlFor="billing-name" className="field-label">
            {labels.name}
          </label>
          <input
            {...field("name")}
            type="text"
            autoComplete="name"
            placeholder={labels.namePlaceholder}
            required
          />
          <Error name="name" />
        </div>

        <div className="grid gap-5 @sm:grid-cols-[8rem_1fr]">
          <div>
            <label htmlFor="billing-zip" className="field-label">
              {labels.zip}
            </label>
            <input
              {...field("zip")}
              type="text"
              inputMode="numeric"
              autoComplete="postal-code"
              maxLength={4}
              placeholder="1011"
              required
            />
            <Error name="zip" />
          </div>

          <div>
            <label htmlFor="billing-city" className="field-label">
              {labels.city}
            </label>
            <input
              {...field("city")}
              type="text"
              autoComplete="address-level2"
              placeholder="Budapest"
              required
            />
            <Error name="city" />
          </div>
        </div>

        <div>
          <label htmlFor="billing-address" className="field-label">
            {labels.address}
          </label>
          <input
            {...field("address")}
            type="text"
            autoComplete="street-address"
            placeholder={labels.addressPlaceholder}
            required
          />
          <Error name="address" />
        </div>

        <div>
          <span className="field-label">{labels.country}</span>
          {/* Not a field. The shop sells to Hungary only, so there is nothing
              to choose and a disabled dropdown would only invite the attempt. */}
          <p className="field flex items-center justify-between text-paper-dim">
            Magyarország
            <span className="text-xs text-mute">{labels.countryNote}</span>
          </p>
        </div>

        <div>
          <label htmlFor="billing-taxId" className="field-label">
            {labels.taxId}{" "}
            <span className="font-normal text-mute">({labels.optional})</span>
          </label>
          <input
            {...field("taxId")}
            type="text"
            placeholder="12345678-2-13"
            autoComplete="off"
          />
          <p className="field-hint">{labels.taxIdHint}</p>
          <Error name="taxId" />
        </div>
      </div>

      <h2 className="mt-10 font-display text-xl font-semibold text-paper">
        {labels.consentHeading}
      </h2>

      <label
        htmlFor="withdrawalConsent"
        className={`panel mt-4 flex cursor-pointer items-start gap-3.5 px-5 py-4 transition-colors ${
          state.errors.consent ? "border-rose-500/50" : "hover:border-ink-700"
        }`}
      >
        <input
          type="checkbox"
          id="withdrawalConsent"
          name="withdrawalConsent"
          className="checkbox mt-0.5 shrink-0"
          aria-describedby="consent-note"
        />
        <span className="text-sm leading-relaxed text-paper-dim">
          {labels.consentLabel}{" "}
          <a
            href={termsHref}
            target="_blank"
            rel="noreferrer"
            className="text-gold-300 underline underline-offset-2 hover:text-gold-200"
          >
            {labels.consentNote}
          </a>
        </span>
      </label>
      <span id="consent-note" className="sr-only">
        {labels.consentLabel}
      </span>
      <Error name="consent" />

      {state.failed ? (
        <div className="panel mt-6 flex items-start gap-3 border-rose-500/40 bg-rose-500/5 px-5 py-4">
          <WarningIcon className="mt-0.5 h-4 w-4 shrink-0 text-rose-300" />
          <p className="text-sm text-paper-dim">{labels.failed}</p>
        </div>
      ) : null}

      <SubmitButton
        className="btn btn-primary btn-lg mt-8 w-full"
        pendingLabel={labels.pending}
      >
        {labels.submit}
        <ArrowRightIcon className="h-4 w-4" />
      </SubmitButton>
    </form>
  );
}
