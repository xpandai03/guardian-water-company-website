# Implementation plan: Jobber lead intake + Twilio SMS

## Context

- **Codebase:** Next.js 15 (App Router), React 19, TypeScript, Tailwind, Zod + react-hook-form available. No `app/api` routes yet; marketing site with a client-side estimate form in `components/booking.tsx` (currently `preventDefault` + `alert`).
- **`/AUDIT.md`:** Not present in this repository at plan time. This document is written from the live tree and Jobber’s public Developer Center docs. If `AUDIT.md` is added elsewhere, reconcile any naming or deployment assumptions with that audit.

---

## 1. File structure (exact paths)

| Path | Purpose |
|------|--------|
| `app/api/jobber/oauth/callback/route.ts` | OAuth **authorization-code** callback: exchanges `code` for tokens, surfaces `refresh_token` once for copying into Vercel (see §3). |
| `app/api/leads/route.ts` | **POST** handler: validate body → Jobber (client + request) → optional Twilio SMS → JSON response. |
| `lib/jobber/config.ts` | Constants only: GraphQL URL, OAuth URLs, token URL, optional default `X-JOBBER-GRAPHQL-VERSION` value (no secrets). |
| `lib/jobber/oauth.ts` | `exchangeCodeForTokens`, `refreshAccessToken` (form-encoded `POST` to `https://api.getjobber.com/api/oauth/token`). |
| `lib/jobber/graphql.ts` | `jobberGraphql<T>(accessToken, query, variables?)` — `fetch` to `https://api.getjobber.com/api/graphql` with `Authorization: Bearer …`, `Content-Type: application/json`, and version header. |
| `lib/jobber/client.ts` | `getAccessToken()` — reads `JOBBER_REFRESH_TOKEN` (and client id/secret) from `process.env`, calls refresh flow, returns short-lived access token. Handles rotation response (see §2 note). |
| `lib/jobber/mutations.ts` | Exported mutation **strings** (or template literals) for `clientCreate` / `requestCreate` + typed variable shapes. |
| `lib/twilio/sms.ts` | `sendLeadConfirmationSms(toE164, body)` using env-based credentials. |
| `lib/leads/schema.ts` | Zod schema for `{ name, phone, zip }` (or aligned field names) + normalization (e.g. phone to E.164 if US-only). |

**Optional (only if needed for reuse/UI):**

| Path | Purpose |
|------|--------|
| `lib/leads/submit-lead.ts` | Pure async function used by the route (easier unit testing without `NextRequest`). |
| `components/booking.tsx` | Wire form to `POST /api/leads` (controlled fields or `react-hook-form` + Zod resolver). |

No Google Sheets, n8n, or Zapier layers—only HTTP calls from the route/handlers.

---

## 2. Environment variables

| Variable | Required | Role |
|----------|----------|------|
| `JOBBER_CLIENT_ID` | Yes | OAuth app client identifier (public). |
| `JOBBER_CLIENT_SECRET` | Yes | OAuth client secret; server-only. |
| `JOBBER_REFRESH_TOKEN` | Yes (after handshake) | Long-lived refresh token used to obtain access tokens for GraphQL. |
| `JOBBER_REDIRECT_URI` | Yes for OAuth | Exact callback URL registered in Jobber Developer Center (e.g. `https://<production-domain>/api/jobber/oauth/callback`). Used in authorize link and token exchange. |
| `X-JOBBER-GRAPHQL-VERSION` or inline constant | Recommended | Jobber documents API evolution via `X-JOBBER-GRAPHQL-VERSION` header; set to the active version you validate in GraphiQL (see Jobber “API Versioning” / changelog). |
| `TWILIO_ACCOUNT_SID` | Yes | Twilio account SID. |
| `TWILIO_AUTH_TOKEN` | Yes | Twilio auth token; server-only. |
| `TWILIO_FROM_NUMBER` | Yes | SMS-capable Twilio number (E.164, e.g. `+15551234567`). |
| `LEAD_CONFIRMATION_SMS_TEMPLATE` | Optional | Short text template; if unset, use a sensible default copy mentioning estimate / follow-up. Avoid leaking internal errors in SMS body. |
| `JOBBER_OAUTH_STATE_SECRET` | Recommended | HMAC key or signing secret for `state` cookie in callback flow (prevents CSRF on OAuth callback). |

