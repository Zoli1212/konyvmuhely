"use server";

import { AuthError } from "next-auth";
import { z } from "zod";

import { defaultLocale, isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { MIN_PASSWORD_LENGTH, hashPassword, signIn, signOut } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { routes } from "@/lib/routes";
import type { AuthFormState } from "./form-state";

function localeFrom(formData: FormData): Locale {
  const raw = formData.get("locale");
  return isLocale(typeof raw === "string" ? raw : undefined)
    ? (raw as Locale)
    : defaultLocale;
}

/** Where to land after a successful sign-in. Internal paths only. */
function safeNext(formData: FormData, locale: Locale): string {
  const raw = formData.get("next");
  if (typeof raw === "string" && raw.startsWith("/") && !raw.startsWith("//")) {
    return raw;
  }
  return routes.library(locale);
}

const signInSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1),
});

export async function signInWithPassword(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const locale = localeFrom(formData);
  const t = getDictionary(locale);

  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: t.errors.invalidCredentials };
  }

  // Tell someone with a Google-only account what is actually wrong, instead of
  // letting them retype a password they never set.
  const existing = await prisma.user.findUnique({
    where: { email: parsed.data.email },
    select: { passwordHash: true },
  });

  if (existing && !existing.passwordHash) {
    return { error: t.auth.passwordOnlyGoogle };
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: safeNext(formData, locale),
    });
  } catch (error) {
    // signIn signals success by throwing a redirect; only AuthError is a failure.
    if (error instanceof AuthError) {
      return { error: t.errors.invalidCredentials };
    }
    throw error;
  }

  return { error: null };
}

const registerSchema = z
  .object({
    name: z.string().trim().min(1),
    email: z.string().trim().toLowerCase().email(),
    password: z.string().min(MIN_PASSWORD_LENGTH),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    path: ["passwordConfirm"],
  });

export async function registerWithPassword(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const locale = localeFrom(formData);
  const t = getDictionary(locale);

  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    passwordConfirm: formData.get("passwordConfirm"),
  };

  const parsed = registerSchema.safeParse(raw);

  if (!parsed.success) {
    // One message per field, most actionable first.
    const issues = parsed.error.issues;
    const field = issues[0]?.path[0];

    if (field === "name") return { error: t.errors.nameRequired };
    if (field === "email") return { error: t.errors.invalidEmail };
    if (field === "password") return { error: t.errors.passwordTooShort };
    return { error: t.errors.passwordMismatch };
  }

  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({
    where: { email },
    select: { id: true, passwordHash: true },
  });

  if (existing) {
    return {
      error: existing.passwordHash
        ? t.errors.emailTaken
        : t.auth.passwordOnlyGoogle,
    };
  }

  await prisma.user.create({
    data: {
      name,
      email,
      passwordHash: await hashPassword(password),
      locale,
    },
  });

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: safeNext(formData, locale),
    });
  } catch (error) {
    if (error instanceof AuthError) {
      // The account exists; let them sign in by hand rather than lose it.
      return { error: t.errors.generic };
    }
    throw error;
  }

  return { error: null };
}

export async function signInWithGoogle(formData: FormData): Promise<void> {
  const locale = localeFrom(formData);
  await signIn("google", { redirectTo: safeNext(formData, locale) });
}

export async function signOutAction(formData: FormData): Promise<void> {
  const locale = localeFrom(formData);
  await signOut({ redirectTo: routes.home(locale) });
}
