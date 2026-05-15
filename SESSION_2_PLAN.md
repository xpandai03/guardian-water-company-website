# Session 2 plan — `/api/leads` route + Twilio + form wiring

Session 1 built and proved the Jobber pipeline. Session 2 closes the loop: a public POST endpoint, Twilio confirmation SMS, and a real 6-field form on the live site.

**Source-of-truth references:**

- Route flow: `BACKEND_PLAN.md` §6
- Schema: `BACKEND_PLAN.md` §2 (already implemented in `lib/leads/schema.ts`)
- SMS: `BACKEND_PLAN.md` §7 + `PLAN.md` §6
- Form UX: `FRONTEND_PLAN.md` §6

---

## 1. Pre-flight: env vars to set BEFORE Session 2 starts

These four go into Vercel **Production + Preview** scopes AND your local `.env.local`. Without `TWILIO_FROM_NUMBER` (a provisioned Twilio phone number) the route still works against Jobber but the SMS path will hard-fail — so we want them all in place before kickoff.

| Var | Required | Source |
|---|---|---|
| `TWILIO_ACCOUNT_SID` | yes | Twilio Console → Account → Account SID |
| `TWILIO_AUTH_TOKEN` | yes | Twilio Console → Account → Auth Token (server-only) |
| `TWILIO_FROM_NUMBER` | yes | Twilio number in E.164 (e.g. `+12165550199`) — see §4 below for purchase steps |
| `LEAD_CONFIRMATION_SMS_TEMPLATE` | optional | If set, overrides the baked-in Candidate A copy. Format: any string with `{firstName}` placeholder. |

