"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { LOCALE_COOKIE, defaultLocale, isLocale } from "@/i18n/config";
import { currentUser } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { switchLocalePath } from "@/lib/routes";

/**
 * Switches language and stays on the same page. The choice is remembered in a
 * cookie for visitors, and on the user record for signed-in buyers so it
 * follows them to another device.
 */
export async function setLocale(formData: FormData): Promise<void> {
  const raw = formData.get("locale");
  const target = isLocale(typeof raw === "string" ? raw : undefined)
    ? (raw as "hu" | "en")
    : defaultLocale;

  const fromRaw = formData.get("from");
  const from = isLocale(typeof fromRaw === "string" ? fromRaw : undefined)
    ? (fromRaw as "hu" | "en")
    : defaultLocale;

  const pathRaw = formData.get("pathname");
  const pathname =
    typeof pathRaw === "string" && pathRaw.startsWith("/") && !pathRaw.startsWith("//")
      ? pathRaw
      : `/${from}`;

  const store = await cookies();
  store.set(LOCALE_COOKIE, target, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });

  const user = await currentUser();
  if (user) {
    await prisma.user.update({
      where: { id: user.id },
      data: { locale: target },
    });
  }

  redirect(switchLocalePath(pathname, from, target));
}
