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
