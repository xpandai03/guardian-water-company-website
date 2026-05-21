# PHASE B PLAN — Service Pages + Kill All 404s

**Goal:** ship every remaining route so the site has zero 404s by end of day.
Companion to `AUDIT_PHASE_B.md` — read its §0 first.

**Prerequisite:** Phase A must be merged to `main` before Phase B starts
(see §13). Phase B branches from the updated `main`.

**Treatment tiers:**
- **Real pages:** `/services` (hub), `/services/city-water`,
  `/services/well-water`, `/services/ro-systems`, `/about`.
- **Stub pages:** `/blog`, `/privacy`, `/terms`.

**Out of scope** (per brief): Twilio, real testimonials, David's photo,
David's phone number, schema.org markup, real blog posts, AEO H2 rewrites,
animation refinement, pixel-perfect polish.

---

## 1. New files to create

### Data
| File | Purpose |
|---|---|
| `lib/data/products.ts` | Typed product catalog (9 entries) + `ServiceCategory` type. §3. |

### Shared components
| File | Purpose |
|---|---|
| `components/services/product-card.tsx` | White-card product display (image-on-white + name + brand + description + optional features). |
| `components/services/service-page-layout.tsx` | Shared template for the 3 service sub-pages. Takes content via props, composes the full page. §4. |
| `components/services/services-hub.tsx` | The `/services` hub body — 3 category cards. §5. |
| `components/page-hero.tsx` | Generic simple hero (eyebrow + H1 + subhead). Reused by `/about`, `/blog`, `/privacy`, `/terms`, and the hub. |
| `components/water-right-badge.tsx` | Small "Authorized Water-Right Dealer" badge (logo + label). Reused in footer + `/about`. §9. |

### Routes
| File | Tier | Purpose |
|---|---|---|
| `app/services/page.tsx` | real | Hub — `Header` + `PageHero` + `ServicesHub` + `CtaStrip` + `Footer`. |
| `app/services/city-water/page.tsx` | real | Renders `ServicePageLayout` with city-water content. |
| `app/services/well-water/page.tsx` | real | Renders `ServicePageLayout` with well-water content. |
| `app/services/ro-systems/page.tsx` | real | Renders `ServicePageLayout` with RO content. |
| `app/about/page.tsx` | real | `Header` + `PageHero` + story + service area + Water-Right + CTA + `Footer`. §6. |
| `app/blog/page.tsx` | stub | "Learning Center" coming-soon + CTA. §7. |
| `app/privacy/page.tsx` | stub | Boilerplate. §8. |
| `app/terms/page.tsx` | stub | Boilerplate. §8. |

**Total: 13 new files** (1 data + 5 components + 8 routes). No `app/not-found.tsx`
in scope (default 404 is fine once all real routes exist).

Each `app/services/<x>/page.tsx` holds its own content object (hero copy,
intro, why-NE-Ohio bullets, product category filter) and passes it to
`ServicePageLayout` — keeps the template dumb, no separate `services.ts`
data file needed. Per-service copy is `TODO(david)` placeholder where his
input is required.

---

## 2. Files to MODIFY

| File | Change | Lines |
|---|---|---|
| `components/header.tsx` | Rewrite the `services` array to the water-source structure (feeds desktop dropdown + mobile drawer). | array at 36–52 |
| `components/footer.tsx` | (a) Rewrite `servicesLinks` to new slugs/labels; (b) add `<WaterRightBadge />` in the brand column. | `servicesLinks` 22–26; badge inserted ~after line 86 |
| `components/services-overview.tsx` | Rewrite the `services` array (3 cards: hrefs, titles, descriptions) to City Water / Well Water / RO Systems. | array at 11–33 |

**All three are mandatory** — not just the header. `footer.tsx` and
`services-overview.tsx` both point at old service slugs that Phase B does not
build; leaving them ships broken links and defeats the "zero 404s" goal
(`AUDIT_PHASE_B.md` §6). No other home-page composition files change —
`HomeHero` and `CtaStrip` link only to `/contact`.

Exact replacement content for header & services-overview: §10.

---

## 3. Product data structure — `lib/data/products.ts`

The brief's structure, with **two deliberate deviations** (flagged):

