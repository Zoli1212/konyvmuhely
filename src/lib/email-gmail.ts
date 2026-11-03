/**
 * Sending through the Gmail API.
 *
 * The alternative to Resend, and the one that needs no domain of your own:
 * mail leaves from a Gmail or Workspace mailbox you already have, authorised
 * once with a refresh token.
 *
 * Deliberately written against plain fetch rather than the `googleapis`
 * package. That package is tens of megabytes and pulls in every Google API;
 * sending one message needs two HTTP calls, and a serverless function should
 * not carry the rest.
 */
import { randomUUID } from "node:crypto";

import type { EmailAttachment, SendResult } from "./email";

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const SEND_URL =
  "https://gmail.googleapis.com/upload/gmail/v1/users/me/messages/send?uploadType=multipart";

export function gmailConfigured(): boolean {
  return Boolean(
    process.env.GMAIL_CLIENT_ID &&
      process.env.GMAIL_CLIENT_SECRET &&
      process.env.GMAIL_REFRESH_TOKEN &&
      process.env.GMAIL_SENDER,
  );
}

/**
 * Access tokens last an hour. A warm serverless instance reuses one rather
 * than trading the refresh token on every send, which also keeps us well
 * inside Google's token endpoint limits.
 */
let cached: { token: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (cached && cached.expiresAt > Date.now() + 60_000) return cached.token;

  const body = new URLSearchParams({
    client_id: process.env.GMAIL_CLIENT_ID ?? "",
    client_secret: process.env.GMAIL_CLIENT_SECRET ?? "",
    refresh_token: process.env.GMAIL_REFRESH_TOKEN ?? "",
    grant_type: "refresh_token",
  });

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body,
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

  cached = {
    token: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  };
  return cached.token;
}

/**
 * RFC 2047 encoded-word. Without it a subject like "Köszönjük a vásárlást"
 * arrives as mojibake in clients that assume ASCII headers.
 */
function encodeHeader(value: string): string {
  // eslint-disable-next-line no-control-regex
  if (/^[\x00-\x7F]*$/.test(value)) return value;
  return `=?UTF-8?B?${Buffer.from(value, "utf8").toString("base64")}?=`;
}

function base64Url(buffer: Buffer): string {
  return buffer
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/** Splits base64 into 76-character lines, as MIME requires. */
function wrapBase64(value: string): string {
  return value.replace(/(.{76})/g, "$1\r\n");
}

function buildMime(message: {
  from: string;
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
  attachments?: EmailAttachment[];
}): Buffer {
  const altBoundary = `alt_${randomUUID()}`;
  const mixedBoundary = `mix_${randomUUID()}`;
  const hasAttachments = (message.attachments?.length ?? 0) > 0;

  const headers = [
    `From: ${message.from}`,
    `To: ${message.to}`,
    `Subject: ${encodeHeader(message.subject)}`,
    message.replyTo ? `Reply-To: ${message.replyTo}` : null,
    "MIME-Version: 1.0",
    hasAttachments
      ? `Content-Type: multipart/mixed; boundary="${mixedBoundary}"`
      : `Content-Type: multipart/alternative; boundary="${altBoundary}"`,
  ].filter(Boolean);

  const alternative = [
    `--${altBoundary}`,
    'Content-Type: text/plain; charset="UTF-8"',
    "Content-Transfer-Encoding: base64",
    "",
    wrapBase64(Buffer.from(message.text, "utf8").toString("base64")),
    `--${altBoundary}`,
    'Content-Type: text/html; charset="UTF-8"',
    "Content-Transfer-Encoding: base64",
    "",
    wrapBase64(Buffer.from(message.html, "utf8").toString("base64")),
    `--${altBoundary}--`,
  ].join("\r\n");

  if (!hasAttachments) {
    return Buffer.from([...headers, "", alternative, ""].join("\r\n"), "utf8");
  }

  const parts = [
    ...headers,
    "",
    `--${mixedBoundary}`,
    `Content-Type: multipart/alternative; boundary="${altBoundary}"`,
    "",
    alternative,
  ];

  for (const file of message.attachments ?? []) {
    parts.push(
      `--${mixedBoundary}`,
      `Content-Type: ${file.contentType ?? "application/octet-stream"}; name="${file.filename}"`,
      "Content-Transfer-Encoding: base64",
      `Content-Disposition: attachment; filename="${file.filename}"`,
      "",
      wrapBase64(file.content.toString("base64")),
    );
  }

  parts.push(`--${mixedBoundary}--`, "");
  return Buffer.from(parts.join("\r\n"), "utf8");
}

export async function sendViaGmail(message: {
  to: string;
  subject: string;
  html: string;
  text: string;
  attachments?: EmailAttachment[];
  replyTo?: string;
}): Promise<SendResult> {
  try {
    const token = await getAccessToken();

    const mime = buildMime({
      from: process.env.GMAIL_SENDER ?? "",
      to: message.to,
      subject: message.subject,
      html: message.html,
      text: message.text,
      replyTo: message.replyTo,
      attachments: message.attachments,
    });

    const response = await fetch(SEND_URL, {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "message/rfc822",
      },
      body: new Uint8Array(mime),
    });

    if (!response.ok) {
      return {
        ok: false,
        error: `Gmail send failed (${response.status}): ${(await response.text()).slice(0, 300)}`,
      };
    }

    const data = (await response.json()) as { id?: string };
    return { ok: true, id: data.id ?? base64Url(mime).slice(0, 16) };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Gmail send failed.",
    };
  }
}
