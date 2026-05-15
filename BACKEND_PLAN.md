# Backend implementation plan: Jobber lead intake + Twilio SMS (revised)

This file supersedes `PLAN.md` for the lead intake pipeline. Anything in `PLAN.md` not contradicted here still applies.

## 0. Plan corrections (what changed since `PLAN.md`)

| # | Original `PLAN.md` assumption | Correction | Source |
|---|---|---|---|
| 1 | Lead form is 3 fields: `name`, `phone`, `zip` | Lead form is **6 fields**: First Name, Last Name, Phone, Email, Street Address, Water Source, plus optional Additional Info textarea | David's expanded brief |
| 2 | Form lives only in `components/booking.tsx` | Form is rebuilt as `components/estimate-form.tsx` and is reused on `/contact`, the home final CTA strip, and (optionally) a 3-field hero variant | `FRONTEND_PLAN.md` §6 |
| 3 | `JOBBER_OAUTH_STATE_SECRET` is a required env var | **Dropped.** OAuth `state` CSRF protection is theatre for a one-time, manual-by-the-developer handshake; it adds operational complexity (cookie + signing) for no real risk surface | See §5 |
| 4 | `requestCreate` variables are illustrative; field names "to be confirmed" | **Resolved (2026-05-14):** `ClientCreateInput.properties[]` accepts an inline `PropertyAttributes` — so we create client + property in a single `clientCreate` call (Case C, better than the original A/B options), then `requestCreate` with both ids. `requestDetails` is `FormInput`-only and unusable for free text in v1; homeowner notes go in the request `title`. See §3.3 / §3.4 | Live introspection + test mutation in Jobber GraphiQL |
| 5 | "Set `JOBBER_REFRESH_TOKEN` in Vercel" | Plus an **explicit decision** about Jobber refresh-token rotation: either turn rotation OFF in the app config (simplest), or add KV/Postgres persistence. The original plan flagged this as a TBD; we resolve it in §4 | See §4 |
| 6 | n8n / Zapier / Sheets backups discussed conceptually | **Confirmed dropped.** Single Vercel-native pipeline only. No DB, no Sheets, no middleware. | David's brief |
| 7 | Calendar booking left implicit | **Explicitly deferred to V1.5.** No availability lookups in v1. See §8 | David's brief |
| 8 | SMS body left as a sentence | Three candidate templates drafted in §7 | This doc |

---

## 1. Updated file structure (deltas vs `PLAN.md` §1)

The file layout in `PLAN.md` §1 is good. Confirmed deltas:

| Path | Status vs PLAN.md |
|---|---|
| `app/api/jobber/oauth/callback/route.ts` | Same purpose; remove `state` cookie/HMAC handling per §5 |
| `app/api/leads/route.ts` | Same purpose; payload shape changes per §2 |
| `lib/jobber/config.ts` | Same |
| `lib/jobber/oauth.ts` | Same |
| `lib/jobber/graphql.ts` | Same |
| `lib/jobber/client.ts` | Same; rotation handling per §4 |
| `lib/jobber/mutations.ts` | **Updated mutation strings + variable shapes** per §3 |
| `lib/twilio/sms.ts` | Same |
| `lib/leads/schema.ts` | **Replaced** with the 6-field schema in §2 |
| `lib/leads/submit-lead.ts` | Same (recommended pure helper) |
| `components/estimate-form.tsx` | New; replaces `components/booking.tsx` per FRONTEND_PLAN.md |

No new lib files required.

---

## 2. Lead schema — Zod (replaces `PLAN.md` §4 step 2 and §5 examples)

### 2.1 Fields

```ts
// lib/leads/schema.ts
import { z } from "zod";

export const WATER_SOURCES = ["city", "well", "unknown"] as const;
export type WaterSource = (typeof WATER_SOURCES)[number];

export const leadSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(80),
  lastName:  z.string().trim().min(1, "Last name is required").max(80),
  phone:     z
    .string()
    .trim()
    .transform((v) => v.replace(/[^\d+]/g, ""))
    .refine((v) => /^(\+1)?\d{10}$/.test(v), "Enter a valid US phone number")
    .transform((v) => (v.startsWith("+1") ? v : `+1${v}`)),     // normalize to E.164
  email:     z.string().trim().email("Enter a valid email").max(254),
  street:    z.string().trim().min(3, "Street address is required").max(200),
  waterSource: z.enum(WATER_SOURCES),
  notes:     z.string().trim().max(2000).optional().default(""),
  // TCPA-style SMS consent — required if checkbox is in UI; default true if we omit the checkbox
  smsConsent: z.boolean().default(true),
});

export type LeadInput = z.infer<typeof leadSchema>;
```

### 2.2 Notes