**Operational note — refresh token rotation:** Jobber documents refresh token rotation: when **ON**, each refresh returns a **new** refresh token and the old one must not be reused. **Vercel environment variables are not writable at runtime** from a serverless function. For a private integration, options are: (a) use a Jobber app configuration with rotation **off** if acceptable for this use case, or (b) persist the latest refresh token in **writable** storage (Vercel KV, Postgres, Edge Config via API, etc.) and read from there instead of only `process.env`. The implementation should still **read** secrets from `process.env` (including a DB connection string or KV token), never hardcode. This plan assumes David’s team confirms rotation setting; if rotation stays on, extend §1 with a small persistence module before go-live.

**Local development:** `.env.local` (gitignored) mirrors production keys for non-secret dev keys; never commit secrets.

---

## 3. OAuth callback route — full flow and one-time handshake with David

### 3.1 Jobber Developer Center (one-time setup)

1. Create app in [Jobber Developer Center](https://developer.getjobber.com/) with scopes sufficient for **creating clients** and **creating requests** (confirm exact scope names in the app UI when enabling mutations).
2. Set **OAuth Callback URL** to production (and optionally a Preview URL pattern if testing on Vercel previews—Jobber may require exact match per environment).
3. Record **Client ID** and **Client Secret**.

### 3.2 Authorization URL (manual step with David)

Build this URL (encode `redirect_uri`):

```text
https://api.getjobber.com/api/oauth/authorize?response_type=code&client_id=<JOBBER_CLIENT_ID>&redirect_uri=<URL_ENCODED_JOBBER_REDIRECT_URI>&state=<RANDOM_STATE>
```

- **David’s action:** While logged into the correct Jobber account, open the link (or use Jobber’s “Connect” from the app listing if applicable). Approve scopes.
- **`state`:** Generate a cryptographically random value; store expected value in an **httpOnly, Secure, SameSite=Lax** cookie (or signed session) before redirecting David to Jobber. If the first version is “operator pastes URL in browser,” a minimal approach is: you generate `state`, you and David use the same browser session, or David sends you the full callback URL and you complete exchange from a trusted machine—prefer the cookie flow for production.

### 3.3 Callback handler behavior (`GET /api/jobber/oauth/callback`)

1. Read `code` and `state` from query string; handle `error` query params from OAuth if present.
2. Validate `state` against the cookie (or reject if missing/mismatch).
3. `POST https://api.getjobber.com/api/oauth/token` with `Content-Type: application/x-www-form-urlencoded` and body:
   - `client_id`, `client_secret`, `grant_type=authorization_code`, `code`, `redirect_uri` (must match authorize step exactly).
4. Parse JSON: `access_token`, `refresh_token`.
5. **One-time handshake output:** Respond with a **plain HTML or plaintext page** (not JSON to the public) that displays:
   - Success message.
   - The **`refresh_token` string** in a copy-friendly `<pre>` (or instruct David to copy from network tab—less ideal).
   - Reminder: paste into Vercel **Production** (and Preview if needed) env as `JOBBER_REFRESH_TOKEN`, redeploy.
6. Optionally call Jobber `account` query with the new `access_token` to display account name/id for confidence.
7. **Do not** log full tokens in production logs; redact in any diagnostic logging.

After `JOBBER_REFRESH_TOKEN` is set, the callback route can remain deployed (idempotent) for future re-authorization, or be gated behind a feature flag / basic secret query param only used internally—decide with David for least exposure.

---

## 4. Lead-submit route — step-by-step logic (`POST /api/leads`)

1. **Parse body:** `Content-Type: application/json` preferred; reject unsupported types with `415` or `400`.
2. **Validate** with Zod (`name`, `phone`, `zip` as strings; trim; length limits; phone format appropriate for US if that’s the business).
3. **Obtain Jobber access token** via `refreshAccessToken` using env vars. If missing env or token exchange fails → **400/500** with generic message, **no SMS**.
4. **`clientCreate` mutation** with normalized fields (split `name` into first/last if Jobber requires both—see §5; map `phone` to phones array; map `zip` to billing address or custom field per schema).
5. If GraphQL returns **top-level errors** or **`userErrors`** on `clientCreate` → return **4xx/5xx** with safe message, **no SMS**.
6. **`requestCreate` mutation** using returned **client `id`** (Relay global ID string). If fails → return error; consider whether to leave orphan client (acceptable for v1) or document manual cleanup—**no SMS** on failure.
7. **On full Jobber success only:** call Twilio send SMS to the lead’s number.
8. **Twilio failure:** log server-side (message SID error, status code, redacted phone), **still return HTTP 200** (or `201`) with JSON like `{ ok: true, jobber: { clientId, requestId } }` so the user sees success. Optionally include `sms: "queued" | "failed"` for internal debugging only if acceptable—default to omitting for public clients.
9. **Twilio success:** same success JSON; optional `sms: "sent"`.

**Idempotency:** Not required for v1; duplicate submissions create duplicate clients/requests unless dedupe logic is added later.

---

## 5. Jobber GraphQL mutations — mutation strings

**Endpoint:** `POST https://api.getjobber.com/api/graphql`  
**Headers:** `Authorization: Bearer <access_token>`, `Content-Type: application/json`, `X-JOBBER-GRAPHQL-VERSION: <version>`.

### 5.1 `clientCreate` (from Jobber docs — adjust fields to match lead form)

```graphql
mutation ClientCreate($input: ClientCreateInput!) {
  clientCreate(input: $input) {
    client {
      id
      firstName
      lastName
    }
    userErrors {
      message
      path
    }
  }
}
```

**Example variables** (adapt to your Zod output; Jobber expects structured phones/emails):

```json
{
  "input": {
    "firstName": "Jane",
    "lastName": "Doe",
    "phones": [
      {
        "description": "MOBILE",
        "primary": true,
        "number": "+18015550199"
      }
    ],
    "billingAddress": {
      "postalCode": "84101"
    }
  }
}
```

**Note:** Enum values like `MOBILE` / `MAIN` must match the current schema (confirm in GraphiQL). If only a single `name` is collected, split on first space → `firstName` + `lastName`, remainder in `lastName`, or put full name in `firstName` and use `"."` for `lastName` only if schema requires non-empty `lastName`—**confirm in schema**.

### 5.2 `requestCreate`

Jobber’s public doc page used in research shows `clientCreate` explicitly; **`RequestCreateInput` must be confirmed in Developer Center → Test in GraphiQL → Docs** before coding. Expected pattern (illustrative—**verify field names**):

```graphql
mutation RequestCreate($input: RequestCreateInput!) {
  requestCreate(input: $input) {
    request {
      id
    }
    userErrors {
      message
      path
    }
  }
}
```

**Illustrative variables** (replace with schema-accurate fields after GraphiQL check):

```json
{
  "input": {
    "clientId": "<client id returned from clientCreate>",
    "title": "Website lead — free estimate",
    "note": "Zip: 84101 | Source: david-water-website"
  }
}
```

If `requestCreate` requires a **property** or **service address** id, the plan’s implementation phase may need an extra step (`propertyCreate` or default property)—discover via schema before building.

---

## 6. Twilio API call structure

- **Method:** `POST`
- **URL:** `https://api.twilio.com/2010-04-01/Accounts/{TWILIO_ACCOUNT_SID}/Messages.json`
- **Auth:** HTTP Basic: username = `TWILIO_ACCOUNT_SID`, password = `TWILIO_AUTH_TOKEN` (Node: `Buffer.from(sid + ':' + token).toString('base64')` for `Authorization` header), **or** use the official `twilio` npm package (adds dependency) with the same env vars.
- **Body:** `application/x-www-form-urlencoded` with at minimum:
  - `To`: lead phone in **E.164**
  - `From`: `TWILIO_FROM_NUMBER`
  - `Body`: short confirmation (e.g. “Thanks — we received your estimate request and will contact you shortly.”)
- **Success:** `201` with JSON containing `sid`, `status`.
- **Failure:** non-2xx; parse `message` / `code` from Twilio JSON for logs only.

---

## 7. Error handling strategy (by step)

| Step | Failure | User-visible response | SMS |
|------|---------|------------------------|-----|
| Invalid JSON / validation | Zod error | `400` + field errors | No |
| Missing Jobber env | Config | `500` generic | No |
| Token refresh | Network / 401 / invalid_grant | `502` or `500` generic | No |
| `clientCreate` GraphQL errors / userErrors | Jobber | `502` or `400` generic (“Could not save your request”) | No |
| `requestCreate` failure | Jobber | Same | No |
| Jobber complete, Twilio fails | Twilio | `200` + success payload | Log error, no throw |
| Unexpected exception | Code bug | `500` generic, log stack server-side | Only if Jobber not reached yet |

**Logging:** Use `console.error` or a structured logger with **no PII in production** where possible; at minimum redact phone to last 4 digits.

**Rate limiting (optional v1.1):** Consider IP-based or Turnstile later; out of scope unless audit requires.

---

## 8. Wiring the existing form

- **Primary form:** `components/booking.tsx` — inputs currently have **no `name` attributes** and no controlled state; implementation will add `name`/`id` (or RHF `register`), local `isSubmitting` / error state, and `fetch("/api/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, phone, zip }) })`.
- **UX:** Replace `alert` with existing **Sonner** toaster (`sonner` is already a dependency) or shadcn toast for success and error messages.
- **Other CTAs:** `header`, `benefits`, `final-cta` only scroll or link; no change unless they gain duplicate forms later.

**CORS:** Same-origin `fetch` from the Next site to `/api/leads` requires no CORS config. If a third-party domain ever posts leads, add explicit CORS then.

---

## 9. Testing approach (isolation → chain)

1. **Env sanity:** Local route that only checks `process.env` keys are set (dev-only debug route **not** shipped, or use a unit test with mocked `process.env`).
2. **Jobber token:** Script or temporary `GET` handler (guarded) that only calls `refreshAccessToken` and returns `{ ok: true }` without printing tokens—or log expiry time from JWT payload only.
3. **GraphQL in isolation:** Developer Center GraphiQL: run `clientCreate` then `requestCreate` manually with test data until variables are correct; copy exact shapes into `lib/jobber/mutations.ts`.
4. **Twilio in isolation:** Twilio Console test credentials or a one-off script sending to David’s phone; then switch to production credentials in Vercel.
5. **Callback route:** Use staging/preview URL registered in Jobber; complete OAuth; confirm token appears; set env; redeploy.
6. **Integrated `POST /api/leads`:** Use `curl` or REST client with JSON body; verify Jobber UI shows client + request; verify SMS received.
7. **Failure injection:** Temporarily wrong `JOBBER_CLIENT_SECRET` → expect no SMS; temporarily wrong Twilio token → expect `200` + Jobber rows + error in server logs.

---

## 10. Order of implementation

1. **`lib/jobber/config.ts`** + **`lib/jobber/oauth.ts`** — token URL, authorize URL constants; refresh + code exchange (testable with mocked `fetch`).
2. **`app/api/jobber/oauth/callback/route.ts`** — complete David handshake and document env copy steps.
3. **Set `JOBBER_REFRESH_TOKEN` in Vercel** (David) and verify **`lib/jobber/client.ts`** + **`lib/jobber/graphql.ts`** with a trivial `account` query from a throwaway route or script.
4. **`lib/jobber/mutations.ts`** — finalize `clientCreate` / `requestCreate` after GraphiQL schema confirmation.
5. **`lib/twilio/sms.ts`** — Twilio send helper.
6. **`lib/leads/schema.ts`** + **`app/api/leads/route.ts`** — full pipeline + error policy.
7. **`components/booking.tsx`** — wire form, loading state, toasts.
8. **End-to-end on Vercel preview/production** — OAuth URL uses deployed callback; form posts to deployed `/api/leads`.

---

PLAN.md created — ready for review.