After saving in Vercel, **redeploy** (env var changes don't propagate to existing builds).

---

## 2. What we'll build, in order

The implementation order is route → twilio → form → e2e. Each step is independently verifiable, so a failure in one doesn't block the others.

### Step A — `app/api/leads/route.ts` (POST)

Implements BACKEND_PLAN.md §6 exactly. Single `POST` handler:

1. Parse JSON body. Reject non-JSON with 400.
2. `leadSchema.safeParse(body)` (already exists in `lib/leads/schema.ts`). On error → 400 with field errors via `error.flatten().fieldErrors`. **No SMS, no Jobber call.**
3. `submitLead(parsed.data)` (already exists in `lib/leads/submit-lead.ts`). Catch:
   - `JobberOAuthError` → 502 generic ("Could not save your request right now"). Server log includes status + last-4 token chars only.
   - `JobberGraphqlError` → 502 generic. Server log includes `graphqlErrors`.
   - `JobberMutationError` → 502 generic. Server log includes `userErrors`.
   - Any other `Error` → 500 generic.
   - **No SMS on any Jobber failure.**
4. On Jobber success, fire Twilio SMS (if `smsConsent === true`). Wrap in try/catch — Twilio failure is logged server-side but does NOT fail the response. The lead is already saved in Jobber; we don't punish the user for our SMS provider hiccups.
5. Respond 201 with `{ ok: true, jobber: { clientId, requestId } }`. Internal-only `sms: "sent" | "failed" | "skipped"` may be included; recommend omitting from public response and only logging server-side.

**Idempotency / rate limiting:** none in v1 (BACKEND_PLAN.md §6 final notes). Add Vercel BotID later if spam appears.

### Step B — `lib/twilio/sms.ts` implementation

Replace the Session 1 stub with a real implementation per PLAN.md §6:

- `POST https://api.twilio.com/2010-04-01/Accounts/{SID}/Messages.json`
- Auth: HTTP Basic, `Buffer.from(sid + ":" + token).toString("base64")`
- Body: `application/x-www-form-urlencoded` with `To`, `From`, `Body`
- Use Node `fetch` — no `twilio` npm package required (keeps the dep tree thin)
- Parse JSON response; return `{ sid, status }` on 2xx
- Throw a typed `TwilioSmsError` with status + parsed `code`/`message` on non-2xx (so the route handler can log without leaking phone numbers in plaintext — log `to` masked to last 4 only)

**Template loading:**
- Read `LEAD_CONFIRMATION_SMS_TEMPLATE` env var.
- If unset, use baked-in Candidate A: `"Hi {firstName}, thanks for reaching out to Delahunty Water Systems. We'll call you within one business day. — David"`
- `.replace("{firstName}", input.firstName)` — only one variable, no template engine needed.

**Edge cases:**
- If template doesn't contain `{firstName}` placeholder, send as-is (no error).
- If body length > 160 chars, log a warning (Twilio will split into multi-segment) but still send.

### Step C — Refactor `components/booking.tsx` (or replace with `EstimateForm`)

Per FRONTEND_PLAN.md §6. The current file is the v0 3-field form with `alert()` on submit. Two paths:

- **Path A (recommended):** create `components/estimate-form.tsx` per FRONTEND_PLAN.md §5 component breakdown, then make `booking.tsx` a thin wrapper that renders it inside the existing section layout. Keeps `booking.tsx`'s callers intact.
- **Path B:** refactor `booking.tsx` in place. Simpler diff but couples the form to its homepage layout.

Field order per FRONTEND_PLAN.md §6 table:

| Field | Type | Layout |
|---|---|---|
| First Name | `text` | 1/2 width md+ |
| Last Name | `text` | 1/2 width md+ |
| Phone | `tel` | 1/2 width md+ |
| Email | `email` | 1/2 width md+ |
| Street Address | `text` | full |
| Water Source | `select` (City Water / Well Water / Not Sure) | 1/2 width md+ |
| Additional Information | `textarea` | full |

**Validation/UX:**
- `react-hook-form` + `@hookform/resolvers/zod` (both in deps)
- Use `leadSchema` from `lib/leads/schema.ts` directly as the resolver — same Zod, same error messages on client + server
- Submit button disabled while pending; spinner inside button; "Sending…" label
- Inline field errors on blur or submit
- Success state: replace form card in-place with checkmark + "Thanks — we got your request" + secondary "Back to home" link. Also fire Sonner toast.
- Failure state: Sonner error toast + form stays populated for retry. Server-returned 4xx field errors mapped via RHF `setError`.

**TCPA-style consent checkbox** (from FRONTEND_PLAN.md §6): include the checkbox `"I agree to receive a follow-up text from Delahunty Water Systems"` as the 8th element. Default checked. Posts as `smsConsent: boolean`.

**Where the form lives in v1:** the existing `booking.tsx` instance on the home page is enough for this session. The dedicated `/contact` page lands in the broader frontend build (FRONTEND_PLAN.md §1) and will reuse the same component.

### Step D — End-to-end test

Once route + form are wired, the test path is the real one:

1. Open the deployed site in a browser.
2. Fill in the 6 fields with real values (your phone for SMS, real-looking address).
3. Submit.
4. Verify within ~5 seconds:
   - **Browser:** success state renders inline (not an alert).
   - **Jobber UI:** new Client + Property + Request appears with formatted title (`Website lead — {label} — {notes}`).
   - **Phone:** SMS arrives at the phone number you submitted, body matches the template with your first name.
5. Delete the test lead from Jobber.
6. Optional: also test the failure paths
   - Submit invalid email → inline field error, no Jobber call.
   - Temporarily corrupt `JOBBER_REFRESH_TOKEN` in Vercel preview → submit → expect generic error toast, no SMS, server log shows OAuth failure.

The smoke script (`scripts/test-jobber-mutation.ts`) stays as the offline verification path; it doesn't go through `/api/leads` so it won't catch route-handler bugs, but it remains valuable for verifying the Jobber pipeline in isolation.

---

## 3. Order of implementation (recommended)

1. **`lib/twilio/sms.ts`** — implement first because it's a small isolated unit and the route uses it. Verify in isolation with a one-off `scripts/test-sms.ts` (analogous to the Jobber smoke test) that just sends one SMS to your phone.
2. **`app/api/leads/route.ts`** — wire schema → submitLead → sms. Test with `curl` or REST client posting JSON.
3. **`components/estimate-form.tsx`** — the form. Test with the live API route on a Vercel preview deployment.
4. **End-to-end** — full Jobber + SMS verification per Step D above.

Each step ships a Vercel preview, so you can verify deltas independently.

**Estimated session size:** small. The route is ~80 lines, Twilio impl is ~60 lines, form is ~250 lines. Largest cognitive load is form polish (validation messaging, success state animation, mobile responsive checks).

---

## 4. Twilio number provisioning — guide for David

David needs an SMS-capable Twilio number before Session 2's E2E test. He can do this himself in 5 minutes:

1. **Create a Twilio account** at https://www.twilio.com if he doesn't already have one. Trial accounts work for testing but trial messages have a "Sent from your Twilio trial account" prefix — fine for verifying delivery, swap to a paid account before launch.
2. **Console → Phone Numbers → Manage → Buy a Number.** Filter by **Country: United States**, **Capabilities: SMS**. Pick a number with an Ohio area code if available (216 Cleveland, 330 Akron/Canton) — a local number gets higher reply rates than an out-of-state one. Cost: ~$1/month.
3. **Verify own phone (trial-only step).** On a trial account, Twilio only sends SMS to verified numbers. Add David's phone (and your phone, for testing) under Console → Phone Numbers → Manage → Verified Caller IDs. Skip this step on a paid account.
4. **Capture three values** to share (securely — same channel constraint as the Jobber secrets):
   - **Account SID** (Console → Account → API Keys & Tokens → Account Info)
   - **Auth Token** (same screen — click "Show" to reveal)
   - **The phone number** in E.164 format, e.g. `+12165551234`
5. Set the three values in Vercel (Production + Preview) as `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER`. Also add to local `.env.local` for testing.

**A2P 10DLC registration** (US carrier compliance): for sustained transactional SMS to US numbers, Twilio recommends registering an A2P 10DLC brand + campaign. Trial usage and low volume work without this; before going live with real homeowner traffic, David should complete the registration through Twilio Console → Messaging → Regulatory Compliance → A2P 10DLC. ~15 minutes of forms; reduces filtered-message rate. Mark as a launch checklist item, not a Session 2 blocker.

---

## 5. Open questions / parallel-work threads

These are independent of Session 2 and can be tackled in parallel by another agent or in a side session:

- **Frontend buildout per FRONTEND_PLAN.md** — the `/about`, `/services`, `/services/[slug]`, `/blog`, `/contact` pages don't exist yet. Session 2 only touches the home-page form. The full multi-page build is a separate workstream and the larger of the two remaining bodies of work.
- **Asset collection from David** — see FRONTEND_PLAN.md §9 (logo, photos, real phone number, Google reviews, etc.). Block on David, not on us.
- **Service-area + NAP details** — needed for footer, schema.org `LocalBusiness`, and "Proudly Serving" section. Block on David.
- **Initial blog topics** — for SEO/AEO traction. We can draft 3-5 starter posts in parallel once topics are agreed.
