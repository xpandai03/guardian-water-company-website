# AUDIT — Phase A (Contact Form)

Read-only investigation of the codebase as it stands on `main` (in sync with
`origin/main`). No files were modified. Date: 2026-05-21.

Purpose: establish exactly what exists before planning the `/contact` form and
its wiring. The plan lives in `PHASE_A_PLAN.md`.

---

## 1. App Router structure

### Routes that exist

| Route | File | Status |
|---|---|---|
| `/` | `app/page.tsx` | ✅ 200 — home composition (Phase 2) |
| `/api/leads` | `app/api/leads/route.ts` | ✅ `POST` (201/400/500/502), `GET` (405) |
| `/api/jobber/oauth/callback` | `app/api/jobber/oauth/callback/route.ts` | ✅ one-time OAuth handshake |

That is the **entire** routable surface. `app/layout.tsx` + `app/globals.css`
are the only other files in `app/`.

### Routes that 404 (linked from the UI but not built)

| Route | Linked from | Notes |
|---|---|---|
| `/contact` | Header (desktop nav, mobile nav, "Get an Estimate" ×2), `HomeHero`, `CtaStrip` | **This is the Phase A target.** |
| `/about` | Header, Footer | Separate phase |
| `/blog` | Header, Footer | Separate phase |
| `/services/whole-house-filtration` | Header dropdown, Footer | Separate phase |
| `/services/water-softeners` | Header dropdown, Footer | Separate phase |
| `/services/reverse-osmosis` | Header dropdown, Footer | Separate phase |
| `/services` | *(not linked anywhere)* | Header "Services" is a dropdown trigger, not a link |
| `/privacy` | Footer | Separate phase |
| `/terms` | Footer | Separate phase |

There is **no `app/not-found.tsx`** — all of the above currently render Next's
default 404 page.

### `app/page.tsx` — home composition (Phase 2 output)

Section order (each non-hero section wrapped in `<AnimateInView>` for the
scroll-triggered fade+rise):

```
<Header />
<main>
  <HomeHero />          (renders immediately, above the fold)
  <TrustStrip />
  <ServicesOverview />
  <WaterEducation />
  <ProcessSteps />
  <Benefits />
  <Testimonials />
  <CtaStrip />
</main>
<Footer />
```

### Header navigation links (`components/header.tsx`)

- Logo → `/`
- Desktop nav: `About` → `/about` · `Services` (dropdown, no own link) · `Blog` → `/blog` · `Contact` → `/contact`
- Services dropdown items: `/services/whole-house-filtration`, `/services/water-softeners`, `/services/reverse-osmosis`
- "Get an Estimate" button (desktop + mobile) → `/contact`
- Mobile drawer mirrors the same links.

### Footer navigation links (`components/footer.tsx`)

- Services column: `/services/whole-house-filtration`, `/services/water-softeners`, `/services/reverse-osmosis`
- Company column: `/about`, `/blog`, `/contact`
- Legal: `/privacy`, `/terms`
- NAP block is all placeholder (`(xxx) xxx-xxxx`, `hello@guardianwater.com`, "Serving Northeast Ohio") with `TODO(david)` markers.

> **Divergence flag (not a Phase A concern):** Header + Footer use **system-type**
> service URLs (`whole-house-filtration`, `water-softeners`, `reverse-osmosis`).
> David's May 15 email asks for a **water-source** structure
> (`/services/city-water`, `/services/well-water`, `/services/ro-systems`).
> These nav hrefs will need reconciling in the service-pages phase, after the
> David meeting. Out of scope for the contact form.

---

## 2. Existing form-related code

### `components/booking.tsx` — CONFIRMED UNUSED

`grep` across `app/` + `components/` finds **zero imports** of `Booking`; the
only hit is the file's own definition. It is not in `app/page.tsx`.

It is a legacy stub from before Phase 2:
- 3 fields only (First Name, Phone, Zip Code) — does not match the 8-field schema.
- Fake submit: `handleSubmit` just calls `alert(...)` — never hits the API.
- Hardcoded phone `(435) 901-5045` (a Utah area code, not NE Ohio).
- Plain `<img>` to `/hero-team.jpg`.

It is dead code and **must not** be reused. See plan for disposition.

### `components/estimate-form.tsx` — DOES NOT EXIST

Confirmed. No `components/contact/` directory exists either.

### Lead schema — `lib/leads/schema.ts` (the form must match this exactly)

`leadSchema` (Zod) — **8 keys**, not 6:

