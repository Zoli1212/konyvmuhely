import { Resend } from "resend";

import { env } from "./env";

/**
 * Transactional email through Resend.
 *
 * Every send returns a result rather than throwing: these are called from
 * webhooks and server actions where a mail provider hiccup must not undo a
 * paid order or a completed registration.
 */

let client: Resend | null = null;

export function emailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM);
}

function getClient(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  if (!client) client = new Resend(key);
  return client;
}

export type EmailAttachment = {
  filename: string;
  content: Buffer;
  contentType?: string;
};

export type SendResult = { ok: true; id: string } | { ok: false; error: string };

export async function sendEmail(message: {
  to: string;
  subject: string;
  html: string;
  text: string;
  attachments?: EmailAttachment[];
  replyTo?: string;
  /**
   * Resend deduplicates on this, so a webhook replay cannot send the same
   * mail twice even if our own guard is bypassed.
   */
  idempotencyKey?: string;
}): Promise<SendResult> {
  const resend = getClient();
  const from = process.env.EMAIL_FROM;

  if (!resend || !from) {
    return { ok: false, error: "Email is not configured (RESEND_API_KEY / EMAIL_FROM)." };
  }

  try {
    const { data, error } = await resend.emails.send(
      {
        from,
        to: message.to,
        subject: message.subject,
        html: message.html,
        text: message.text,
        replyTo: message.replyTo ?? process.env.STORE_REPLY_TO,
        attachments: message.attachments?.map((file) => ({
          filename: file.filename,
          content: file.content,
          contentType: file.contentType,
        })),
      },
      message.idempotencyKey ? { idempotencyKey: message.idempotencyKey } : undefined,
    );

    if (error) return { ok: false, error: error.message };
    if (!data) return { ok: false, error: "Resend returned no message id." };

    return { ok: true, id: data.id };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Unknown send failure.",
    };
  }
}

// --- shared layout ---

/**
 * A light layout, deliberately unlike the dark storefront. Dark backgrounds
 * are unreliable in email: several clients invert them, and the result is
 * unreadable. The gold accent and the serif heading carry the brand instead.
 *
 * Tables and inline styles because that is what email clients actually
 * support.
 */
export function emailLayout(options: {
  title: string;
  preheader: string;
  body: string;
  footerNote: string;
}): string {
  return `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(options.title)}</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f1ec;">
  <span style="display:none;font-size:1px;color:#f4f1ec;max-height:0;overflow:hidden;">${escapeHtml(options.preheader)}</span>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f1ec;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:#ffffff;border:1px solid #e6e0d6;border-radius:12px;overflow:hidden;">

          <tr>
            <td style="padding:28px 32px 0 32px;">
              <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:19px;font-weight:600;color:#1b1a22;letter-spacing:-0.01em;">
                ${escapeHtml(env.storeName)}
              </p>
              <div style="height:3px;width:40px;background-color:#cfa14f;margin-top:10px;"></div>
            </td>
          </tr>

          <tr>
            <td style="padding:24px 32px 32px 32px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:15px;line-height:1.65;color:#36343f;">
              ${options.body}
            </td>
          </tr>

          <tr>
            <td style="padding:18px 32px 24px 32px;border-top:1px solid #efe9df;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:12px;line-height:1.6;color:#8b8796;">
              ${escapeHtml(options.footerNote)}
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function emailHeading(text: string): string {
  return `<h1 style="margin:0 0 16px 0;font-family:Georgia,'Times New Roman',serif;font-size:25px;line-height:1.25;font-weight:600;color:#1b1a22;">${escapeHtml(text)}</h1>`;
}

export function emailParagraph(text: string): string {
  return `<p style="margin:0 0 14px 0;">${escapeHtml(text)}</p>`;
}

export function emailButton(label: string, url: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:22px 0;">
    <tr>
      <td style="background-color:#cfa14f;border-radius:8px;">
        <a href="${escapeAttr(url)}" style="display:inline-block;padding:12px 24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:15px;font-weight:600;color:#1b1407;text-decoration:none;">${escapeHtml(label)}</a>
      </td>
    </tr>
  </table>`;
}

/** A book with its download links, as one row of the purchase confirmation. */
export function emailBookRow(options: {
  title: string;
  author: string;
  links: { label: string; url: string }[];
}): string {
  const links = options.links
    .map(
      (link) =>
        `<a href="${escapeAttr(link.url)}" style="display:inline-block;margin:6px 8px 0 0;padding:7px 13px;border:1px solid #d9d2c6;border-radius:6px;font-size:13px;color:#6b5420;text-decoration:none;">${escapeHtml(link.label)}</a>`,
    )
    .join("");

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 14px 0;border:1px solid #efe9df;border-radius:10px;">
    <tr>
      <td style="padding:16px 18px;">
        <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:16px;font-weight:600;color:#1b1a22;">${escapeHtml(options.title)}</p>
        <p style="margin:2px 0 0 0;font-size:12px;letter-spacing:0.06em;text-transform:uppercase;color:#8b8796;">${escapeHtml(options.author)}</p>
        <div>${links}</div>
      </td>
    </tr>
  </table>`;
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeAttr(value: string): string {
  return escapeHtml(value);
}