- `phone` is normalized server-side **after** client-side normalization, so we never trust the wire value.
- `street` is one free-text line in v1. Jobber's address structure splits street/city/state/zip; for v1 we ship the entire string in `street1` and rely on David or Jobber's address parsing to refine. Discoverable in §3.
- `waterSource` is stored as a short enum but mapped to a human label in the request note (§3.3) so it's legible to David inside Jobber.
- `notes` is included verbatim in the Jobber request body so David sees the homeowner's words.
- Empty-string `notes` is valid; it just won't add anything to the request body.

---

## 3. Jobber GraphQL mutations (revised)

### 3.1 Endpoint, headers — unchanged from `PLAN.md` §5

`POST https://api.getjobber.com/api/graphql` with `Authorization: Bearer <access>`, `Content-Type: application/json`, `X-JOBBER-GRAPHQL-VERSION: <pinned version>`.

### 3.2 `clientCreate` — final shape (Case C)

`clientCreate` carries the inline property attach. The mutation requests both `client.id` and the auto-created `client.clientProperties.nodes[].id` so we have the propertyId for `requestCreate` without a second round-trip.

```graphql
mutation ClientCreate($input: ClientCreateInput!) {
  clientCreate(input: $input) {
    client {
      id
      firstName
      lastName
      clientProperties {
        nodes { id }
      }
    }
    userErrors { message path }
  }
}
```

Variables (live-tested against Jobber GraphQL version `2025-04-16`):

```jsonc
{
  "input": {
    "firstName": "Jane",
    "lastName":  "Doe",
    "emails":  [ { "description": "MAIN", "primary": true, "address": "jane@example.com" } ],
    "phones":  [ { "description": "MAIN", "primary": true, "number":  "+12165550199"     } ],
    "properties": [
      { "address": { "street1": "123 Maple Ave", "province": "OH" } }
    ]
  }
}
```

