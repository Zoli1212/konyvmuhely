# ebook-shop

A bilingual (Hungarian / English) storefront for selling your own e-books. Upload a
PDF or EPUB, set a cover, a short description and a price, and buyers pay through
Stripe and download from their own library — unlimited re-downloads, no DRM.

Built for Vercel: Next.js 16 (App Router) · NextAuth v5 · Prisma 7 + Postgres ·
Stripe Checkout · Vercel Blob · Tailwind CSS v4.

---

## How it works

**Two languages, three levels.** The language lives in the URL (`/hu/...`,
`/en/...`), the interface is fully translated, and every book carries Hungarian and
English title, subtitle, short description and long description. The English fields
are optional: where they are empty, the Hungarian text is shown, so a
Hungarian-only title never renders as a blank page. A book can also ship separate
Hungarian and English files — four slots per title, language × format.

**Files are never public.** Book files go to Vercel Blob as *private* blobs, so a
leaked URL is worthless on its own. The only way to the bytes is
`/api/download/[fileId]`, which checks the buyer's entitlement and then streams the
file through without buffering it — a 150 MB PDF costs the function almost no
memory. Covers are public blobs, so `next/image` can serve them from the CDN.

**Large uploads bypass the server.** A Vercel function may only receive about
4.5 MB of request body, so an e-book cannot travel through it. The browser uploads
straight to Blob using a short-lived token that `/api/admin/blob-upload` issues
only to an admin, and only for paths under `covers/` or `books/`. Uploads above
20 MB are split into parts automatically, with failed parts retried.

**Payment is settled twice, safely.** The Stripe webhook is the authoritative path
and grants entitlements from Stripe's own account of what was paid. The return URL
(`/api/checkout/return`) reconciles the same session again before showing the
confirmation page. Fulfilment is idempotent and keyed on the Stripe session id, so
whichever arrives first wins and the other is a no-op — which is also why checkout
works locally without `stripe listen` running. A full refund withdraws the
entitlements the order granted.

**Prices never come from the client.** The cart is a cookie holding book ids and
nothing else. Checkout re-reads every price from the database, so a tampered cookie
can change *which* books are bought, never what they cost.

---

## Running it locally

Requires Node 20.9+ and a Postgres database.

```bash
npm install
cp .env.example .env     # then fill it in, see below
npm run db:deploy        # apply migrations
npm run seed             # create the admin account and a draft sample book
npm run dev
```

Open <http://localhost:3000>. A bare URL redirects to your browser's language.

Sign in with the `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` from `.env`, then go to
**Kezelőfelület → Új könyv**.

### A Postgres in one command

```bash
docker run -d --name ebookshop-pg \
  -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=ebook_shop \
  -p 55432:5432 postgres:17-alpine
```

Then set both URLs to
`postgresql://postgres:postgres@localhost:55432/ebook_shop`.

### Without a Vercel Blob token

Leave `BLOB_READ_WRITE_TOKEN` empty and uploads go to a `.storage/` directory in
the project instead. The admin area says so in a banner. This is **development
only** — Vercel's filesystem is read-only, so a deployment without the token cannot
accept uploads at all.

---

## Environment variables

See `.env.example` for the annotated list. The ones that matter:

| Variable | Needed for | Notes |
| --- | --- | --- |
| `DATABASE_URL` | everything | **Pooled** connection. Neon's `-pooler` host, Supabase port 6543. |
| `DIRECT_URL` | migrations | **Direct** connection, port 5432. Migrations through a pooler fail. |
| `AUTH_SECRET` | sign-in | `npx auth secret` |
| `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` | Google sign-in | Leave empty to run with passwords only; the button then hides itself. |
| `STRIPE_SECRET_KEY` | checkout | Without it the catalogue and admin still work; buying is refused with a message. |
| `STRIPE_WEBHOOK_SECRET` | fulfilment | |
| `BLOB_READ_WRITE_TOKEN` | uploads | Required on Vercel. |
| `NEXT_PUBLIC_STORE_CURRENCY` | prices | ISO 4217, lower case. Default `huf`. |
| `NEXT_PUBLIC_STORE_NAME` | branding | Shown in the header, footer and page titles. |

### VAT: exempt by default

The store ships configured for an **alanyi adómentes** seller — not registered
for VAT. No VAT appears on the invoice, and Számlázz.hu receives the literal
VAT code `AAM`, which is what makes it print the legal reference to the
exemption. Sending `0%` instead is a common mistake and is *not* lawful for an
exempt seller: it reads as a zero-rated taxable supply, which is a different
thing.

