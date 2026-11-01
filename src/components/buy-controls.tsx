import Link from "next/link";

import { addToCart, buyNow } from "@/actions/cart";
import { CartIcon, CheckIcon, DownloadIcon } from "@/components/icons";
import { SubmitButton } from "@/components/submit-button";
import { getDictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { routes } from "@/lib/routes";

/**
 * The buy area, in four states: owned, in the cart, buyable, or nothing to
 * sell yet. Plain server-action forms, so it works before JavaScript loads.
 */
export function BuyControls({
  bookId,
  locale,
  owned,
  inCart,
  hasFiles,
  size = "lg",
}: {
  bookId: string;
  locale: Locale;
  owned: boolean;
  inCart: boolean;
  hasFiles: boolean;
  size?: "lg" | "sm";
}) {
  const t = getDictionary(locale);
  const sizeClass = size === "lg" ? "btn-lg" : "";

  if (owned) {
    return (
      <Link
        href={routes.library(locale)}
        className={`btn btn-secondary ${sizeClass}`}
      >
        <DownloadIcon className="h-4 w-4" />
        {t.book.goToLibrary}
      </Link>
    );
  }

  if (!hasFiles) {
    return (
      <p className="text-sm text-mute">{t.book.noFiles}</p>
    );
  }

  if (inCart) {
    return (
      <div className="flex flex-wrap items-center gap-2.5">
        <Link
          href={routes.cart(locale)}
          className={`btn btn-primary ${sizeClass}`}
        >
          <CheckIcon className="h-4 w-4" />
          {t.book.inCart}
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <form action={buyNow}>
        <input type="hidden" name="bookId" value={bookId} />
        <input type="hidden" name="locale" value={locale} />
        <SubmitButton className={`btn btn-primary ${sizeClass}`}>
          {t.book.buyNow}
        </SubmitButton>
      </form>

      <form action={addToCart}>
        <input type="hidden" name="bookId" value={bookId} />
        <input type="hidden" name="locale" value={locale} />
        <SubmitButton className={`btn btn-secondary ${sizeClass}`}>
          <CartIcon className="h-4 w-4" />
          {t.book.addToCart}
        </SubmitButton>
      </form>
    </div>
  );
}
