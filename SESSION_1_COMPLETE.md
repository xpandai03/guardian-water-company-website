# Session 1 — complete

Backend foundation for the Jobber lead-intake pipeline. End-to-end smoke test against David's live Jobber passed on 2026-05-14.

---

## What's built and working

### Library code (`lib/`)

| File | Purpose |
|---|---|
| `lib/jobber/config.ts` | Constant endpoints (`authorize`, `token`, `graphql`) + GraphQL version fallback. No secrets. |
| `lib/jobber/oauth.ts` | `exchangeCodeForTokens` (used by callback once) + `refreshAccessToken` (used on every API call). Throws `JobberOAuthError` on non-2xx. |
| `lib/jobber/graphql.ts` | `jobberGraphql<T>(query, vars, ctx)` POST wrapper. Sends `Authorization: Bearer`, `Content-Type: application/json`, `X-JOBBER-GRAPHQL-VERSION`. Throws `JobberGraphqlError` on transport / non-empty `errors[]`. |
| `lib/jobber/client.ts` | `getAccessToken()` reads env, calls `refreshAccessToken`, returns `{ accessToken, graphqlVersion }`. |
| `lib/jobber/mutations.ts` | `CLIENT_CREATE_MUTATION` + `REQUEST_CREATE_MUTATION` strings + full TypeScript input/response types. Locked against Jobber GraphQL `2025-04-16`. |
| `lib/leads/schema.ts` | Zod `leadSchema` for the 6-field intake. Phone normalized to E.164. Water-source enum (`city` / `well` / `unknown`) + `WATER_SOURCE_LABEL` map. |
| `lib/leads/submit-lead.ts` | `submitLead(input)` orchestrator: `clientCreate` (with inline property) → extract `clientId` + `propertyId` → `requestCreate`. Plus `buildRequestTitle` helper. |
| `lib/twilio/sms.ts` | **Stub.** Throws on call. Implemented in Session 2. |

### Routes (`app/api/`)

| Route | Status |
|---|---|
| `app/api/jobber/oauth/callback/route.ts` | **Live.** Handles `?code=...`, exchanges for tokens, renders an HTML page with copy-to-clipboard refresh token + Vercel paste instructions. No state validation (per BACKEND_PLAN.md §5). Logs only the last 4 chars of any token. |
| `app/api/leads/route.ts` | **Not built.** Session 2. |

### Scripts

| File | Purpose |
|---|---|
| `scripts/test-jobber-mutation.ts` | Standalone smoke test. Runs the same `submitLead` pipeline `/api/leads` will use, with hardcoded test data. **Confirmed working:** creates a real Client + Property + Request in David's Jobber. Run with `npx tsx --env-file=.env.local scripts/test-jobber-mutation.ts`. |

### Docs

| File | Purpose |
|---|---|
| `BACKEND_PLAN.md` | Authoritative backend design. Updated with Case C resolution, title strategy, version pin. |
| `FRONTEND_PLAN.md` | Frontend design (page inventory, components, tokens, form). Untouched in Session 1. |
| `PLAN.md` | Original Cursor-session backend plan. Superseded by `BACKEND_PLAN.md` but inherited sections still authoritative (see §9 of BACKEND_PLAN). |
| `README.md` | "Lead intake integration" section walks through env vars + OAuth handshake + Twilio rotation. |
| `.env.local.example` | Every env var with one-line description. Gitignored exception so it stays in source control. |

---

## What's deployed where

### GitHub (`origin/main`)

| Commit | What |
|---|---|
| `a3f8e94` | Initial v0 marketing site |
| `b8c7700` | feat: scaffold Jobber OAuth + lead intake backend |
| `b809a16` | feat(jobber): finalize Case C schema + smoke-test pipeline |
| `b5772e1` | chore(smoke-test): surface OAuth body + GraphQL errors |

`b5772e1` is **local only** as of writing — push pending (the harness gates direct pushes to `main`; you run `git push origin main` to release it).

### Vercel

Production deployment serves `b809a16` (the version that includes the OAuth callback + Case C lib code). Once `b5772e1` is pushed it will redeploy automatically — no behavioral change for the deployed app, since `b5772e1` only affects the local smoke script.

**Vercel env vars confirmed set (Production AND Preview):**

- `JOBBER_CLIENT_ID`
- `JOBBER_CLIENT_SECRET`
- `JOBBER_REDIRECT_URI` = `https://guardian-water-company-website.vercel.app/api/jobber/oauth/callback`
- `JOBBER_REFRESH_TOKEN` (real OAuth refresh token, captured from the eventually-successful authorize flow)
- `JOBBER_GRAPHQL_VERSION` = `2025-04-16`

**Not yet set (Session 2):** `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER`, optional `LEAD_CONFIRMATION_SMS_TEMPLATE`.

### Jobber Developer Center

- App registered in David's Jobber developer account.
- **Refresh-token rotation: OFF** (was ON initially; toggled OFF mid-session).
- OAuth Callback URL: matches `JOBBER_REDIRECT_URI` exactly.
- Scopes: sufficient for `clientCreate` + `requestCreate` (proven by the successful smoke test).

### Local