**Confirmed schema details (don't re-verify unless bumping `JOBBER_GRAPHQL_VERSION`):**

- `phones[]` type: `PhoneNumberCreateAttributes`. `description` enum: `MAIN` works for both phone and email; that's what Jobber's UI labels as the primary contact.
- `emails[]` type: `EmailCreateAttributes`. Address goes in `.address`, not `.value` or `.email`.
- `properties[]` type: `PropertyAttributes`. `address` is `NON_NULL`; all other property fields are optional.
- `AddressAttributes`: `street1`, `street2`, `city`, `province`, `postalCode`, `country` — all optional `String`. Jobber uses `province` for the US state.
- `billingAddress` is also `AddressAttributes`. v1 uses inline `properties[]` instead so the address attaches to the property record (which Requests/Quotes hang off of) rather than just the client billing record.

### 3.3 `requestCreate` — final shape (Case C, resolved 2026-05-14)

**Resolution:** `ClientCreateInput.properties[]` accepts inline `PropertyAttributes`. We don't need a standalone `propertyCreate` call. The flow is:

1. `clientCreate` with inline `properties[]` → returns `client.id` AND `client.clientProperties.nodes[0].id`.
2. `requestCreate` with both ids + a formatted title.

That's it. Two calls. No `propertyCreate` mutation in the v1 codebase.

```graphql
mutation RequestCreate($input: RequestCreateInput!) {
  requestCreate(input: $input) {
    request { id title }
    userErrors { message path }
  }
}
```

```jsonc
{
  "input": {
    "clientId":   "<from clientCreate.client.id>",
    "propertyId": "<from clientCreate.client.clientProperties.nodes[0].id>",
    "title":      "Website lead — City Water — Water tastes like a swimming pool"
  }
}
```

**Confirmed schema details:**

- `RequestCreateInput.clientId` is `NON_NULL`. `propertyId` and `title` are optional in the schema; we always send both anyway.
- **`requestDetails` is `FormInput`-only** — it does NOT accept free text. v1 puts the homeowner's water-source + notes in the `title` field instead (see §3.4 below). v1.5 will attach a real Jobber Form via `FormInput` once David configures intake forms in his Jobber.

#### Historical: Cases A and B (what we considered before introspection)

Originally this section described two cases — Case A (inline property in `requestCreate`) vs Case B (separate `propertyCreate` step). Live introspection on `2025-04-16` revealed Case C: the inline property attach lives on `clientCreate`, not `requestCreate`. Both A and B are obsolete. The introspection query if we ever need to re-verify against a newer Jobber API version:

```graphql
{
  __type(name: "ClientCreateInput")  { inputFields { name type { name kind ofType { name kind } } } }
  __type(name: "RequestCreateInput") { inputFields { name type { name kind ofType { name kind } } } }
  __type(name: "PropertyAttributes") { inputFields { name type { name kind ofType { name kind } } } }
  __type(name: "AddressAttributes")  { inputFields { name type { name kind ofType { name kind } } } }
}
```

### 3.4 Request `title` strategy (v1)

Because `requestDetails` is `FormInput`-only, the request `title` is the single place homeowner context reaches David's Jobber UI. Format:

```
Website lead — {waterSourceLabel}                       (notes empty)
Website lead — {waterSourceLabel} — {notesFirst80Chars}  (with notes)
```

Examples:

```
Website lead — City Water — Water tastes like a swimming pool
Website lead — Well Water
Website lead — Not Sure — Yellow stains on bathtub, low pressure
```

Rules:

- `{waterSourceLabel}` mapping: `city → City Water`, `well → Well Water`, `unknown → Not Sure`.
- If notes is empty/whitespace, omit the trailing ` — `.
- If notes exceeds 80 characters, truncate to 80 + `…`.
- Defensive cap on the whole title at 140 characters.

Implementation: `buildRequestTitle` in `lib/leads/submit-lead.ts`.

The `"Website lead — "` prefix makes leads from this site immediately distinguishable from any other intake David adds later.

---

## 4. Jobber refresh-token rotation — explicit decision

`PLAN.md` §2 flagged this as TBD. Resolution:

**Default for v1: turn rotation OFF in the Jobber app config**, if the Developer Center allows it. This makes the refresh token a stable secret and lets us put it in Vercel env vars exactly like every other secret. Trade-off: a leaked refresh token is good until manually revoked. For a single-tenant private app behind a server-only API route, this is acceptable; David's risk surface is limited.

**Fallback if rotation must stay on:** persist the refresh token in **Vercel KV** (Marketplace integration → Upstash Redis) under a single key `jobber:refresh_token`. `lib/jobber/client.ts` reads from KV first, falls back to `process.env.JOBBER_REFRESH_TOKEN` (the bootstrap value), and writes back to KV on every refresh. KV cost at this volume is essentially zero.

**Order of operations:** during implementation, check the Jobber Developer Center → app settings → "Refresh token rotation." If toggleable, leave it off and skip the KV layer. If not toggleable and on by default, add the KV layer before go-live.

---

## 5. Drop `JOBBER_OAUTH_STATE_SECRET` — rationale

`PLAN.md` §2 listed `JOBBER_OAUTH_STATE_SECRET` as recommended for HMAC-signing the OAuth `state` parameter. We're removing it.

**Why drop it:**

- The OAuth callback route is used **once**, by the developer (not an end user), to mint the long-lived refresh token. After that, the route can be deleted, gated behind a basic auth check, or left dormant — it's not part of any user journey.
- The CSRF threat model `state` protects against (a malicious site getting a victim to complete an OAuth flow they didn't initiate) doesn't apply when the developer is the one clicking the authorize link and pasting tokens. There's no victim to trick.
- Adding a signed cookie + HMAC validation adds two failure modes (cookie domain mismatch on Vercel previews, HMAC misconfig) for zero realistic protection in this flow.

**What we keep instead:** the `state` query parameter is still sent (Jobber may require it; some authorize servers reject empty state), but we generate it server-side, do not persist it, and don't validate it on the callback. If David's threat model ever grows to "anyone could try to bind their Jobber to my app" — e.g. multi-tenant — we add the proper OAuth state flow then.

`PLAN.md` §3.2 and §3.3 are simplified accordingly: no cookie, no HMAC, no state validation.

---

## 6. Lead-submit route logic (revised flow)

`POST /api/leads`

1. **Parse + Validate** request body via `leadSchema` (§2). On error, `400` with field errors via `error.flatten().fieldErrors`. **No SMS, no Jobber call.**
2. **Get Jobber access token** via `getAccessToken()` (refresh-token flow). On token failure → `502` generic. **No SMS.**
3. **`clientCreate`** with `firstName`, `lastName`, `emails[0]`, `phones[0]`, and inline `properties[0].address` (street1 + `province: "OH"`). Inspect both top-level `errors` and `data.clientCreate.userErrors`. On any error → `502` generic, **no SMS**. Extract `client.id` AND `client.clientProperties.nodes[0].id`.
4. **`requestCreate`** with `clientId`, `propertyId`, and a `title` formatted by `buildRequestTitle` (§3.4). On error → `502`, **no SMS**, log `clientId` + `propertyId` so David can manually clean up the orphan client/property.
6. **Twilio SMS** — fire-and-respond. If `smsConsent === true`, send confirmation per §7. **Twilio failure does not fail the request.**
7. **Response:** `201` with `{ ok: true, jobber: { clientId, requestId }, sms: "sent" | "failed" | "skipped" }`. The `sms` field is internal-debug-only; can be omitted from the public response shape if we prefer to be tight-lipped.

**Idempotency:** none in v1. Duplicate submits make duplicate clients. Acceptable for current volume.

**Rate limiting:** none in v1. If spam shows up, add Vercel BotID (one-line install) before any custom rate limiter.

---

## 7. SMS template — three candidates

Constraints: ≤ 160 chars to stay 1-segment (cheap), no all-caps, no shortlinks (carrier filters). Use `{firstName}` only — no other PII.

**Candidate A — Warm + concise (78 chars, RECOMMENDED)**

```
Hi {firstName}, thanks for reaching out to Guardian Water. We'll call you within one business day. — David
```

**Candidate B — Action-forward**

```
Thanks {firstName}! Your free water test request is in. We'll call within 1 business day to schedule. Reply STOP to opt out.
```

**Candidate C — Short + signed**

```
Got your request, {firstName} — we'll be in touch soon. Questions? Call (XXX) XXX-XXXX. — Guardian Water
```

**Recommendation:** Candidate A. Warm tone, signed by David personally (high trust for local services), fits 1 segment, no awkward "Reply STOP" friction (we add STOP language only if our SMS volume grows or carriers start filtering — for transactional confirmation after a form submit, opt-in is implicit and STOP is auto-handled by Twilio).

The chosen template lives in `LEAD_CONFIRMATION_SMS_TEMPLATE` env var (per `PLAN.md` §2). We keep `{firstName}` as the only template variable.

---

## 8. Calendar booking — explicitly deferred to V1.5

David's brief lists no calendar/availability requirement for v1. The form is a lead intake, not a booking. **No Jobber availability or scheduling APIs are wired in v1.**

### V1.5 plan (when David asks for it)

Jobber exposes scheduling data through its GraphQL API. When we add booking, the implementation path is:

1. **Read availability:** add a `lib/jobber/availability.ts` helper that queries Jobber for free time slots for a date range. The exact query (`scheduledItems`, `users`, `availabilities`) needs GraphiQL discovery; Jobber has historically had separate read endpoints for this.
2. **Front-end:** add a date+time picker to the form, gated behind a feature flag. Show only slots Jobber returns as free.
3. **Write the appointment:** after `requestCreate`, call `visitCreate` (or `assessmentCreate` for an estimate visit) on the request with the chosen slot.
4. **Notify:** SMS confirmation gets a real "{date} at {time}" instead of "within one business day."
5. **Edge cases to handle:** slot grabbed concurrently between availability fetch and submit (re-check just before write), customer in different timezone (display in NE Ohio local + UTC), reschedule/cancel link emailed to the customer.

This work is roughly 2–3 days once Jobber's scheduling schema is mapped. Keep the v1 schema and route shape compatible — adding optional `appointmentSlot` to the lead payload later is an additive change.

---

## 9. Inherited from `PLAN.md` (still authoritative)

The following sections of `PLAN.md` apply unchanged:

- **§3.1** Jobber Developer Center setup (create app, scopes, callback URL, capture client id/secret).
- **§3.3** Callback handler steps 1, 3–7 (everything except the dropped state validation per §5 above).
- **§5.1** `clientCreate` mutation shape (with the variable additions in §3.2 above).
- **§6** Twilio API call structure (Basic auth, form-encoded body, `To`/`From`/`Body`).
- **§7** Error handling table — extend "validation" row to cover all 6 fields; otherwise unchanged.
- **§8** Form-wiring approach (`react-hook-form` + Sonner toaster), updated for 6 fields per `FRONTEND_PLAN.md` §6.
- **§9** Testing approach (env sanity → token → GraphQL in GraphiQL → Twilio test message → callback dry run → integrated POST).
- **§10** Order of implementation — apply, but step 4 ("finalize mutations after GraphiQL check") expands to also resolve the address-mode decision in §3.3 above.

---

## 10. Environment variables (final list for v1)

| Variable | Required | Notes |
|---|---|---|
| `JOBBER_CLIENT_ID` | yes | OAuth app client id |
| `JOBBER_CLIENT_SECRET` | yes | server-only |
| `JOBBER_REDIRECT_URI` | yes (handshake) | exact registered callback URL |
| `JOBBER_REFRESH_TOKEN` | yes (post-handshake) | static if rotation off; KV-backed if rotation on per §4 |
| `JOBBER_GRAPHQL_VERSION` | yes | Pinned API version we validated. **v1 confirmed on `2025-04-16`.** Bump after re-running the §3.3 introspection query against the new version. |
| `TWILIO_ACCOUNT_SID` | yes | |
| `TWILIO_AUTH_TOKEN` | yes | server-only |
| `TWILIO_FROM_NUMBER` | yes | E.164 |
| `LEAD_CONFIRMATION_SMS_TEMPLATE` | optional | falls back to baked-in Candidate A |
| `KV_REST_API_URL` / `KV_REST_API_TOKEN` | only if §4 fallback applies | auto-provisioned by Marketplace |

**Removed:** `JOBBER_OAUTH_STATE_SECRET` (§5).
