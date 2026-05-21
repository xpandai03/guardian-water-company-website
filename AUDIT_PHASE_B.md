# AUDIT — Phase B (Service Pages + Kill All 404s)

Read-only investigation. No files modified. Date: 2026-05-21.
Companion: `PHASE_B_PLAN.md`.

---

## ⚠️ 0. Two contradictions with the stated Phase B context

Surfacing these first because they change the plan.

### 0.1 — Phase A is NOT merged to main

The brief says *"Phase A is merged to main. Production /contact works."*
**It is not.**

- `main` and `origin/main` are both at `45b0be6`
  (`feat(frontend): add scroll-triggered section animations`) — the Phase 2
  commit. No Phase A commits, no merge commit.
- The Phase A work lives only on branch `feature/phase-a-contact-form`
  (local + `origin/`), 4 commits ahead of main. **No PR exists**
  (`gh pr list` empty).
- That unmerged branch is the one currently checked out.
- Therefore `/contact` does **not** exist on `main` / production. It exists
  only on the Phase A branch.

**Resolution (confirmed with Raunek):** Phase A gets merged to `main` first
(via PR), then Phase B branches from the updated `main`. See `PHASE_B_PLAN.md`
§13. **Phase B implementation must not start until Phase A is merged.**

### 0.2 — Product images are NOT in `public/products/`

The brief says *"Product images already moved to public/products/ (10 files)."*
**They have not been moved.** `public/products/` does not exist.

All 10 files are still in the **untracked** `product-pics/` directory at the
repo root (unchanged since the Phase A session). Phase B implementation must
include moving them — see §5 and `PHASE_B_PLAN.md` §1 / §15.

---

## 1. Current route structure

Routable files under `app/`:

| Route | File | Status |
|---|---|---|
| `/` | `app/page.tsx` | ✅ exists |
| `/contact` | `app/contact/page.tsx` | ✅ exists **on the Phase A branch only** — not on `main` |
| `/api/leads` | `app/api/leads/route.ts` | ✅ POST/GET |
| `/api/jobber/oauth/callback` | `app/api/jobber/oauth/callback/route.ts` | ✅ |

`/contact` was built + verified in the Phase A session (tsc clean, production
build clean, local API validation tests passed). It is **functional on
`feature/phase-a-contact-form`**; it reaches `main` only when Phase A merges.

There is **no `app/not-found.tsx`** — every route below renders Next's default
404 page.

### Routes that 404 today (Phase B targets)

| Route | Phase B treatment |
|---|---|
| `/services` | Real hub page |
| `/services/city-water` | Real service page |
| `/services/well-water` | Real service page |
| `/services/ro-systems` | Real service page |
| `/about` | Real (minimal) page |
| `/blog` | Stub ("Coming Soon" + CTA) |
| `/privacy` | Stub (boilerplate) |
| `/terms` | Stub (boilerplate) |

The **old** service slugs (`/services/whole-house-filtration`,
`/services/water-softeners`, `/services/reverse-osmosis`) are referenced by 3
components today (see §3, §6) but were never built — they 404. Phase B builds
the **new** water-source slugs, so unless those 3 components are updated, they
will keep pointing at 404s. They must all be updated (see §6).

---

## 2. Existing components we can reuse

### `components/services-overview.tsx` (home page section)

3 teaser cards in a `md:grid-cols-3`. Currently the **old** structure:

| Card title | href |
|---|---|
| Whole House Filtration | `/services/whole-house-filtration` |
| Water Softeners | `/services/water-softeners` |
| Reverse Osmosis Systems | `/services/reverse-osmosis` |

Each card: icon bubble (`Droplets` / `Waves` / `GlassWater`), title,
description, "Learn more →". Wrapped in `<Section><Container>`. **Must be
updated** to the new City Water / Well Water / RO Systems structure — it is a
home-page section pointing at slugs Phase B is not building.

### `components/layout/` primitives — reuse as-is

- `Container` — `size`: `default` (max-w-7xl) · `narrow` (max-w-3xl) · `wide`.
  Adds `mx-auto px-4 sm:px-6 lg:px-8`.
- `Section` — `bg`: `default` · `muted` · `accentSoft` · `hero` · `primary`.
  Applies `py-16 md:py-24`.
- `AnimateInView` — client-side `IntersectionObserver` fade+rise; optional.

### Section components reusable on the new pages

- **`ProcessSteps`** (`components/process-steps.tsx`) — self-contained section,
  `Section bg="hero"`, hardcoded generic 3-step copy (Free Water Test → Custom
  Recommendation → Pro Installation). **Drop-in reusable** on every service
  page's "3-step process" slot — no props needed.
- **`CtaStrip`** (`components/cta-strip.tsx`) — self-contained final-CTA panel,
  links to `/contact`, has a `TODO(david)` `tel:` placeholder. **Drop-in
  reusable** as the service-page final CTA.
- **`TrustStrip`** (`components/trust-strip.tsx`) — 3 trust cards; a candidate
  host for the Water-Right badge (though §9 of the plan recommends the footer).
- `Header`, `Footer` — wrap every page.

### shadcn/ui inventory

`components/ui/` holds **57** components. Relevant to Phase B: `card`,
`badge`, `button`, `separator`, `accordion` (available if an FAQ is ever
wanted — not in the Phase B template). `next/image` will be used for product
photos. No new shadcn components needed.

### Pre-existing unused components (not Phase B concerns)

`components/about-trainer.tsx` and `components/faq.tsx` are leftover v0
template files — not in the home composition, not imported. Ignore them;
do not reuse `about-trainer.tsx` for the real `/about` page.

