/**
 * One-off: obtains a Gmail refresh token.
 *
 * A refresh token cannot be created in the Cloud Console; it only comes out
 * of an authorisation you complete yourself, once. This runs a tiny local
 * server, opens the consent screen, catches the redirect, trades the code,
 * and prints the token.
 *
 *   GMAIL_CLIENT_ID=... GMAIL_CLIENT_SECRET=... npx tsx scripts/gmail-token.mts
 *
 * The OAuth client must list this exact redirect URI:
 *   http://localhost:5311/callback
 */
import { createServer } from "node:http";
import { spawn } from "node:child_process";

const PORT = 5311;
const REDIRECT = `http://localhost:${PORT}/callback`;
const SCOPE = "https://www.googleapis.com/auth/gmail.send";

const clientId = process.env.GMAIL_CLIENT_ID;
const clientSecret = process.env.GMAIL_CLIENT_SECRET;

if (!clientId || !clientSecret) {
  console.error(
    "Set GMAIL_CLIENT_ID and GMAIL_CLIENT_SECRET before running this.",
  );
  process.exit(1);
}

const authUrl =
  "https://accounts.google.com/o/oauth2/v2/auth?" +
  new URLSearchParams({
    client_id: clientId,
    redirect_uri: REDIRECT,
    response_type: "code",
    scope: SCOPE,
    // offline + consent is what makes Google hand back a refresh token at
    // all; without the forced consent a repeat authorisation returns only
    // an access token.
    access_type: "offline",
    prompt: "consent",
  });

function page(title: string, body: string): string {
  return `<!doctype html><meta charset="utf-8"><title>${title}</title>
<body style="font-family:system-ui;background:#0b0a11;color:#f6f1e8;display:grid;place-items:center;height:100vh;margin:0">
<div style="text-align:center;max-width:32rem;padding:2rem">
<h1 style="font-family:Georgia,serif;font-weight:600">${title}</h1>
<p style="color:#cac4b9;line-height:1.6">${body}</p></div>`;
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url ?? "/", `http://localhost:${PORT}`);
  if (url.pathname !== "/callback") {
    response.writeHead(404).end();
    return;
  }

  const error = url.searchParams.get("error");
  const code = url.searchParams.get("code");

  if (error || !code) {
    response
      .writeHead(400, { "content-type": "text/html; charset=utf-8" })
      .end(page("Nem sikerült", `A Google ezt küldte: ${error ?? "nincs kód"}`));
    console.error("Authorisation failed:", error ?? "no code returned");
    server.close();
    process.exitCode = 1;
    return;
  }

  try {
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: REDIRECT,
        grant_type: "authorization_code",
      }),
    });

    const data = (await tokenResponse.json()) as {
      refresh_token?: string;
      error_description?: string;
    };

    if (!data.refresh_token) {
      throw new Error(
        data.error_description ??
          "Google returned no refresh token. Revoke the app's access at myaccount.google.com/permissions and run this again.",
      );
    }

    response
      .writeHead(200, { "content-type": "text/html; charset=utf-8" })
      .end(
        page(
          "Megvan",
          "A refresh token a terminálban jelent meg. Ezt az ablakot bezárhatod.",
        ),
      );

    console.log("\n─────────────────────────────────────────");
    console.log("GMAIL_REFRESH_TOKEN=" + data.refresh_token);
    console.log("─────────────────────────────────────────");
    console.log(
      "\nPut it in Vercel, never in the repository. It does not expire\n" +
        "while the OAuth app is published or Internal; in Testing status\n" +
        "Google invalidates it after seven days.",
    );
  } catch (caught) {
    response
      .writeHead(500, { "content-type": "text/html; charset=utf-8" })
      .end(page("Hiba", String(caught)));
    console.error(caught);
    process.exitCode = 1;
  } finally {
    server.close();
  }
});

server.listen(PORT, () => {
  console.log(`Listening on ${REDIRECT}`);
  console.log("Opening the consent screen. If it does not open, visit:\n");
  console.log(authUrl + "\n");
  // Windows: `start` needs an empty title argument before the URL.
  spawn("cmd", ["/c", "start", "", authUrl], { stdio: "ignore", detached: true });
});
