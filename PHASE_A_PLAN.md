# PHASE A PLAN — Contact Form + Wiring

**Scope:** the `/contact` page and a working lead-capture form that POSTs to the
existing `/api/leads` route. Nothing else. Companion to `AUDIT_PHASE_A.md`.

**Explicitly NOT in scope:** service pages, about page, blog, design polish.
See §7.

**Goal of the phase:** attach the faucet to the existing Jobber plumbing — a
real form on the site that creates a real lead in David's CRM. "Bones, not
polish" — David refines UI after tomorrow's meeting.

---

## 1. New files to create

| File | Type | Purpose |
|---|---|---|
| `app/contact/page.tsx` | Server component | The `/contact` route. Renders `Header`, `ContactHero`, the form + business-info card in a two-column layout, `Footer`. Exports `metadata` (title "Contact" → template gives "Contact \| Guardian Water"). |
| `components/estimate-form.tsx` | Client component (`"use client"`) | The form itself — RHF + `zodResolver(leadSchema)`, 8 controls, loading / success / error states, POST to `/api/leads`. |
| `components/contact/contact-hero.tsx` | Server component | Page hero band — eyebrow + H1 + short subhead. No CTA buttons (the form is right below). |
| `components/contact/business-info-card.tsx` | Server component | Right-rail card — phone / hours / email / service area, all as **`TODO(david)` placeholders** (he hasn't finalized these). |

### Helper files — none required

- **Form schema:** reuse `leadSchema` from `lib/leads/schema.ts` directly.
  Confirmed client-safe (imports only `zod` — see `AUDIT_PHASE_A.md` §2). Do
  **not** create a second schema; the server re-validates with the same one.
- **API response type:** define a small `LeadApiResponse` type *inline* in
  `estimate-form.tsx` (the shape is documented in `AUDIT_PHASE_A.md` §3). Not
  worth a shared file for v1; can be promoted to `lib/leads/` later if other
  callers appear.

So: **4 new files, 0 new helper files.**

---

## 2. Files to MODIFY

**For the form to function: none.** The `/contact` links in `Header`,
`HomeHero`, and `CtaStrip` already exist — they 404 today only because the route
is missing. Creating `app/contact/page.tsx` makes all of them resolve. No
home-page composition file is touched.

Two **optional** modifications, each needing a Raunek decision — neither is
required to ship the form:

| File | Change | Why | Recommendation |
|---|---|---|---|
| `components/booking.tsx` | Delete | Confirmed dead code (0 imports — `AUDIT_PHASE_A.md` §2). Legacy stub with a fake `alert()` submit and a wrong-state hardcoded phone number. Leaving it invites someone reusing it by mistake. | **Delete it** in this PR — a 1-file, ~85-line removal, cleanly in the spirit of "wire up the real form". Low risk. Your call. |
| `.gitignore` | Add `.pnpm-store/` | `.pnpm-store/` is an untracked build artifact that must never be committed. | Add the one line so it can't be staged by accident. Trivial. |

> **Decision — home page CTA wiring (brief asked for both options):**
>
> - **Option A — link to `/contact` (recommended, zero code).** `CtaStrip`'s
>   "Get a Free Water Test" button, `HomeHero`'s CTA, and the Header's "Get an
>   Estimate" button **already** `href="/contact"`. Creating the route is the
>   entire wiring job. Nothing on the home page changes.
> - **Option B — inline form / scroll-to-form in the CTA Strip.** Would require
>   editing `components/cta-strip.tsx` to either embed `<EstimateForm />` or
>   change the button to an anchor scroll. More surface area, more to redo after
>   David's design feedback.
>
> **Recommendation: Option A for v1.** An inline CTA-Strip form is a v2 polish
> item. This keeps Phase A to "new files only, zero source edits" (booking.tsx
> deletion + .gitignore aside).

---

## 3. Form spec (locked — implement, do not redesign)

**Controls (8), in order:**

| # | Field | Control | Notes |
|---|---|---|---|
| 1 | `firstName` | `Input` text | required |
| 2 | `lastName` | `Input` text | required |
| 3 | `phone` | `Input` `type="tel"` | required; schema strips formatting + normalizes to `+1XXXXXXXXXX` |
| 4 | `email` | `Input` `type="email"` | required |
| 5 | `street` | `Input` text | required, min 3 |
| 6 | `waterSource` | `Select` | options: City Water / Well Water / Not Sure → `city` / `well` / `unknown`. No default — placeholder "Select your water source", user must pick. Labels from `WATER_SOURCE_LABEL`. |
| 7 | `notes` | `Textarea` | optional |
| 8 | `smsConsent` | `Checkbox` + label | TCPA SMS consent. **Renders UNCHECKED.** |

Lay 1+2 and (optionally) 3+4 as two-up on `sm:` and stack on mobile; 5–8 full
width. Use the shadcn `Form*` primitives so `FormMessage` renders Zod errors
per field.

**Validation:** `useForm({ resolver: zodResolver(leadSchema) })`. Server
re-validates with the same schema regardless. Per the input-vs-output type note
(`AUDIT_PHASE_A.md` §2, Flag 2), type the form generics carefully — `z.input`
for `defaultValues`, output for the submit handler.

**`defaultValues`:** `firstName/lastName/phone/email/street: ""`, `notes: ""`,
`smsConsent: false`, `waterSource: undefined` (forces a choice).

**Submit:** `POST /api/leads`, `Content-Type: application/json`, body =
validated values (RHF gives the resolved/transformed object). Because
`defaultValues` sets `smsConsent: false` and it is a controlled checkbox, the
boolean is always present in the payload — the schema's `.default(true)` never
fires. **Result: the form is the source of truth for consent, and it ships
`false` unless the user opts in.**

**States:**

- **Loading** — disable the submit button, swap its label/icon for the
  `Spinner` (`ui/spinner.tsx`), block double-submit. Disable inputs.
- **Success (`201`)** — replace the form card body with an inline thank-you
  message ("Thanks — we've got your request. David's team will reach out
  shortly."). Do not keep the empty form mounted.
- **Error** — `sonner` `toast.error(...)` with a retry affordance:
  - `400` with `fieldErrors` → map each onto its field via
    `form.setError(field, ...)` so messages show inline; toast a short
    "Please fix the highlighted fields."
  - `400` "must be valid JSON" → should not happen from our own client; treat
    as generic error.
  - `502` / `500` → toast the server's generic message ("Could not submit your
    request, please try again") + a "Try again" action that re-submits.
  - Network/`fetch` rejection → same generic toast + retry.
  - On any error, re-enable the form so the user can retry.

> **⚠️ Open item for Raunek — `smsConsent` schema default.** `leadSchema` has
> `smsConsent: z.boolean().default(true)`. The plan above makes the form send
> an explicit `false`, so behavior is TCPA-correct **without touching the
> schema**. But the `.default(true)` remains misleading for anyone reading the
> schema later. Options: (a) leave it, rely on the form always sending the
> boolean — **recommended for Phase A, zero risk**; (b) change it to
> `.default(false)` — a backend schema edit, technically outside this phase's
> "form only" scope. Flagging, not deciding. Default action: **(a)**.

---

## 4. CSS / token usage

Phase 1 tokens are locked — introduce **no new tokens or colors**. Mapping:

| Element | Token / utility |
|---|---|
| Page background band | `bg-accent-soft` (`#e6f6fa`) — via `Section bg="accentSoft"` |
| Form card | `bg-card` (white) + `border-border` + `rounded-xl` |
| Section width | `Container size="narrow"` (form) within `Container size="default"` for the two-column page |
| Field borders / focus | `border-input`, focus ring `--ring` (handled by shadcn `Input`/`Select` defaults) |
| Submit button | `bg-cta hover:bg-cta/90 text-cta-foreground` — matches existing CTAs |
| Headings | `text-primary` |
| Inline error text | `FormMessage` default (`text-destructive`) |
| Hero band | plain `bg-background` or `bg-accent-soft`; no dark hero needed |

Use the existing layout primitives (`Container`, `Section`) — do not hand-roll
max-width / padding. `AnimateInView` is optional and **not** required here
(no-polish phase).

---

## 5. Wiring decisions

- **Where the form is linked from:** nowhere new. The home page (`HomeHero`,
  `CtaStrip`) and `Header` already point at `/contact`. Creating the route is
  the wiring.
- **Inline form on the home page (CTA Strip)?** No — link to `/contact` only
  for v1. Inline CTA-Strip form is deferred to v2 polish (see §2, Option A/B).
- **Recommendation, restated:** `/contact` route only. No home-page edits.

After this phase, every currently-dead `/contact` link goes live; the other
404s (`/about`, `/blog`, `/services/*`, `/privacy`, `/terms`) stay 404 until
their own phases.

---

## 6. Testing approach

**Local (`npm run dev`):**

1. Navigate to `http://localhost:3000/contact` — page renders, no console errors.
2. Submit a **valid** lead → expect the thank-you state; confirm the lead
   (Client + Request) appears in **David's real Jobber CRM**.
3. Submit an **invalid** lead (e.g. blank required field, bad email, bad
   phone) → expect `400`, inline `FormMessage` errors, no network lead created.
4. Confirm loading state: button disabled + spinner during the request;
   no double-submit.
5. Run `npx tsc --noEmit` — `next.config.mjs` has
   `typescript.ignoreBuildErrors: true`, so the Vercel build will **not** catch
   type errors; check types manually.
6. `npm run lint`.

> Local step 2 requires the Jobber env vars (`JOBBER_*` in `.env.local`) to be
> populated. If `.env.local` is not set locally, do the live-Jobber check on
> the Vercel preview instead (where the vars are already configured).

**Vercel preview (pushed branch):**

7. Repeat steps 1–4 on the preview URL.
8. Verify a preview-submitted valid lead lands in Jobber.
9. Spot-check mobile width (the form stacks single-column).

**Pass criteria:** valid submit → `201` + Jobber lead + thank-you state;
invalid submit → `400` + inline errors + no lead; upstream failure → generic
toast + retry works.

---

## 7. Out of scope — explicitly deferred

- Twilio SMS confirmation (route has a `TODO(session-2b)`; do not add it here).
- Real phone number / business hours / email / address — David hasn't
  finalized them. `business-info-card.tsx` ships **`TODO(david)` placeholders**.
- The business-info right rail is **stubs only** — no map, no live hours logic.
- Design polish — animations, illustrations, fancy styling, hero imagery.
- Service pages (`/services`, `/services/*`), `/about`, `/blog`,
  `/privacy`, `/terms`.
- Reconciling the Header/Footer system-type service URLs with David's
  water-source structure (`AUDIT_PHASE_A.md` §1) — service-pages phase.
- Moving `product-pics/` → `public/products/` and kebab-casing filenames
  (`AUDIT_PHASE_A.md` §6) — service-pages phase. **Do not touch `product-pics/`.**
- Inline form in the CTA Strip — v2 polish.

---

## 8. Branch strategy

1. Branch from `main`: `feature/phase-a-contact-form`.
2. Commit only the Phase A files (the 4 new files; optionally the
   `booking.tsx` deletion + `.gitignore` line if approved). **Do not stage
   `product-pics/` or `.pnpm-store/`.**
3. Push the branch → Vercel builds a preview.
4. **Do not merge to `main`.** Raunek verifies on the preview, then merges via
   PR.

---

## 9. Estimated lines of code

| File | Action | Approx. lines |
|---|---|---|
| `components/estimate-form.tsx` | new | ~230–290 |
| `app/contact/page.tsx` | new | ~45–65 |
| `components/contact/business-info-card.tsx` | new | ~55–75 |
| `components/contact/contact-hero.tsx` | new | ~30–40 |
| `components/booking.tsx` | delete (optional) | −85 |
| `.gitignore` | +1 line (optional) | +1 |

**Net:** roughly **+360–470 lines added**, **0 source files modified** for
function (≈ −85 if `booking.tsx` is deleted). The bulk is `estimate-form.tsx`.

---

AUDIT_PHASE_A.md and PHASE_A_PLAN.md written. Ready for review. Do not start implementation.