---

## 3. Header service dropdown — exact current state

`components/header.tsx`. The dropdown is driven by the `services` array
(**lines 36–52**):

```ts
const services = [
  { href: "/services/whole-house-filtration",
    title: "Whole House Filtration",
    description: "Clean, filtered water at every tap." },
  { href: "/services/water-softeners",
    title: "Water Softeners",
    description: "Eliminate hard-water scale and protect appliances." },
  { href: "/services/reverse-osmosis",
    title: "Reverse Osmosis Systems",
    description: "Drinking-water-grade purification under your sink." },
] as const;
```

This single array feeds **both** the desktop dropdown (`NavigationMenuContent`,
lines ~85–101) and the mobile drawer's Services section (lines ~153–170).
Updating the array updates both. The desktop "Services" trigger
(`NavigationMenuTrigger`, line ~86) is a dropdown trigger, **not** a link — so
there is no header link to the `/services` hub today (the hub is reachable
only via the footer / direct URL after Phase B).

`primaryLinks` (lines 54–58): `/about`, `/blog`, `/contact`.

**Required change:** rewrite the `services` array to the water-source
structure — see `PHASE_B_PLAN.md` §10.

---

## 4. Footer service-area chips

`components/footer.tsx`. The `serviceAreas` array (**lines 36–45**) is
hardcoded, with a `TODO(david)` comment already on it:

```
Cleveland, Akron, Canton, Mentor, Lakewood, Strongsville,
Cuyahoga Falls, Parma
```

**Flag:** these 8 cities are placeholder NE-Ohio coverage and should be
confirmed with David — **but do not change them in Phase B** (out of scope).

The footer also has:
- `servicesLinks` (lines 22–26) — **old** service slugs (must update, §6).
- `companyLinks` (lines 28–32) — `/about`, `/blog`, `/contact`.
- Privacy/Terms links (lines ~137, ~140) — `/privacy`, `/terms`.
- NAP block with placeholder phone/email/address (`TODO(david)` markers).

---

## 5. Product images inventory

Location: **`product-pics/`** at the repo root — **untracked**, not yet in
`public/`. Contents:

| File | Bytes | Type | Filename note |
|---|---|---|---|
| `ASP2.jpg` | 279 KB | product | ok |
| `FC-1000.png` | 355 KB | product | ok |
| `IMP.jpg` | 360 KB | product | ok |
| `IMPFE.jpg` | 230 KB | product | ok |
| `IMPRC.jpg` | 333 KB | product | ok |
| `IMPS.jpg` | 255 KB | product | ok |
| `Impression RO.jpg` | 291 KB | product | ⚠️ **space in name** |
| `ONE Filter.jpg` | 22 KB | product | ⚠️ **space in name** |
| `QuadPro-with-Carts.png` | 1.35 MB | product | ok (large) |
| `Water-Right LOGO.jpg` | 181 KB | **partner logo** | ⚠️ **space in name** |
| `.DS_Store` | — | macOS junk | do **not** copy |

→ **9 product images + 1 Water-Right partner logo.**

Notes:
- Per the brief, **keep filenames as-is in Phase B** (no rename). The 3 names
  with spaces work with `next/image` (the path is URL-encoded to `%20`), but a
  later kebab-case cleanup is recommended — flagged as optional, **not done now**.
- `QuadPro-with-Carts.png` is 1.35 MB — large, but `next.config.mjs` sets
  `images.unoptimized: true`, so it ships at full size. Acceptable for the
  end-of-day ship; a later compression pass is optional.
- `Water-Right LOGO.jpg` is a brand asset, not a product — used by the
  partner badge (§9 of the plan), not the product cards.

---

## 6. Home-page CTAs & internal links to `/services/*`, `/about`, `/blog`

`grep` across `app/` + `components/` for service/about/blog/privacy/terms links:

| File | Lines | Links | Action |
|---|---|---|---|
| `components/header.tsx` | 38, 43, 48 | old service slugs | **Update** (§10) |
| `components/header.tsx` | 55, 56, 81, 105, 146 | `/about`, `/blog` | No change — routes built in Phase B |
| `components/footer.tsx` | 23–25 | old service slugs | **Update** |
| `components/footer.tsx` | 29, 30, 137, 140 | `/about`, `/blog`, `/privacy`, `/terms` | No change — routes built in Phase B |
| `components/services-overview.tsx` | 13, 20, 27 | old service slugs | **Update** |

- `HomeHero` (`components/home/hero.tsx`) and `CtaStrip` link only to
  `/contact` — no service links, no change.
- **Three files reference the old service slugs: `header.tsx`, `footer.tsx`,
  `services-overview.tsx`.** All three must be updated to the new water-source
  slugs, or the home page + footer ship broken links — which directly
  contradicts the phase goal of killing all 404s. The brief explicitly names
  only `header.tsx`; `footer.tsx` and `services-overview.tsx` are equally
  mandatory. See `PHASE_B_PLAN.md` §2.

---

## Summary for the plan

- Phase A must merge to `main` first; Phase B branches from updated `main`.
- 8 routes to build (5 real, 3 stub) + `lib/data/products.ts` +
  `components/services/*` + shared helpers.
- 9 product images to **move** into `public/products/` (keep filenames).
- 3 components carry old service slugs and **all** must be updated:
  `header.tsx`, `footer.tsx`, `services-overview.tsx`.
- `ProcessSteps` and `CtaStrip` are drop-in reusable on service pages.
- All Phase 1 tokens + layout primitives are in place; no new dependencies.
