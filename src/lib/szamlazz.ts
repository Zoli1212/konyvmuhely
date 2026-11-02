import { splitGross, storeVatRate, sumSplits, vatCode } from "./vat";

/**
 * Számla Agent client for Számlázz.hu.
 *
 * This is the piece that makes the shop legal in Hungary. Stripe's own
 * invoicing is not submitted to NAV Online Számla and is not accepted as a
 * Hungarian invoice, so the invoice has to be issued here, by a provider that
 * reports it.
 *
 * The request is a multipart POST carrying one XML file. The XSD uses
 * `xs:sequence`, so **element order is part of the contract** - the order
 * below is taken from the published schema and must not be rearranged.
 */

const AGENT_URL = "https://www.szamlazz.hu/szamla/";
const XML_FIELD = "action-xmlagentxmlfile";

export type InvoiceLine = {
  name: string;
  /** Gross amount for the line, in minor units. */
  grossMinor: number;
};

export type InvoiceBuyer = {
  name: string;
  zip: string;
  city: string;
  address: string;
  country?: string | null;
  email?: string | null;
  taxNumber?: string | null;
};

export type IssueInvoiceInput = {
  /** Our order id. Doubles as the external id, which is the duplicate guard. */
  externalId: string;
  orderNumber: string;
  buyer: InvoiceBuyer;
  lines: InvoiceLine[];
  currency: string;
  /** "hu" or "en" - controls the language of the invoice itself. */
  language: "hu" | "en";
  /** Human-readable payment method shown on the invoice. */
  paymentMethod?: string;
  comment?: string;
  /**
   * Whether Számlázz.hu should email the invoice to the buyer. We send our own
   * purchase confirmation with the PDF attached, so this defaults to false to
   * avoid the customer getting two mails about one purchase.
   */
  sendEmail?: boolean;
};

export type IssueInvoiceResult =
  | {
      ok: true;
      invoiceNumber: string;
      netMinor: number;
      vatMinor: number;
      grossMinor: number;
      vatRate: number;
      pdf: Buffer | null;
    }
  | { ok: false; errorCode: string | null; error: string };

export function szamlazzConfigured(): boolean {
  return Boolean(process.env.SZAMLAZZ_AGENT_KEY);
}

// --- XML helpers ---

function esc(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return "";
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Emits an element only when there is something to say. */
function opt(tag: string, value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === "") return "";
  return `<${tag}>${esc(value)}</${tag}>`;
}

