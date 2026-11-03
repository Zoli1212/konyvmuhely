/**
 * Shared useActionState shapes.
 *
 * These live outside the "use server" modules on purpose: a server-action file
 * may only export async functions, so the initial-state constants cannot sit
 * next to the actions that return them.
 */

export type AuthFormState = { error: string | null };

export const emptyAuthState: AuthFormState = { error: null };

export type BookFormState = { error: string | null; ok?: boolean };

export const emptyBookFormState: BookFormState = { error: null };

export type AccountFormState = { error: string | null; ok: boolean };

export const emptyAccountState: AccountFormState = { error: null, ok: false };

/**
 * The checkout form keeps what the buyer typed alongside the errors, so a
 * rejected form renders back filled in. Retyping an address because of one
 * wrong digit is how people abandon a purchase.
 */
export type CheckoutFormState = {
  errors: Partial<
    Record<"name" | "zip" | "city" | "address" | "taxId" | "consent", string>
  >;
  values: {
    name: string;
    zip: string;
    city: string;
    address: string;
    taxId: string | null;
  } | null;
  /** Stripe refused the session; distinct from a field the buyer can fix. */
  failed: boolean;
};

export const emptyCheckoutState: CheckoutFormState = {
  errors: {},
  values: null,
  failed: false,
};
