import Link from "next/link";

import { WarningIcon } from "@/components/icons";
import { requireAdmin } from "@/lib/auth-guard";
import { resolvePage } from "@/lib/page-locale";
import { routes } from "@/lib/routes";
import { stripeEnabled } from "@/lib/env";
import { storageDriver } from "@/lib/storage";

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale, t } = await resolvePage(params);
  const admin = await requireAdmin(locale);

  if (!admin) {
    return (
      <div className="shell py-28 text-center">
        <h1 className="font-display text-3xl font-semibold text-paper">
          {t.errors.unauthorized}
        </h1>
        <Link href={routes.home(locale)} className="btn btn-secondary mt-8">
          {t.common.back}
        </Link>
      </div>
    );
  }

  return (
    <div className="shell py-10">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-semibold text-paper sm:text-3xl">
          {t.admin.title}
        </h1>
        <Link href={routes.adminNewBook(locale)} className="btn btn-primary">
          {t.admin.newBook}
        </Link>
      </header>

      <nav className="mt-6 flex gap-1 border-b border-ink-800">
        <AdminTab href={routes.admin(locale)}>{t.admin.overview}</AdminTab>
        <AdminTab href={routes.adminBooks(locale)}>{t.admin.books}</AdminTab>
        <AdminTab href={routes.adminOrders(locale)}>{t.admin.orders}</AdminTab>
      </nav>

      <div className="mt-6 space-y-4">
        {storageDriver() === "local" ? (
          <Notice
            title={t.admin.warnings.localStorageTitle}
            text={t.admin.warnings.localStorageText}
          />
        ) : null}

        {!stripeEnabled() ? (
          <Notice
            title={t.admin.warnings.stripeMissingTitle}
            text={t.admin.warnings.stripeMissingText}
          />
        ) : null}
      </div>

      <div className="mt-8">{children}</div>
    </div>
  );
}

function AdminTab({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="-mb-px border-b-2 border-transparent px-3.5 py-2.5 text-sm font-medium text-paper-dim transition-colors hover:border-ink-600 hover:text-paper"
    >
      {children}
    </Link>
  );
}

function Notice({ title, text }: { title: string; text: string }) {
  return (
    <div className="panel flex items-start gap-3 border-gold-600/35 bg-gold-500/5 px-5 py-4">
      <WarningIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
      <div>
        <p className="text-sm font-semibold text-gold-200">{title}</p>
        <p className="mt-1 text-sm leading-relaxed text-paper-dim">{text}</p>
      </div>
    </div>
  );
}