/** Számlázz.hu expects decimal amounts in the major unit. */
function amount(minor: number, minorPerMajor: number): string {
  return (minor / minorPerMajor).toFixed(2);
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function buildInvoiceXml(
  input: IssueInvoiceInput,
  minorPerMajor: number,
): { xml: string; totals: ReturnType<typeof sumSplits> } {
  const rate = storeVatRate();
  // Not the percentage: an exempt seller sends the literal code `AAM`, which
  // is what makes Számlázz.hu print the exemption reference the law requires.
  // Sending `0` instead would read as a zero-rated taxable supply, which is a
  // different thing and not lawful here.
  const code = vatCode();
  const splits = input.lines.map((line) => splitGross(line.grossMinor, rate));
  const totals = sumSplits(splits, rate);
  const date = today();

  const items = input.lines
    .map((line, index) => {
      const split = splits[index];
      return `    <tetel>
      <megnevezes>${esc(line.name)}</megnevezes>
      <mennyiseg>1</mennyiseg>
      <mennyisegiEgyseg>db</mennyisegiEgyseg>
      <nettoEgysegar>${amount(split.netMinor, minorPerMajor)}</nettoEgysegar>
      <afakulcs>${esc(code)}</afakulcs>
      <nettoErtek>${amount(split.netMinor, minorPerMajor)}</nettoErtek>
      <afaErtek>${amount(split.vatMinor, minorPerMajor)}</afaErtek>
      <bruttoErtek>${amount(split.grossMinor, minorPerMajor)}</bruttoErtek>
    </tetel>`;
    })
    .join("\n");

  // Element order follows xmlszamla.xsd exactly; the schema uses xs:sequence.
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<xmlszamla xmlns="http://www.szamlazz.hu/xmlszamla" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.szamlazz.hu/xmlszamla https://www.szamlazz.hu/szamla/docs/xsds/agent/xmlszamla.xsd">
  <beallitasok>
    <szamlaagentkulcs>${esc(process.env.SZAMLAZZ_AGENT_KEY)}</szamlaagentkulcs>
    <eszamla>true</eszamla>
    <szamlaLetoltes>true</szamlaLetoltes>
    <valaszVerzio>2</valaszVerzio>
    <szamlaKulsoAzon>${esc(input.externalId)}</szamlaKulsoAzon>
  </beallitasok>
  <fejlec>
    <keltDatum>${date}</keltDatum>
    <teljesitesDatum>${date}</teljesitesDatum>
    <fizetesiHataridoDatum>${date}</fizetesiHataridoDatum>
    <fizmod>${esc(input.paymentMethod || "Bankkártya")}</fizmod>
    <penznem>${esc(input.currency.toUpperCase())}</penznem>
    <szamlaNyelve>${input.language === "en" ? "en" : "hu"}</szamlaNyelve>
    ${opt("megjegyzes", input.comment)}
    ${opt("rendelesSzam", input.orderNumber)}
    <fizetve>true</fizetve>
  </fejlec>
  <elado>
    ${opt("emailReplyto", process.env.STORE_REPLY_TO)}
  </elado>
  <vevo>
    <nev>${esc(input.buyer.name)}</nev>
    ${opt("orszag", input.buyer.country)}
    <irsz>${esc(input.buyer.zip)}</irsz>
    <telepules>${esc(input.buyer.city)}</telepules>
    <cim>${esc(input.buyer.address)}</cim>
    ${opt("email", input.buyer.email)}
    <sendEmail>${input.sendEmail ? "true" : "false"}</sendEmail>
    ${opt("adoszam", input.buyer.taxNumber)}
  </vevo>
  <tetelek>
${items}
  </tetelek>
</xmlszamla>`;

  return { xml, totals };
}

// --- response parsing ---

function decodeHeader(value: string | null): string | null {
  if (!value) return null;
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

/**
 * Pulls the base64 PDF out of the valaszVerzio=2 response. A regex rather than
 * an XML parser: the response is machine-generated, has exactly one <pdf>
 * element, and this avoids a dependency for one field.
 */
function extractPdf(body: string): Buffer | null {
  const match = body.match(/<pdf>([\s\S]*?)<\/pdf>/);
  if (!match) return null;

  try {
    const base64 = match[1].replace(/\s/g, "");
    return base64.length > 0 ? Buffer.from(base64, "base64") : null;
  } catch {
    return null;
  }
}

function extractTag(body: string, tag: string): string | null {
  const match = body.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`));
  return match ? match[1].trim() : null;
}

// --- the call ---

export async function issueInvoice(
  input: IssueInvoiceInput,
  options: { minorPerMajor: number; timeoutMs?: number } = { minorPerMajor: 100 },
): Promise<IssueInvoiceResult> {
  if (!szamlazzConfigured()) {
    return {
      ok: false,
      errorCode: "NOT_CONFIGURED",
      error: "SZAMLAZZ_AGENT_KEY is not set.",
    };
  }

  const { xml, totals } = buildInvoiceXml(input, options.minorPerMajor);

  const form = new FormData();
  form.append(
    XML_FIELD,
    new Blob([xml], { type: "application/xml" }),
    "szamla.xml",
  );

  let response: Response;
  try {
    response = await fetch(AGENT_URL, {
      method: "POST",
      body: form,
      signal: AbortSignal.timeout(options.timeoutMs ?? 25_000),
    });
  } catch (error) {
    return {
      ok: false,
      errorCode: "NETWORK",
      error: error instanceof Error ? error.message : "Request failed.",
    };
  }

  const errorCode = response.headers.get("szlahu_error_code");
  const errorMessage = decodeHeader(response.headers.get("szlahu_error"));

  if (errorCode || errorMessage) {
    return {
      ok: false,
      errorCode,
      error: errorMessage ?? `Számlázz.hu error ${errorCode}`,
    };
  }

  if (!response.ok) {
    return {
      ok: false,
      errorCode: String(response.status),
      error: `Számlázz.hu returned HTTP ${response.status}.`,
    };
  }

  const body = await response.text();

  // The headers are authoritative; the XML body is the fallback for the number
  // and the only place the PDF lives.
  const invoiceNumber =
    decodeHeader(response.headers.get("szlahu_szamlaszam")) ??
    extractTag(body, "szamlaszam");

  if (!invoiceNumber) {
    return {
      ok: false,
      errorCode: "NO_INVOICE_NUMBER",
      error: `Számlázz.hu accepted the request but returned no invoice number: ${body.slice(0, 300)}`,
    };
  }

  return {
    ok: true,
    invoiceNumber,
    netMinor: totals.netMinor,
    vatMinor: totals.vatMinor,
    grossMinor: totals.grossMinor,
    vatRate: totals.rate,
    pdf: extractPdf(body),
  };
}