| Key | Rule |
|---|---|
| `firstName` | `string`, trim, min 1 ("First name is required"), max 80 |
| `lastName` | `string`, trim, min 1 ("Last name is required"), max 80 |
| `phone` | `string`, trim → strips all non-`[\d+]` → must match `/^(\+1)?\d{10}$/` ("Enter a valid US phone number") → normalized to `+1XXXXXXXXXX` |
| `email` | `string`, trim, `.email()` ("Enter a valid email"), max 254 |
| `street` | `string`, trim, min 3 ("Street address is required"), max 200 |
| `waterSource` | `z.enum(["city","well","unknown"])` — **no default** (required selection) |
| `notes` | `string`, trim, max 2000, `.optional().default("")` |
| `smsConsent` | `z.boolean().default(true)` |

Also exported: `WATER_SOURCES`, `WaterSource` type, `LeadInput` (= `z.infer`,
the **output** type), and `WATER_SOURCE_LABEL`:
`{ city: "City Water", well: "Well Water", unknown: "Not Sure" }`.

`schema.ts` imports **only `zod`** — no server-only modules — so it is safe to
import into a client component. (`submit-lead.ts`, by contrast, pulls in Jobber
server code and must never be imported client-side.)

> **⚠️ Flag 1 — `smsConsent` default vs TCPA "unchecked by default":**
> The brief wants the TCPA SMS-consent checkbox to render **unchecked**. The
> schema currently has `smsConsent: z.boolean().default(true)`. `.default(true)`
> only fires when the key is *absent* from the payload. As long as the form
> renders a controlled checkbox initialized to `false` and always sends the
> boolean, the submitted value is `false` — correct, no schema change required.
> But `.default(true)` is semantically misleading for a TCPA flow. Surfacing it
> for Raunek's decision (see plan §3 / §5). **No source file is modified in this
> phase without your approval.**

> **⚠️ Flag 2 — input vs output type:** `leadSchema` has a transform (`phone`)
> and defaults (`notes`, `smsConsent`), so `z.input<typeof leadSchema>` ≠
> `z.output<typeof leadSchema>` (= `LeadInput`). This is the standard
> react-hook-form + `zodResolver` typing wrinkle — `defaultValues` is typed
> against the input shape, the resolved/submitted value against the output
> shape. Build-phase implementation detail, noted so it is not a surprise.

---

## 3. API route status

### `app/api/leads/route.ts`

