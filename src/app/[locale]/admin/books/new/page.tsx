import Link from "next/link";

import { BookForm } from "@/components/admin/book-form";
import { buildBookFormLabels } from "@/components/admin/book-form-labels";
import { ArrowLeftIcon } from "@/components/icons";
import { resolvePage } from "@/lib/page-locale";
import { routes } from "@/lib/routes";
import { storageDriver } from "@/lib/storage";

export default async function NewBookPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale, t } = await resolvePage(params);

  return (
    <div className="max-w-4xl">
      <Link
        href={routes.adminBooks(locale)}
        className="inline-flex items-center gap-1.5 text-sm text-mute transition-colors hover:text-gold-300"
      >
        <ArrowLeftIcon className="h-3.5 w-3.5" />
        {t.admin.books}
      </Link>

      <h2 className="mt-5 font-display text-2xl font-semibold text-paper">
        {t.admin.newBook}
      </h2>

      <div className="mt-8">
        <BookForm
          mode="create"
          locale={locale}
          driver={storageDriver()}
          labels={buildBookFormLabels(t, "create")}
          initial={null}
        />
      </div>
    </div>
  );
}
