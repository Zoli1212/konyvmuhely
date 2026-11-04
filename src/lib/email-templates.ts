import { localeTags, type Locale } from "@/i18n/config";
import {
  emailBookRow,
  emailButton,
  emailHeading,
  emailLayout,
  emailParagraph,
  escapeHtml,
} from "./email";
import { env, siteUrl } from "./env";
import { formatMoney } from "./money";

/**
 * Every template returns subject, html and text. The plain-text part is not a
 * formality: some clients show it, spam filters read it, and a download link
 * that only exists inside HTML is a download link some buyers cannot reach.
 */

export type RenderedEmail = { subject: string; html: string; text: string };

type PurchasedBook = {
  title: string;
  author: string;
  files: { id: string; format: string; fileLocale: "HU" | "EN" }[];
};

const copy = {
  hu: {
    purchaseSubject: (store: string) => `${store} – a megrendelésed`,
    purchaseHeading: "Köszönjük a vásárlást!",
    purchaseLead:
      "A megvásárolt kötetek azonnal letölthetők az alábbi gombokkal, és bármikor újra a könyvtáradból.",
    orderRef: "Megrendelés",
    total: "Fizetett összeg",
    invoiceAttached: "A számlát mellékeltük ehhez a levélhez.",
    invoiceNumber: "Számla sorszáma",
    toLibrary: "A könyvtáram",
    linkNote:
      "A letöltési linkek bejelentkezést kérnek – ugyanazzal a fiókkal, amellyel vásároltál.",
    footer:
      "Ezt a levelet a vásárlásod miatt kaptad. A fájlok DRM-mentesek, bármelyik olvasódon megnyithatók.",
    edition: { HU: "magyar", EN: "angol" },

    resetSubject: (store: string) => `${store} – jelszó helyreállítása`,
    resetHeading: "Új jelszó beállítása",
    resetLead:
      "Jelszó-helyreállítást kértél. A lenti gombbal állíthatsz be újat.",
    resetButton: "Új jelszó beállítása",
    resetExpiry: (hours: number) =>
      `A link ${hours} óráig érvényes, és csak egyszer használható.`,
    resetIgnore:
      "Ha nem te kérted, nyugodtan hagyd figyelmen kívül ezt a levelet – a jelszavad változatlan marad.",

    verifySubject: (store: string) => `${store} – e-mail-cím megerősítése`,
    verifyHeading: "Erősítsd meg az e-mail-címed",
    verifyLead:
      "Kattints a gombra, és megerősítjük, hogy ez a cím valóban a tiéd. A megvásárolt könyveidről erre a címre küldünk értesítést.",
    verifyButton: "E-mail-cím megerősítése",
    verifyExpiry: (hours: number) => `A link ${hours} óráig érvényes.`,

    saleSubject: (store: string, amount: string) =>
      `${store} – új eladás, ${amount}`,
    saleHeading: "Új vásárlás",
    saleBuyer: "Vásárló",
    saleItems: "Tételek",
    saleInvoice: "Számla",
    saleInvoicePending: "még nem készült el",
    saleInvoiceFailed: "NEM SIKERÜLT KIÁLLÍTANI",
    saleFailedSubject: (store: string, amount: string) =>
      `${store} – eladás ${amount}, DE A SZÁMLA NEM KÉSZÜLT EL`,
    saleFailedWarning:
      "A vásárlás rendben lezajlott és a vevő megkapta a könyvet, de a számla kiállítása elakadt. Ezt pótolni kell: nyisd meg a megrendeléseket, és nyomd meg a Számla újra gombot.",
    saleFailedReason: "A számlázó ezt válaszolta",
  },

  en: {
    purchaseSubject: (store: string) => `${store} – your order`,
    purchaseHeading: "Thank you for your purchase",
    purchaseLead:
      "Your titles are ready to download with the buttons below, and any time from your library.",
    orderRef: "Order",
    total: "Amount paid",
    invoiceAttached: "The invoice is attached to this email.",
    invoiceNumber: "Invoice number",
    toLibrary: "My library",
    linkNote:
      "The download links ask you to sign in with the same account you bought with.",
    footer:
      "You received this email because of your purchase. The files are DRM-free and open in any reader.",
    edition: { HU: "Hungarian", EN: "English" },

    resetSubject: (store: string) => `${store} – password reset`,
    resetHeading: "Set a new password",
    resetLead: "You asked to reset your password. Use the button below to set a new one.",
    resetButton: "Set a new password",
    resetExpiry: (hours: number) =>
      `The link is valid for ${hours} hours and can be used once.`,
    resetIgnore:
      "If this was not you, ignore this email - your password stays as it is.",

    verifySubject: (store: string) => `${store} – confirm your email address`,
    verifyHeading: "Confirm your email address",
    verifyLead:
      "Click the button to confirm this address belongs to you. We send notices about the books you buy to this address.",
    verifyButton: "Confirm email address",
    verifyExpiry: (hours: number) => `The link is valid for ${hours} hours.`,

    saleSubject: (store: string, amount: string) => `${store} – new sale, ${amount}`,
    saleHeading: "New purchase",
    saleBuyer: "Buyer",
    saleItems: "Items",
    saleInvoice: "Invoice",
    saleInvoicePending: "not issued yet",
    saleInvoiceFailed: "COULD NOT BE ISSUED",
    saleFailedSubject: (store: string, amount: string) =>
      `${store} – sale ${amount}, BUT THE INVOICE FAILED`,
    saleFailedWarning:
      "The purchase went through and the buyer has their book, but issuing the invoice failed. This needs sorting: open the orders and press Retry invoice.",
    saleFailedReason: "The invoicing service replied",
  },
} satisfies Record<Locale, Record<string, unknown>>;

