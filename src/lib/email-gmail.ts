/**
 * Sending through Gmail, by either of the two ways Google allows.
 *
 * **App password over SMTP** (preferred for a plain @gmail.com account).
 * An app password is not an OAuth scope, so there is no consent screen, no
 * verification review, and — the point — **no expiry**. An OAuth app that
 * requests `gmail.send` while in Testing status has its refresh token
 * invalidated by Google after seven days, which would stop the shop's email
 * dead with no warning. App passwords do not do that.
 *
 * **OAuth over the Gmail API** (for a Google Workspace mailbox). A Workspace
 * domain can set the OAuth app to Internal, which skips verification and
 * keeps the refresh token alive indefinitely.
 *
 * Whichever is configured is used, app password first. Both send from a
 * mailbox you already own, so neither needs a domain of your own.
 */
import { randomUUID } from "node:crypto";

import nodemailer from "nodemailer";

import type { EmailAttachment, SendResult } from "./email";

export function gmailAppPasswordConfigured(): boolean {
  return Boolean(process.env.GMAIL_APP_PASSWORD && process.env.GMAIL_SENDER);
}

export function gmailOAuthConfigured(): boolean {
  return Boolean(
    process.env.GMAIL_CLIENT_ID &&
      process.env.GMAIL_CLIENT_SECRET &&
      process.env.GMAIL_REFRESH_TOKEN &&
      process.env.GMAIL_SENDER,
  );
}

export function gmailConfigured(): boolean {
  return gmailAppPasswordConfigured() || gmailOAuthConfigured();
}

export function gmailMode(): "app-password" | "oauth" | "none" {
  if (gmailAppPasswordConfigured()) return "app-password";
  if (gmailOAuthConfigured()) return "oauth";
  return "none";
}

type Message = {
  to: string;
  subject: string;
  html: string;
  text: string;
  attachments?: EmailAttachment[];
  replyTo?: string;
};

/**
 * The address Gmail will actually send as. Gmail rewrites the From header to
 * the authenticated mailbox regardless, so a display name is the only part
 * we get to choose.
 */
function fromHeader(): string {
  const address = process.env.GMAIL_SENDER ?? "";
  const name = process.env.NEXT_PUBLIC_STORE_NAME;
  return name ? `${name} <${address}>` : address;
}

// --- SMTP with an app password ---

/**
 * One pooled transport per warm instance. Gmail throttles connection setup
 * far more aggressively than it throttles messages, so reconnecting per send
 * is what actually gets a sender rate-limited.
 */
let transport: nodemailer.Transporter | null = null;

function getTransport(): nodemailer.Transporter {
  if (!transport) {
    transport = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL_SENDER,
        // Google shows the app password in groups of four; people paste it
        // that way, and Gmail rejects it with the spaces still in.
        pass: (process.env.GMAIL_APP_PASSWORD ?? "").replace(/\s+/g, ""),
      },
      pool: true,
      maxConnections: 2,
    });
  }
  return transport;
}

async function sendViaSmtp(message: Message): Promise<SendResult> {
  try {
    const info = await getTransport().sendMail({
      from: fromHeader(),
      to: message.to,
      subject: message.subject,
      text: message.text,
      html: message.html,
      replyTo: message.replyTo,
      attachments: message.attachments?.map((file) => ({
        filename: file.filename,
        content: file.content,
        contentType: file.contentType,
      })),
    });

    return { ok: true, id: info.messageId ?? randomUUID() };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Gmail SMTP send failed.",
    };
  }
}

// --- OAuth over the Gmail API ---

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const SEND_URL = "https://gmail.googleapis.com/upload/gmail/v1/users/me/messages/send?uploadType=media";

/** Access tokens last an hour; a warm instance reuses one. */
let cached: { token: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (cached && cached.expiresAt > Date.now() + 60_000) return cached.token;

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GMAIL_CLIENT_ID ?? "",
      client_secret: process.env.GMAIL_CLIENT_SECRET ?? "",
      refresh_token: process.env.GMAIL_REFRESH_TOKEN ?? "",
      grant_type: "refresh_token",
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Gmail token refresh failed (${response.status}): ${(await response.text()).slice(0, 200)}`,
    );
  }

  const data = (await response.json()) as {
    access_token: string;
    expires_in: number;
  };
  cached = { token: data.access_token, expiresAt: Date.now() + data.expires_in * 1000 };
  return cached.token;
}

async function sendViaApi(message: Message): Promise<SendResult> {
  try {
    const token = await getAccessToken();

    // nodemailer can build the MIME without opening a connection, which
    // saves hand-rolling multipart and RFC 2047 header encoding.
    const built = await nodemailer
      .createTransport({ streamTransport: true, buffer: true, newline: "unix" })
      .sendMail({
        from: fromHeader(),
        to: message.to,
        subject: message.subject,
        text: message.text,
        html: message.html,
        replyTo: message.replyTo,
        attachments: message.attachments?.map((file) => ({
          filename: file.filename,
          content: file.content,
          contentType: file.contentType,
        })),
      });

    const response = await fetch(SEND_URL, {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "message/rfc822",
      },
      body: new Uint8Array(built.message as Buffer),
    });

    if (!response.ok) {
      return {
        ok: false,
        error: `Gmail API send failed (${response.status}): ${(await response.text()).slice(0, 300)}`,
      };
    }

    const data = (await response.json()) as { id?: string };
    return { ok: true, id: data.id ?? randomUUID() };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Gmail API send failed.",
    };
  }
}

export async function sendViaGmail(message: Message): Promise<SendResult> {
  return gmailAppPasswordConfigured()
    ? sendViaSmtp(message)
    : sendViaApi(message);
}