The exemption has an annual turnover ceiling — 20 million HUF in 2026, rising
to 22 million from 2027. Crossing it makes you VAT-registered from that point.
When that happens, flip one variable:

```
STORE_VAT_MODE="standard"
STORE_VAT_RATE="27"
```

27, not 5: Hungary applies the reduced book rate to printed books only. The EU
directive treats a printed book as goods and an e-book as an electronically
supplied service, and Hungary has not extended the reduced rate to electronic
publications. Confirm the current position with your accountant before
pricing.

In standard mode prices stay gross and are split per line, so the invoice
totals always equal the sum of their own lines.

### A note on prices and HUF

Stripe wants amounts in the currency's smallest unit, and HUF has a rule of its
own: the amount must be an exact multiple of 100 minor units. So **4990 Ft is
stored as `499000`**, and a price of 4990.50 Ft is rejected with an explanation
rather than silently rounded. You type the major unit (`4990`) in the admin form;
`src/lib/money.ts` handles the rest, including zero-decimal currencies like JPY.

Catalogue prices are always what the buyer pays. Under the exemption that is
also the invoice total; under standard VAT it is the gross.

---

## Deploying to Vercel

1. **Database.** Create a Postgres (Vercel Postgres, Neon or Supabase). Put the
   pooled URL in `DATABASE_URL` and the direct one in `DIRECT_URL`.
2. **Blob store.** Vercel project → Storage → create a Blob store. It sets
   `BLOB_READ_WRITE_TOKEN` for you.
3. **Auth.** Set `AUTH_SECRET`. For Google sign-in, add your production callback
   to the Google console: `https://<your-domain>/api/auth/callback/google`
4. **Stripe.** Set `STRIPE_SECRET_KEY`. Then add a webhook endpoint at
   `https://<your-domain>/api/stripe/webhook` subscribed to:
   - `checkout.session.completed`
   - `checkout.session.async_payment_succeeded`
   - `checkout.session.async_payment_failed`
   - `checkout.session.expired`
   - `charge.refunded`

   Copy its signing secret into `STRIPE_WEBHOOK_SECRET`.
5. **Deploy.** The build script runs `prisma generate` before `next build`.
6. **Migrate.** Once, against the production database:
   ```bash
   vercel env pull .env.production.local
   DIRECT_URL="<production direct url>" npx prisma migrate deploy
   ```
7. **Make yourself admin.** Register through the site, then:
   ```bash
   npm run make-admin -- you@example.com
   ```
   Sessions are JWTs, so sign out and back in for the new role to take effect.

### Testing the webhook locally

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Checkout also works without this — the return URL reconciles the payment — but
run it if you want to exercise the real path.

---

## Project layout

```
prisma/schema.prisma      data model; Auth.js tables + the store's own
prisma.config.ts          Prisma 7 config: migration URLs live here, not in the schema
src/proxy.ts              language detection and redirect (Next 16's renamed middleware)
src/i18n/                 locale config and the full dictionary for both languages
src/app/[locale]/         every page; this is also the root layout, so <html lang> is right
src/app/api/              auth, Stripe webhook, checkout return, downloads, uploads
src/actions/              server actions: cart, auth, books, locale
src/lib/
  auth.ts                 NextAuth v5: credentials + Google
  books.ts                one shared select; BookRecord is derived from it
  checkout.ts             the only place money is charged and entitlements are granted
  money.ts                minor units, zero-decimal and whole-major-unit currencies
  storage.ts              Blob and local-disk drivers behind one interface
  upload-client.ts        browser-side upload with progress
src/components/           storefront and admin UI
scripts/                  seed, make-admin
```

---

## Things worth knowing before you change something

- **`allowDangerousEmailAccountLinking` is on for Google.** Someone who registered
  with a password can later sign in with Google on the same address. This is safe
  because Google verifies its addresses; it would not be with a provider that does
  not.
- **A sold book cannot be deleted.** `OrderItem` restricts the delete on purpose,
  so order history and buyers' download rights survive. Unpublish instead — the
  admin form says so.
- **Entitlements are separate from orders.** One row means "this user owns this
  book", which is what makes a manual grant, a gift or a refund expressible
  without rewriting order history.
- **Every page is per-request.** They all read the session and the cart cookie, so
  there is no `generateStaticParams` and no prerendering; adding it would open a
  database connection during `next build` for pages that can never be static.
- **The UI copy is Hungarian-first.** Both languages live in
  `src/i18n/dictionaries.ts`; `hu` is the reference shape and `en` is typed against
  it, so a missing key is a compile error, not a blank label in production.