- `runtime = "nodejs"`, `dynamic = "force-dynamic"`.
- `POST` flow: parse JSON → `leadSchema.safeParse` → `submitLead(parsed.data)`.
- `GET` → `405` (explicit, so probes don't get a confusing 404).

**Request payload:** JSON body matching `leadSchema` (the 8 keys above).

**Response shapes:**

| Status | Body | When |
|---|---|---|
| `201` | `{ ok: true, clientId, requestId }` | Success |
| `400` | `{ ok: false, error: "Request body must be valid JSON" }` | Body is not JSON |
| `400` | `{ ok: false, error: "Validation failed", fieldErrors: { <field>: string[] } }` | Zod validation failed |
| `502` | `{ ok: false, error: "Could not submit your request, please try again" }` | Jobber OAuth / GraphQL / mutation error |
| `500` | `{ ok: false, error: "Could not submit your request, please try again" }` | Any other (config / code) error |
| `405` | `{ ok: false, error: "Method not allowed — use POST" }` | `GET` |

`fieldErrors` is `parsed.error.flatten().fieldErrors` — keyed by field name,
each value a `string[]`. This lets the client map server-side validation back
onto individual fields if desired.

### `lib/leads/submit-lead.ts`

- `submitLead(input: LeadInput)` → two Jobber GraphQL calls: `clientCreate`
  (client + inline property) then `requestCreate`.
- Returns `{ clientId, propertyId, requestId }`.
- Throws `JobberMutationError` on `userErrors`; route maps it to `502`.
- `buildRequestTitle()` packs water-source + notes into the Jobber request
  title (`requestDetails` is FormInput-only in the live schema).
- The route has a `TODO(session-2b)` to fire a Twilio confirmation SMS after a
  successful lead — **deferred, not Phase A**.

This route is proven working (curl + smoke test against David's real Jobber CRM
in a prior session). Phase A only needs to *call* it.

---

## 4. UI library inventory

`components/ui/` holds ~60 shadcn/ui components. Relevant to the form, all
present and ready to use:

| Component | File | Use in form |
|---|---|---|
| Form (RHF wrapper) | `ui/form.tsx` | `Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormMessage`, `FormDescription` |
| Input | `ui/input.tsx` | text fields |
| Textarea | `ui/textarea.tsx` | `notes` |
| Select | `ui/select.tsx` | `waterSource` |
| Checkbox | `ui/checkbox.tsx` | `smsConsent` |
| Label | `ui/label.tsx` | (used internally by Form) |
| Button | `ui/button.tsx` | submit |
| Card | `ui/card.tsx` | form container / business-info card |
| Sonner Toaster | `ui/sonner.tsx` | error toast |
| Spinner | `ui/spinner.tsx` | `Loader2Icon` + `animate-spin`, loading state |

### Dependencies (`package.json`)

- `react-hook-form` `^7.60.0` ✅
- `@hookform/resolvers` `^3.10.0` ✅ (the brief's "resolvs" typo = this)
- `zod` `3.25.76` ✅
- `sonner` `^1.7.4` ✅

### Toaster mount

`<Toaster theme="light" position="top-center" richColors closeButton />` is
mounted in `app/layout.tsx:41` (Phase 1 work) — confirmed. `sonner.tsx` reads
`useTheme()` from `next-themes`, but the explicit `theme="light"` prop overrides
it. `toast()` calls from the form will work site-wide with no extra setup.

---

## 5. Design tokens + styling primitives

### Locked color tokens (`app/globals.css`, Phase 1 — do not change)

Relevant to the form:

| Token | Value | Use |
|---|---|---|
| `--background` / `--card` | `#ffffff` | white form card |
| `--accent-soft` | `#e6f6fa` | "aqua-soft" page background |
| `--accent` | `#1ba6c9` | brand aqua / focus ring |
| `--primary` | `#0e2a3a` | headlines |
| `--cta` | `#22a06b` | submit button (green, per David) |
| `--hero-bg` | `#0b3142` | dark hero band |
| `--border` / `--input` | `#e2ebef` | field borders |
| `--ring` | `#1ba6c9` | focus ring |
| `--destructive` | `#c93131` | error text |
| `--radius` | `0.5rem` | corner radius base |

Every token is mapped to a Tailwind utility via `@theme inline` — e.g.
`bg-card`, `bg-accent-soft`, `bg-cta`, `text-primary`, `border-border`. Dark
mode is intentionally unsupported.

### Layout primitives (`components/layout/`)

| Primitive | API | Notes |
|---|---|---|
| `Container` | `size`: `default` (max-w-7xl) · `narrow` (max-w-3xl) · `wide`. Adds `mx-auto px-4 sm:px-6 lg:px-8`. | Use `narrow` for a single-column form. |
| `Section` | `bg`: `default` · `muted` · `accentSoft` · `hero` · `primary`. Applies `py-16 md:py-24`. | `bg="accentSoft"` gives the aqua-soft page band. |
| `AnimateInView` | client component; `IntersectionObserver` fade-in + slide-up, fires once, respects `prefers-reduced-motion`. | Optional polish, not required for the form. |

---

## 6. Product assets

`product-pics/` is **untracked** (not yet `git add`-ed). Contents:

| File | Type |
|---|---|
| `ASP2.jpg` | product image |
| `FC-1000.png` | product image |
| `IMP.jpg` | product image |
| `IMPFE.jpg` | product image |
| `IMPRC.jpg` | product image |
| `IMPS.jpg` | product image |
| `Impression RO.jpg` | product image (filename has a space) |
| `ONE Filter.jpg` | product image (filename has a space) |
| `QuadPro-with-Carts.png` | product image |
| `Water-Right LOGO.jpg` | Water-Right partner logo (filename has a space) |
| `.DS_Store` | macOS junk — should not be committed |

→ 9 product images + 1 partner logo.

**Flag for a later phase (NOT Phase A):** these need to move to
`public/products/` for `next/image` to serve them. Three filenames contain
spaces — they should be kebab-cased on the move (spaces break URLs / are
error-prone). `next.config.mjs` sets `images.unoptimized: true`, so local
images need no `remotePatterns` config. **Do not touch `product-pics/` in the
contact-form phase.**

### Other untracked items

- `.pnpm-store/` — a pnpm content-addressable store, a build artifact. It is
  **not** in `.gitignore` and should never be committed. Recommend adding
  `.pnpm-store/` to `.gitignore` (trivial, can ride along in the Phase A PR or
  be done separately) and ensuring it is never staged.

---

## Summary for the plan

- `/contact` is the **only** route to create; all the links pointing at it
  (Header ×4, `HomeHero`, `CtaStrip`) already exist and will resolve the moment
  `app/contact/page.tsx` lands — **no home-page edits needed for wiring**.
- `leadSchema` is client-safe and is the single source of truth — reuse it,
  do not write a second schema.
- The API contract is fully known (§3) — the form posts JSON and handles
  `201` / `400+fieldErrors` / `502` / `500`.
- All required shadcn components + RHF + Zod + Sonner are installed and the
  Toaster is mounted. No dependency installs needed.
- Two open items for Raunek: the `smsConsent` `.default(true)` vs TCPA
  unchecked-by-default semantics (Flag 1), and `booking.tsx` disposition.