```ts
export type ServiceCategory =
  | "city-water"
  | "well-water-ferrous"
  | "well-water-ferric"
  | "ro";

export interface Product {
  id: string;            // kebab-case, stable
  name: string;          // TODO(david) — David's exact product name
  brand: string;         // TODO(david) — e.g. "Impression Plus"
  category: ServiceCategory[];   // DEVIATION 1 — array, not a single value
  images: string[];      // DEVIATION 2 — array of 1–2 public paths
  description: string;   // TODO(david)
  features?: string[];   // optional bullets — TODO(david)
}
```

**Deviation 1 — `category: ServiceCategory[]`** (brief said single string).
The "ASP2 + IMPS combo" is recommended by David for **both** ferrous and
ferric well water. A single-value `category` would force a duplicate entry;
an array lets one product appear in both well-water sub-sections cleanly.

**Deviation 2 — `images: string[]`** (brief said `image: string`). Three
entries are 2-product combos. An array (1–2 paths) lets the card show both
units and means **all 9 product images get used** — a single field would
strand `IMPS.jpg` and `ONE Filter.jpg`. The card renders 1 image centered or
2 side-by-side.

If you'd rather keep the brief's exact `image: string`, say so and combos
will use the primary unit's image only (2 assets unused).

### The 9 catalogue entries (id / category / images known; copy = TODO)

| `id` | `category` | `images` |
|---|---|---|
| `fc-1000` | `["city-water"]` | `FC-1000.png` |
| `imprc` | `["city-water"]` | `IMPRC.jpg` |
| `imprc-one-filter` | `["city-water"]` | `IMPRC.jpg`, `ONE Filter.jpg` |
| `imp` | `["well-water-ferrous"]` | `IMP.jpg` |
| `asp2` | `["well-water-ferrous"]` | `ASP2.jpg` |
| `asp2-imps` | `["well-water-ferrous","well-water-ferric"]` | `ASP2.jpg`, `IMPS.jpg` |
| `impfe-imp` | `["well-water-ferric"]` | `IMPFE.jpg`, `IMP.jpg` |
| `impression-ro` | `["ro"]` | `Impression RO.jpg` |
| `quadpro` | `["ro"]` | `QuadPro-with-Carts.png` |

Image paths are `/products/<filename>` (e.g. `/products/Impression RO.jpg` —
the space is fine, `next/image` URL-encodes it). `name` / `brand` /
`description` / `features` are written as literal `"TODO(david): …"` strings
so David can fill them from his May 15 email; the catalogue is otherwise
complete and typed.

Helper export: `getProductsByCategory(category: ServiceCategory): Product[]`
— filters `products` where `category.includes(...)`.

---

## 4. Service page template — `ServicePageLayout`

`components/services/service-page-layout.tsx`. Props:

```ts
interface ServicePageLayoutProps {
  eyebrow: string;          // e.g. "Water Filtration"
  title: string;            // H1, e.g. "City Water Solutions"
  intro: string;            // "What it does" paragraph
  whyOhio: string[];        // "Why you need it in NE Ohio" bullets
  productSections: {        // 1 section for city/ro, 2 for well (ferrous/ferric)
    heading?: string;       // sub-heading, e.g. "For iron-stained (ferric) water"
    category: ServiceCategory;
  }[];
}
```

Composition (top → bottom):

1. `<Header />`
2. **Page hero** — `bg-background`, eyebrow + H1 + intro lede. (Reuse
   `PageHero` or inline; service pages may want a slightly richer hero — keep
   it simple, `PageHero` is fine.)
3. **"What it does" intro** — `<Section><Container size="narrow">` prose block.
4. **Products section** — for each `productSections` entry: optional
   sub-heading + a responsive grid of `<ProductCard>` (`getProductsByCategory`).
   `md:grid-cols-2 lg:grid-cols-3`.
5. **"Why you need it in Northeast Ohio"** — `<Section bg="muted">`, the
   `whyOhio` bullets with check icons.
6. **3-step process** — `<ProcessSteps />` reused **as-is** (no props).
7. **Final CTA** — `<CtaStrip />` reused **as-is**.
8. `<Footer />`

The 3 sub-pages are thin: each defines its content object and renders
`<ServicePageLayout {...content} />`. The well-water page passes **two**
`productSections` (ferrous + ferric) with sub-headings; city-water and
ro-systems pass one.