export function purchaseConfirmationEmail(options: {
  locale: Locale;
  orderId: string;
  amountMinor: number;
  currency: string;
  books: PurchasedBook[];
  invoiceNumber: string | null;
  invoiceAttached: boolean;
}): RenderedEmail {
  const t = copy[options.locale];
  const base = siteUrl();
  const amount = formatMoney(options.amountMinor, options.currency, options.locale);

  const rows = options.books
    .map((book) =>
      emailBookRow({
        title: book.title,
        author: book.author,
        links: book.files.map((file) => ({
          label: `${t.edition[file.fileLocale]} ${file.format}`,
          url: `${base}/api/download/${file.id}`,
        })),
      }),
    )
    .join("");

  const body = [
    emailHeading(t.purchaseHeading),
    emailParagraph(t.purchaseLead),
    rows,
    emailParagraph(t.linkNote),
    emailButton(t.toLibrary, `${base}/${options.locale}/library`),
    `<p style="margin:18px 0 0 0;font-size:13px;color:#8b8796;">
       ${escapeHtml(t.orderRef)}: ${escapeHtml(options.orderId)}<br>
       ${escapeHtml(t.total)}: ${escapeHtml(amount)}
       ${options.invoiceNumber ? `<br>${escapeHtml(t.invoiceNumber)}: ${escapeHtml(options.invoiceNumber)}` : ""}
       ${options.invoiceAttached ? `<br>${escapeHtml(t.invoiceAttached)}` : ""}
     </p>`,
  ].join("");

  const textLines = [
    t.purchaseHeading,
    "",
    t.purchaseLead,
    "",
    ...options.books.flatMap((book) => [
      `${book.title} — ${book.author}`,
      ...book.files.map(
        (file) =>
          `  ${t.edition[file.fileLocale]} ${file.format}: ${base}/api/download/${file.id}`,
      ),
      "",
    ]),
    t.linkNote,
    "",
    `${t.orderRef}: ${options.orderId}`,
    `${t.total}: ${amount}`,
    options.invoiceNumber ? `${t.invoiceNumber}: ${options.invoiceNumber}` : "",
    options.invoiceAttached ? t.invoiceAttached : "",
  ];

  return {
    subject: t.purchaseSubject(env.storeName),
    html: emailLayout({
      title: t.purchaseSubject(env.storeName),
      preheader: t.purchaseLead,
      body,
      footerNote: t.footer,
    }),
    text: textLines.filter((line) => line !== undefined).join("\n"),
  };
}

export function passwordResetEmail(options: {
  locale: Locale;
  url: string;
  expiryHours: number;
}): RenderedEmail {
  const t = copy[options.locale];

  const body = [
    emailHeading(t.resetHeading),
    emailParagraph(t.resetLead),
    emailButton(t.resetButton, options.url),
    emailParagraph(t.resetExpiry(options.expiryHours)),
    emailParagraph(t.resetIgnore),
  ].join("");

  return {
    subject: t.resetSubject(env.storeName),
    html: emailLayout({
      title: t.resetSubject(env.storeName),
      preheader: t.resetLead,
      body,
      footerNote: t.resetIgnore,
    }),
    text: [
      t.resetHeading,
      "",
      t.resetLead,
      "",
      options.url,
      "",
      t.resetExpiry(options.expiryHours),
      t.resetIgnore,
    ].join("\n"),
  };
}

