import { redirect } from "next/navigation";

import type { Locale } from "@/i18n/config";
import { auth } from "./auth";
import { localePath } from "./routes";

export type SessionUser = {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  role: "USER" | "ADMIN";
};

/** The signed-in user, or null. Safe to call from any server component. */
export async function currentUser(): Promise<SessionUser | null> {
  const session = await auth();
  if (!session?.user?.id || !session.user.email) return null;

  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name ?? null,
    image: session.user.image ?? null,
    role: session.user.role === "ADMIN" ? "ADMIN" : "USER",
  };
}

/**
 * Requires a signed-in user, sending visitors to the localised sign-in page
 * with a callback back to where they were heading.
 */
export async function requireUser(
  locale: Locale,
  callbackPath?: string,
): Promise<SessionUser> {
  const user = await currentUser();
  if (user) return user;

  const target = localePath(locale, "/login");
  redirect(
    callbackPath ? `${target}?next=${encodeURIComponent(callbackPath)}` : target,
  );
}

/**
 * Requires an admin. Visitors are sent to sign in; a signed-in non-admin gets
 * null back so the caller can render a proper "no permission" page instead of
 * pretending the route does not exist.
 */
export async function requireAdmin(
  locale: Locale,
  callbackPath = "/admin",
): Promise<SessionUser | null> {
  const user = await requireUser(locale, callbackPath);
  return user.role === "ADMIN" ? user : null;
}

/** For route handlers and server actions, where redirecting is wrong. */
export async function assertAdmin(): Promise<SessionUser> {
  const user = await currentUser();
  if (!user) throw new Error("UNAUTHENTICATED");
  if (user.role !== "ADMIN") throw new Error("FORBIDDEN");
  return user;
}