### `ProductCard` (`components/services/product-card.tsx`)

White card: `bg-card border border-border rounded-lg shadow-sm`, padding.
- Image area: fixed-aspect box (`aspect-[4/3]`), **white background**,
  `next/image` with `fill` + `object-contain` (product photos sit on white,
  never cropped). For 2-image combos, a 2-column inner grid, each image
  `object-contain`.
- Below: `name` (bold, `text-primary`), `brand` (small, `text-muted-foreground`),
  `description` (`text-sm`), optional `features` as a check-bullet list.

---

## 5. Hub page — `/services`

`app/services/page.tsx`: `Header` → `PageHero` → `ServicesHub` → `CtaStrip`
→ `Footer`.

`PageHero`: eyebrow "Our Services", H1 "Water Filtration for Every Northeast
Ohio Home", subhead — one sentence on tailoring the system to the water
source.

`ServicesHub` (`components/services/services-hub.tsx`): reuses the
`ServicesOverview` visual pattern (3-up card grid, icon bubble, title,
description, "Learn more →") but with the new content:

| Icon | Name | Links to | 2-sentence description |
|---|---|---|---|
| `Building2` | City Water | `/services/city-water` | Municipal water carries chlorine, hardness, and taste/odor issues. We filter and soften it for clean water at every tap. |
| `Mountain` (or `Droplets`) | Well Water | `/services/well-water` | Private wells often bring iron staining, sulfur smell, and hardness. We diagnose ferrous vs. ferric iron and treat accordingly. |
| `GlassWater` | RO Systems | `/services/ro-systems` | Reverse osmosis delivers drinking-water-grade purity at the kitchen sink. Crisp water for drinking, cooking, and ice. |

(Descriptions above are reasonable placeholders — fine to ship; David can
refine. Mark `TODO(david)` for tightening, not for blocking.)

---

## 6. About page — `/about`

`app/about/page.tsx`: `Header` → `PageHero` → story → service area →
Water-Right partner → final CTA → `Footer`. All real, not a stub.

- **`PageHero`** — eyebrow "About Us", H1 **"About Guardian Water"**,
  subhead positioning line: *"Northeast Ohio's local, family-operated water
  filtration specialists."*
- **Story** — `<Section><Container size="narrow">`, 3 paragraphs, each a
  `TODO(david)` placeholder with realistic filler:
  1. Who David is / how Guardian Water started (placeholder).
  2. The approach — free water test, honest recommendation, no high-pressure
     sales (can reuse the trust-strip framing — placeholder).
  3. The mission — cleaner, safer water for local homeowners (placeholder).
  Each paragraph wrapped with a `{/* TODO(david): replace with real copy */}`
  comment.