export function emailVerificationEmail(options: {
  locale: Locale;
  url: string;
  expiryHours: number;
}): RenderedEmail {
  const t = copy[options.locale];

  const body = [
    emailHeading(t.verifyHeading),
    emailParagraph(t.verifyLead),
    emailButton(t.verifyButton, options.url),
    emailParagraph(t.verifyExpiry(options.expiryHours)),
  ].join("");

  return {
    subject: t.verifySubject(env.storeName),
    html: emailLayout({
      title: t.verifySubject(env.storeName),
      preheader: t.verifyLead,
      body,
      footerNote: t.verifyExpiry(options.expiryHours),
    }),
    text: [
      t.verifyHeading,
      "",
      t.verifyLead,
      "",
      options.url,
      "",
      t.verifyExpiry(options.expiryHours),
    ].join("\n"),
  };
}

/** Notice to the shop owner. Always in Hungarian - there is one recipient. */
export function saleNotificationEmail(options: {
  orderId: string;
  buyerName: string;
  buyerEmail: string;
  amountMinor: number;
  currency: string;
  titles: string[];
  invoiceNumber: string | null;
  /** When the invoice failed, what the invoicing service said. */
  invoiceError?: string | null;
}): RenderedEmail {
  // A failed invoice is a tax problem, not a detail. Until now it read the
  // same as "still being prepared", so the one notice that could catch it
  // said nothing - including in the subject line, which is all that shows
  // in an inbox list.
  const failed = Boolean(options.invoiceError);
  const t = copy.hu;
  const base = siteUrl();
  const amount = formatMoney(options.amountMinor, options.currency, "hu");
  const when = new Intl.DateTimeFormat(localeTags.hu, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date());

  const body = [
    emailHeading(t.saleHeading),
    `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:6px 0 18px 0;font-size:14px;">
       <tr><td style="padding:4px 16px 4px 0;color:#8b8796;">${escapeHtml(t.total)}</td><td style="font-weight:600;">${escapeHtml(amount)}</td></tr>
       <tr><td style="padding:4px 16px 4px 0;color:#8b8796;">${escapeHtml(t.saleBuyer)}</td><td>${escapeHtml(options.buyerName)} &lt;${escapeHtml(options.buyerEmail)}&gt;</td></tr>
       <tr><td style="padding:4px 16px 4px 0;color:#8b8796;">${escapeHtml(t.saleItems)}</td><td>${escapeHtml(options.titles.join(", "))}</td></tr>
       <tr><td style="padding:4px 16px 4px 0;color:#8b8796;">${escapeHtml(t.saleInvoice)}</td><td${failed ? ' style="color:#c2410c;font-weight:600;"' : ""}>${escapeHtml(options.invoiceNumber ?? (failed ? t.saleInvoiceFailed : t.saleInvoicePending))}</td></tr>
       <tr><td style="padding:4px 16px 4px 0;color:#8b8796;">${escapeHtml(t.orderRef)}</td><td style="font-family:monospace;font-size:12px;">${escapeHtml(options.orderId)}</td></tr>
     </table>`,
    failed
      ? `<div style="margin:0 0 18px 0;padding:14px 16px;border:1px solid #c2410c;border-radius:8px;background:#fff7ed;">
           <p style="margin:0 0 8px 0;font-size:14px;line-height:1.5;color:#7c2d12;">${escapeHtml(t.saleFailedWarning)}</p>
           <p style="margin:0;font-size:12px;line-height:1.5;color:#9a3412;"><strong>${escapeHtml(t.saleFailedReason)}:</strong> ${escapeHtml(options.invoiceError ?? "")}</p>
         </div>`
      : "",
    emailButton("Megrendelések", `${base}/hu/admin/orders`),
  ].join("");

  return {
    subject: failed
      ? t.saleFailedSubject(env.storeName, amount)
      : t.saleSubject(env.storeName, amount),
    html: emailLayout({
      title: t.saleSubject(env.storeName, amount),
      preheader: `${options.titles.join(", ")} — ${amount}`,
      body,
      footerNote: when,
    }),
    text: [
      t.saleHeading,
      `${t.total}: ${amount}`,
      `${t.saleBuyer}: ${options.buyerName} <${options.buyerEmail}>`,
      `${t.saleItems}: ${options.titles.join(", ")}`,
      `${t.saleInvoice}: ${
        options.invoiceNumber ??
        (failed ? t.saleInvoiceFailed : t.saleInvoicePending)
      }`,
      `${t.orderRef}: ${options.orderId}`,
      ...(failed
        ? ["", t.saleFailedWarning, `${t.saleFailedReason}: ${options.invoiceError}`]
        : []),
    ].join("\n"),
  };
}