- `.env.local` populated with all five Jobber vars (gitignored). Required for running the smoke test.

---

## OAuth flow — current state

The OAuth authorization-code flow is **fully functional in production**, but only meant to be used once per token issuance:

1. Developer (you) opens the authorize URL in a browser logged into David's Jobber account.
2. Jobber redirects to `https://guardian-water-company-website.vercel.app/api/jobber/oauth/callback?code=...`.
3. Our route exchanges the code for `access_token` + `refresh_token` via Jobber's `/api/oauth/token` endpoint.
4. Page renders the refresh token in a copy-friendly box, with copy-to-clipboard JS.
5. You paste the refresh token into Vercel as `JOBBER_REFRESH_TOKEN` (Production + Preview), redeploy.

Once `JOBBER_REFRESH_TOKEN` is set, the deployed site uses `lib/jobber/client.ts → getAccessToken()` to mint a short-lived access token on every Jobber API call. **Refresh-token rotation is OFF**, so the stored token is stable until the Jobber app is re-authorized.

The callback route is **not gated**. It's harmless without a valid `code`/`state` from a real Jobber redirect, and Jobber rejects re-used codes — but if we want extra hygiene before launch, we can either delete the route file or wrap it in a basic-auth header check. Not blocking.

---

## Schema decisions locked in

### Case C — single `clientCreate` does client + property

`ClientCreateInput.properties[]` accepts inline `PropertyAttributes`. We don't need a separate `propertyCreate` mutation. Two GraphQL calls per lead: `clientCreate` returns both `client.id` and the auto-created `client.clientProperties.nodes[0].id`; then `requestCreate` attaches the request to both ids.

### Title-field strategy for homeowner notes

`requestDetails` on `RequestCreateInput` is a `FormInput` type — it does **not** accept free text. v1 puts the homeowner's water source + notes into the request `title` field instead. Format implemented in `buildRequestTitle`:

```
Website lead — {City Water | Well Water | Not Sure}              (notes empty)
Website lead — {label} — {first 80 chars of notes}…              (with notes, truncated)
```

Whole title capped at 140 chars defensively. v1.5 will attach a real Jobber Form via `FormInput` once David configures intake forms.

### Confirmed enum values

- Phone `description`: `MAIN`
- Email `description`: `MAIN`

### Confirmed type names

- `PhoneNumberCreateAttributes` (phones)
- `EmailCreateAttributes` (emails)
- `PropertyAttributes` (properties)
- `AddressAttributes` (address) — fields: `street1`, `street2`, `city`, `province`, `postalCode`, `country` (all optional `String`)

### Pinned Jobber GraphQL version

`2025-04-16` — set as `JOBBER_GRAPHQL_VERSION` in Vercel + `.env.local`. Re-run §3.3 introspection if bumping.

---

## Known limitations to address in Session 2

| # | Limitation | Resolution path |
|---|---|---|
| 1 | `/api/leads` POST route doesn't exist | Build per BACKEND_PLAN.md §6 (Session 2, step 1) |
| 2 | `lib/twilio/sms.ts` is a stub | Implement per BACKEND_PLAN.md §7 + PLAN.md §6 (Session 2, step 2) |
| 3 | The form on the site (`components/booking.tsx`) is the v0 3-field form with `alert()` on submit | Refactor to 6-field per BACKEND_PLAN.md §2 + FRONTEND_PLAN.md §6 (Session 2, step 3) |
| 4 | Province is hardcoded `"OH"` in `submitLead` | Acceptable for v1 NE Ohio; revisit if expanding service area |
| 5 | No `billingAddress` set on client (only inline property) | Acceptable; `propertyAddress` is what Requests/Quotes hang off. Add `billingAddress` later if Jobber's invoicing flow needs it. |
| 6 | Refresh-token rotation must remain OFF in Jobber | Documented in §4 of BACKEND_PLAN; if rotation is ever turned back ON, KV persistence layer required (out of scope for v1) |
| 7 | OAuth callback route is publicly reachable | Accept for v1 (Jobber rejects reused codes; route does nothing without one). Optional future hardening: gate behind a static `?secret=` query param or delete after handshake. |
| 8 | `buildRequestTitle` em-dash (`—`) — Jobber UI displays it fine, but if any downstream system trips on non-ASCII, swap for a hyphen | Easy revert; not currently an issue (smoke test rendered correctly in Jobber UI) |
| 9 | No idempotency / dedupe on duplicate submits | Acceptable for v1 traffic. Add if spam appears. |
| 10 | No rate limiting | Acceptable for v1. Add Vercel BotID before custom rate limiter if needed. |

---

## Session 1 exit criteria — all met

- [x] All backend lib files exist with implementations (or explicit `Session 2` stub markers for `lib/twilio/sms.ts`)
- [x] OAuth callback works end-to-end (real Jobber refresh token captured + stored)
- [x] `JOBBER_REFRESH_TOKEN` set in Vercel Production + Preview
- [x] `scripts/test-jobber-mutation.ts` successfully creates a real Client + Property + Request in David's Jobber from local dev
- [x] BACKEND_PLAN.md updated with the resolved address-mode case (Case C) + title-field strategy + GraphQL version pin