- **Service area** — a short line + reuse the footer's `serviceAreas` framing
  (or a simple sentence "Serving Cleveland, Akron, Canton and the surrounding
  Northeast Ohio communities."). Do not duplicate the footer chip array —
  a sentence is enough.
- **Partner** — a short "Proud partner" block with `<WaterRightBadge />` and
  one sentence on what the Water-Right partnership means for customers
  (placeholder, `TODO(david)`).
- **Final CTA** — `<CtaStrip />` reused as-is.

---

## 7. Blog stub — `/blog`

`app/blog/page.tsx`: `Header` → `PageHero` → centered message + CTA →
`Footer`.

- `PageHero` — eyebrow "Resources", H1 **"Learning Center"**.
- Body — `<Section>` centered: *"We're working on educational content to
  help homeowners understand water quality. In the meantime, get in touch
  for personalized advice."*
- CTA — a `Button` (CTA-green, rounded-full, matching the site) linking to
  `/contact`: **"Get a Free Water Test"**.

Single screen, no fake post list.

---

## 8. Privacy + Terms stubs — `/privacy`, `/terms`

`app/privacy/page.tsx` and `app/terms/page.tsx`: `Header` → `PageHero` →
boilerplate prose → `Footer`. One page each.

- Generic, neutral boilerplate. Reference the company by name —
  **"Guardian Water, LLC"**.
- Include a literal `Last updated: May 21, 2026` line.
- A prominent `{/* TODO(david): replace with reviewed legal copy */}` comment
  at the top of the content, and a short visible note that the policy is
  preliminary.
- Prose in `<Container size="narrow">`, simple `<h2>` + `<p>` blocks.
- **No real legal copy.** Boilerplate only — David supplies reviewed text
  later. Keep each to a handful of generic sections (Privacy: what's
  collected / how it's used / contact; Terms: use of site / no warranty /
  contact).

---

## 9. Water-Right partner placement

`components/water-right-badge.tsx` — a small, tasteful badge:
- The `Water-Right LOGO.jpg` image (moved to `public/products/`), constrained
  small (e.g. `h-8`–`h-10`, `next/image` with explicit width/height,
  `object-contain`).
- Label text: **"Authorized Water-Right Dealer"** in small muted type.
- Horizontal layout, low-key.

Placement:
- **Footer** — in the brand column of `components/footer.tsx`, below the NAP
  block. Primary placement (appears site-wide).
- **About page** — in the partner block (§6).

Not in the `TrustStrip` (keeps the trust cards uniform). Keep it small — no
giant logo.

---

## 10. Header dropdown update — exact change

`components/header.tsx`, replace the `services` array (lines 36–52):

```ts
const services = [
  {
    href: "/services/city-water",
    title: "City Water",
    description: "Filtration & softening for municipal water.",
  },
  {
    href: "/services/well-water",
    title: "Well Water",
    description: "Iron, sulfur & hardness treatment for private wells.",
  },
  {
    href: "/services/ro-systems",
    title: "RO Systems",
    description: "Drinking-water-grade reverse osmosis.",
  },
] as const;
```

This one array drives both the desktop dropdown and the mobile drawer — no
other header change needed.

### `services-overview.tsx` update (home page)

Replace its `services` array (lines 11–33) — new hrefs, titles, descriptions,
and swap icons to match the hub (`Building2` / `Mountain` or `Droplets` /
`GlassWater`). Use the §5 hub descriptions for consistency. The component's
JSX (grid, card markup) stays unchanged.

### `footer.tsx` update

Replace `servicesLinks` (lines 22–26):

```ts
const servicesLinks = [
  { href: "/services/city-water", label: "City Water" },
  { href: "/services/well-water", label: "Well Water" },
  { href: "/services/ro-systems", label: "RO Systems" },
] as const;
```

---

## 11. CSS / token usage

- **Phase 1 tokens only** — no new colors, no new CSS variables. Use
  `bg-card`, `bg-muted`, `bg-accent-soft`, `text-primary`, `text-accent`,
  `bg-cta`, `border-border`, `bg-hero-bg`, etc.
- **Layout primitives** — every page uses `Container` + `Section`. Prose
  pages (`/privacy`, `/terms`, `/about` story, service intros) use
  `Container size="narrow"`.
- **Product cards** — `bg-card` (white), `border border-border`,
  `rounded-lg`, `shadow-sm`. Image box: white background, `aspect-[4/3]`,
  `object-contain`.
- **Section rhythm** — alternate `Section` backgrounds (`default` / `muted`)
  for visual separation, consistent with the home page.
- `next/image` for all product/logo images — `next.config.mjs` already sets
  `images.unoptimized: true`, so no `remotePatterns` or extra config needed.

---

## 12. Testing approach

1. `npx tsc --noEmit` — must be clean (`next.config.mjs` has
   `ignoreBuildErrors: true`, so the build will **not** catch type errors —
   check manually).
2. `npm run build` — must succeed; confirm all 8 new routes appear in the
   route manifest.
3. `npm run lint` — **skip if eslint is still uninstalled** (it was missing
   in Phase A; do not install it — out of scope).
4. `npm run dev` — walk **every** new route: `/services`, the 3 service
   pages, `/about`, `/blog`, `/privacy`, `/terms`. No console errors;
   content renders.
5. Click **every** internal link site-wide — header dropdown (desktop hover
   **and** mobile drawer), footer service + company + legal links,
   home-page `ServicesOverview` cards, hub cards, every CTA → confirm each
   destination resolves (zero 404s — the phase's exit criterion).
6. Each service page renders its assigned products with the correct images;
   the well-water page shows both ferrous and ferric sub-sections.
7. Mobile responsive check at **390 px** — product card grids stack, hub
   cards stack, header drawer works, no horizontal overflow.
8. Verify the 3 space-containing image filenames (`Impression RO.jpg`,
   `ONE Filter.jpg`, `Water-Right LOGO.jpg`) actually load (URL-encoding).

---

## 13. Branch strategy

1. **Prerequisite:** merge Phase A — open a PR from
   `feature/phase-a-contact-form` into `main` and merge it. (Confirmed with
   Raunek: Phase A merges first.)
2. Branch Phase B from the **updated `main`**: `feature/phase-b-service-pages`.
3. Single cohesive feature branch for all of Phase B (one big but unified
   phase).
4. Commit in logical chunks (see §15), push, get the Vercel preview URL.
5. Raunek verifies on the preview and merges via PR.
6. **Do not push to `main`.**

---

## 14. Estimated implementation cost

| File | Rough lines |
|---|---|
| `lib/data/products.ts` | ~110 |
| `components/services/product-card.tsx` | ~65 |
| `components/services/service-page-layout.tsx` | ~120 |
| `components/services/services-hub.tsx` | ~90 |
| `components/page-hero.tsx` | ~40 |
| `components/water-right-badge.tsx` | ~30 |
| `app/services/page.tsx` | ~40 |
| `app/services/city-water/page.tsx` | ~55 |
| `app/services/well-water/page.tsx` | ~70 |
| `app/services/ro-systems/page.tsx` | ~55 |
| `app/about/page.tsx` | ~90 |
| `app/blog/page.tsx` | ~45 |
| `app/privacy/page.tsx` | ~80 |
| `app/terms/page.tsx` | ~80 |
| `header.tsx` / `footer.tsx` / `services-overview.tsx` mods | ~50 changed |
| **Total** | **~1,100 lines added**, ~50 modified |

Plus moving 9 image files into `public/products/`.

**Time:** one focused implementation session.

### Risks

- **Image filenames with spaces** — `Impression RO.jpg`, `ONE Filter.jpg`,
  `Water-Right LOGO.jpg`. `next/image` handles them (URL-encoded), but test
  explicitly (§12.8). Mitigation if they misbehave: kebab-case rename
  (deferred optional cleanup — not done in Phase B per brief).
- **`.DS_Store` in `product-pics/`** — do not copy it into `public/products/`.
- **`QuadPro-with-Carts.png` is 1.35 MB** — ships unoptimized
  (`images.unoptimized: true`); acceptable for the ship, compress later.
- **Combo products** (2 images / 2 categories) — handled by the `images[]` /
  `category[]` deviations (§3); product-card must render 1 **or** 2 images.
- **Mobile layout** — product grids and hub cards at 390 px; the well-water
  page's two sub-sections add length — verify spacing.
- **Header dropdown** — low risk; it is a plain data-array swap. (There is no
  shadcn `Select` in the nav — it's `NavigationMenu`; the brief's worry is
  not applicable.)
- **Old service slugs** — if `footer.tsx` or `services-overview.tsx` are
  missed, the site ships 404s. §2 makes all three updates mandatory.

---

## 15. Order of implementation

Build foundation-first, and build one full service page early to surface
template/card bugs before replicating:

1. **Merge Phase A to `main`**, branch `feature/phase-b-service-pages`.
2. **Move images** — copy `product-pics/*.{jpg,png}` → `public/products/`
   (skip `.DS_Store`). Commit. Everything downstream references these.
3. **`lib/data/products.ts`** — the data foundation.
4. **`ProductCard`** + **`ServicePageLayout`** — the reusable core.
5. **`/services/city-water`** — the simplest service page (one product
   section). Render it, fix `ProductCard` / layout / image-path bugs **here**
   before replicating.
6. **`/services/well-water`** (two sub-sections) + **`/services/ro-systems`**.
7. **`PageHero`** → **`ServicesHub`** → **`/services`** hub page.
8. **`/about`** (needs `WaterRightBadge`) → **`/blog`** → **`/privacy`** →
   **`/terms`**.
9. **Navigation updates last** — `header.tsx`, `footer.tsx` (+ badge),
   `services-overview.tsx`. Doing these last means every link target already
   exists, so the link-click pass (§12.5) is a true zero-404 check.
10. Full test pass (§12) → push → Vercel preview → hand to Raunek.

---

AUDIT_PHASE_B.md and PHASE_B_PLAN.md written. Ready for review. Do not start implementation.
