# Frontend implementation plan: Delahunty Water Systems

## 0. Source material captured

All screenshots referenced below live in `reference/` and were captured live via Playwright on 2026-05-14.

| Folder | Notable files |
|---|---|
| `reference/wahoo/` | `00-fullpage-desktop.png` (full home), `01-hero-desktop.png`, `02-trust-credentials-desktop.png`, `03-testimonials-desktop.png`, `04-membership-benefits-desktop.png`, `06-services-cards-desktop.png`, `07-services-cards-bottom-desktop.png`, `09-section-7422-desktop.png`, `10-process-cta-desktop.png`, `11-footer-desktop.png`, `12-contact-page-top-desktop.png`, `13-contact-page-fullpage-desktop.png`, `20-hero-mobile.png`, `21-fullpage-mobile.png`, `22-services-mobile.png`, `23-contact-form-mobile-fullpage.png` |
| `reference/apex/` | `00-fullpage-desktop.png`, `01-hero-desktop.png`, `02-services-systems-desktop.png`, `03-why-choose-desktop.png`, `04-about-desktop.png`, `05-form-desktop.png`, `06-hidden-dangers-desktop.png`, `20-hero-mobile.png`, `21-fullpage-mobile.png` |

The visual direction blends **Wahoo's structural rhythm and CTA hierarchy** with **Apex's clean white + aqua palette and product-tile patterns**. Wahoo's mascot/cartoon energy is intentionally not adopted — David asked for "homeowner-friendly, not cartoon-y."

---

## 1. Page-by-page inventory: what exists vs what we build

The current v0 codebase is a single-page marketing site. Every page below other than Home requires a new route under `app/`.

| Page | Route | Status | Built from |
|---|---|---|---|
| **Home** | `/` (existing `app/page.tsx`) | Refactor | Mostly rewrite; reuse `components/header`, `components/footer` after refactor; replace one-page sections with new home composition |
| **About** | `/about` | New | New `app/about/page.tsx` using the existing `about-trainer.tsx` as a starting point (rename + retheme) |
| **Services hub** | `/services` | New | New `app/services/page.tsx` — top-level grid linking to the 3 individual service pages, similar to Apex `02-services-systems-desktop.png` |
| **Whole House Filtration** | `/services/whole-house-filtration` | New | New `app/services/whole-house-filtration/page.tsx` — long-form service template |
| **Water Softeners** | `/services/water-softeners` | New | Same template, different content |
| **Reverse Osmosis** | `/services/reverse-osmosis` | New | Same template, different content |
| **Blog index** | `/blog` | New | New `app/blog/page.tsx` — card grid, paginated/all on one page for v1 |
| **Blog post** | `/blog/[slug]` | New | New `app/blog/[slug]/page.tsx` — MDX or simple TSX content for v1; abstract a `BlogLayout` |
| **Contact / Estimate** | `/contact` (or `/estimate`) | New | New `app/contact/page.tsx` — full 6-field form + business info, modeled after Wahoo `12-contact-page-top-desktop.png` and Apex `05-form-desktop.png` |

### v0 components — keep / refactor / drop

| File | Decision | Reason |
|---|---|---|
| `components/header.tsx` | **Refactor** | Update nav items to `About / Services (dropdown) / Blog / Contact`; CTA stays "GET AN ESTIMATE" linking to `/contact`. Logo styling stays (it's actually solid). |
| `components/hero.tsx` | **Refactor** | Currently uses copy that is About-page-appropriate ("About Delahunty Water Systems"). Move that copy to `/about`; rebuild Home hero per §2.A. |
| `components/about-trainer.tsx` | **Drop or migrate** | Built for a fitness template; not aligned with water brand. If reused, becomes the founder/team module on `/about`. |
| `components/benefits.tsx` | **Keep, slightly retheme** | The 6 benefits already match Apex's "Why Choose" almost verbatim. Keep on Home. |
| `components/booking.tsx` | **Refactor** | Field set must change from 3 → 6 fields per the new brief. See §6. |
| `components/testimonials.tsx` | **Keep, restyle** | Carousel layout fine; restyle to match new tokens. |
| `components/faq.tsx` | **Keep** | Belongs on Home and on individual service pages. |
| `components/final-cta.tsx` | **Refactor** | Becomes the "purple/dark CTA strip" pattern from Wahoo `04-membership-benefits-desktop.png` + `10-process-cta-desktop.png`, restyled in our palette. |
| `components/footer.tsx` | **Refactor** | Add NE Ohio service area chips, logo block, social, NAP consistency for local SEO. |

---

## 2. Component design decisions (per Wahoo + Apex screenshots)

### A. Hero — Home

**Reference:** `reference/wahoo/01-hero-desktop.png`, `reference/wahoo/20-hero-mobile.png`, `reference/apex/01-hero-desktop.png`

**Layout adopted:** Two-column desktop. Left: eyebrow ("Northeast Ohio's Water Filtration Experts" or similar), bold 5xl-6xl headline, 1-paragraph subhead, primary CTA + tel:link CTA, optional Google rating badge. Right: full-bleed photo of David / a technician at a job site. The Wahoo "real people, smiling, in branded gear" feel is the target — not stock imagery.

**Why this over Apex hero:** Apex's hero is product-first (bottles + family); Wahoo's is people-first. For a one-person/small-team local business, people-first builds more trust. Apex's eyebrow tagline ("For Utah Homeowners…") above the H1 is a nice device — borrow that pattern. We adopt it as a small accent line above the headline ("For Northeast Ohio Homeowners").

**Top utility bar:** Wahoo `01-hero-desktop.png` has a thin top bar with NAP + Google rating. We adopt this pattern at desktop only — it gives strong above-fold trust signal and is great for local SEO crawl.

### B. Trust / credentials strip

**Reference:** `reference/wahoo/02-trust-credentials-desktop.png`

**Layout adopted:** Centered section heading "Trusted Across Northeast Ohio" + 1-line subhead. Below: 3 equal cards on white bg with light shadow, each with a small circular checkmark icon, bold title, 1-line description.

**Card content (proposed):**
1. **Free Water Test** — On-site water analysis at no cost.
2. **Local & Family-Operated** — Based right here in Northeast Ohio.
3. **No High-Pressure Sales** — Honest recommendations only.

(David should confirm; these mirror what works for Wahoo's "Transparent Pricing / Two-Hour Appointments / No Salespeople" trio.)

### C. Services overview cards (Home)

**Reference:** `reference/wahoo/06-services-cards-desktop.png`, `reference/wahoo/07-services-cards-bottom-desktop.png`

**Layout adopted:** Centered heading, then a 3-card grid (since David has 3 services, not Wahoo's many). Each card: aqua-tinted circular icon top-left, service name H3, 2-3 sentence description, "Learn more →" link to `/services/<slug>`. Cards are subtly bordered with light shadow on hover.

**Why 3-up not 2x2:** With exactly 3 services, a single row reads as "complete coverage" and avoids an awkward last-row-of-one. On mobile they stack vertically.

### D. "Why Water Quality Matters" / education block

**Reference:** `reference/apex/06-hidden-dangers-desktop.png`

**Layout adopted:** Two-column. Left: stacked icon list (3-4 risks like "Chlorine & chloramines," "Lead from old plumbing," "Hard water scale," "Bacteria & sediment"). Right: a single supporting image (NE Ohio map with shaded service counties, or microscope/glass-of-water photography). H2 above spans the section width. This is the "AEO" content block — write this in question-answer voice ("What's actually in Northeast Ohio tap water?") so it gets surfaced by AI overviews.

### E. 3-step process

**Reference:** Wahoo's process feel is at `reference/wahoo/05-section-3733-desktop.png` and `reference/wahoo/09-section-7422-desktop.png` (bookend dark section + steps).

**Layout adopted:** Dark navy or aqua-deep bg full-bleed. Three numbered chips ("01 / 02 / 03") in a row, each with a short title and 2-line description.

**Steps (proposed):**
1. **Free Water Test** — Schedule online or call. We test on-site, free.
2. **Custom Recommendation** — We explain what's in your water and the right system.
3. **Pro Installation** — Clean install by our team, with ongoing support.

### F. Testimonials

**Reference:** `reference/wahoo/03-testimonials-desktop.png`

**Layout adopted:** Light-gray section bg, heading ("What Our Neighbors Say"), 3-card horizontal layout on desktop, swipeable carousel on mobile (we already have `embla-carousel-react` + `components/testimonials.tsx`). Each card: 5-star row, quote, name, town. Pull genuine reviews from David's existing Google profile if available; placeholder until then.

### G. Final CTA strip

**Reference:** `reference/wahoo/04-membership-benefits-desktop.png` (the "Become a Member" purple panel) and `reference/wahoo/10-process-cta-desktop.png` ("Let's Get Your Plumbing Back on Track" panel).

**Layout adopted:** Full-bleed deep-aqua panel with rounded corners offset inside a white container. Left: large white headline ("Ready for Cleaner Water?"). Right: yellow-pill primary CTA + ghost-outlined "Call (xxx) xxx-xxxx" CTA. We can put a stylized water-drop or wave illustration on the left edge in our brand teal — David's existing SVG drop in `components/header.tsx` is already on-brand.

### H. Footer

**Reference:** `reference/wahoo/11-footer-desktop.png`

**Layout adopted:** Dark navy 4-column footer: (1) logo + tagline + NAP + phone, (2) Services quick-links, (3) Company quick-links (About, Blog, Contact), (4) Service area chips ("Cleveland · Akron · Canton · …"). Bottom thin row: copyright + social icons + Privacy/Terms.

### I. Contact page hero + form

**Reference:** `reference/wahoo/12-contact-page-top-desktop.png`, `reference/apex/05-form-desktop.png`

**Layout adopted:** Short hero image with overlay headline ("Get Your Free Water Test"), subhead ("Tell us a bit about your home and we'll be in touch within one business day."). Below the hero: two-column. Left: the 6-field form in a white card with light shadow, edge of card bleeds onto a soft aqua background. Right: business info card (phone, email, service area, hours, embedded map placeholder).

### J. Service detail page template

Each `/services/[slug]` page uses one shared template:

1. Page hero: image + H1 + 1-paragraph subhead + CTA.
2. "What it does" — 3-paragraph intro with one supporting photo.
3. "Why you need it in [Northeast Ohio]" — Bulleted local-relevance.
4. "How it works" — 3-step diagram (re-use the Process component).
5. FAQ specific to the service (re-use `faq.tsx`).
6. Final CTA strip (shared component).

### K. Blog index + post

* Index: card grid (3 per row desktop, 1 per row mobile), card = featured image + title + 2-line excerpt + date + category chip.
* Post: max-width 720px reading column, H1, posted-by line, hero image, MDX body, related posts row at bottom, final CTA strip.

---

## 3. Color tokens (Tailwind v4 / `@theme` in `app/globals.css`)

The current palette (`app/globals.css` lines 6–57) is already in the right family but uses oklch values that are slightly muddy. Refining for the "clean white + aqua/teal" direction David asked for:

```css
@theme inline {
  --color-background: #ffffff;
  --color-foreground: #0b1d2a;        /* near-black with blue undertone */

  --color-primary: #0e2a3a;           /* deep navy (headlines, footer bg) */
  --color-primary-foreground: #ffffff;

  /* Aqua/teal accent — main brand mark color */
  --color-accent: #1ba6c9;            /* mid-cyan, friendly not neon */
  --color-accent-foreground: #ffffff;
  --color-accent-soft: #e6f6fa;       /* tints, icon bgs, section bgs */

  /* CTA — switch from current green to a warmer high-contrast */
  --color-cta: #ffb703;               /* warm yellow, used like Wahoo */
  --color-cta-foreground: #0b1d2a;    /* dark text on yellow */

  /* Hero / dark panels */
  --color-hero-bg: #0b3142;           /* deep ocean for dark sections */
  --color-hero-foreground: #f4fbfd;

  /* Surfaces */
  --color-muted: #f4f7f9;
  --color-muted-foreground: #4a5b66;
  --color-border: #e2ebef;
  --color-card: #ffffff;
}
```

**Recommended variant alternative:** if David wants a green CTA per the existing v0 palette, swap `--color-cta` to `#22a06b` (warm jewel green like Apex's button). Yellow reads more "homeowner-friendly retail" while green reads more "eco / health." Either works; flag for him.

**Notable changes from current `globals.css`:**
- Uses sRGB hex (easier for David and any future designer to pick from Figma) instead of oklch.
- Drops the dark-mode block — local service sites don't need it and it's a maintenance tax.
- Adds `--color-accent-soft` for the icon-bubble + section-tint pattern used everywhere on Apex/Wahoo.

---

## 4. Typography

Current setup uses **Geist** via `--font-sans` (`app/globals.css:99`). Geist is fine but reads "tech startup." For a local home-services brand, a slightly warmer geometric sans is friendlier. Two options:

| Option | Pros | Cons |
|---|---|---|
| **Inter** (via `next/font/google`) | Universal, ultra-readable, neutral, free | Slightly cool/neutral feel |
| **Plus Jakarta Sans** (via `next/font/google`) | Friendly geometric, distinctive at large sizes, free | Slightly less compact in body copy |

**Recommendation:** Plus Jakarta Sans for headlines, Inter for body. Both via `next/font/google` with `display: 'swap'` and only the weights we use (400, 500, 700, 800) to keep CSS small.

**Type scale (Tailwind utility names):**

| Use | Class | Notes |
|---|---|---|
| Hero H1 | `text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight` | Match Wahoo's heavy headline weight |
| Section H2 | `text-3xl md:text-4xl font-bold tracking-tight` | |
| Card H3 | `text-xl font-bold` | |
| Eyebrow | `text-sm font-semibold uppercase tracking-[0.18em] text-accent` | The "For Northeast Ohio Homeowners" line |
| Body | `text-base md:text-lg leading-relaxed` | Slightly larger body for older homeowner audience |
| Lead paragraph | `text-lg md:text-xl leading-relaxed` | Hero subhead, page intros |
| Small / meta | `text-sm text-muted-foreground` | |

---

## 5. Component breakdown

### Build new

| Component | Path | Purpose |
|---|---|---|
| `TopUtilityBar` | `components/top-utility-bar.tsx` | Address + Google rating + phone, desktop only |
| `HomeHero` | `components/home/hero.tsx` | New hero for `/`; the existing `hero.tsx` is About-page content |
| `TrustStrip` | `components/trust-strip.tsx` | 3-card credential grid (§2.B) |
| `ServicesOverview` | `components/services-overview.tsx` | 3-card service teaser linking to `/services/*` |
| `WaterEducation` | `components/water-education.tsx` | "Why Water Quality Matters" two-column block (§2.D) |
| `ProcessSteps` | `components/process-steps.tsx` | 3-step numbered chips on dark bg |
| `CtaStrip` | `components/cta-strip.tsx` | Reusable dark/aqua CTA panel (replaces `final-cta.tsx`) |
| `EstimateForm` | `components/estimate-form.tsx` | The 6-field form, used on `/contact` and inline on `/` |
| `EstimateFormCompact` | `components/estimate-form-compact.tsx` | (Optional) 3-field quick capture (Name/Phone/Zip) used in hero on Home if we want a Wahoo-style hero capture; submits the same `/api/leads` with empty optional fields |
| `ServicePageLayout` | `components/services/service-page-layout.tsx` | Shared template wrapper for the 3 service detail pages |
| `BlogCard` | `components/blog/blog-card.tsx` | Index card |
| `BlogPostLayout` | `components/blog/blog-post-layout.tsx` | Single post wrapper |
| `Toaster` | already in shadcn `components/ui/sonner` (sonner is in deps) | Mount at `app/layout.tsx` for form submit feedback |

### Refactor existing

| Component | What changes |
|---|---|
| `header.tsx` | Nav: About / Services (dropdown w/ 3 sub-items) / Blog / Contact + CTA. Use Radix `NavigationMenu` (already installed) for the Services dropdown so it works on hover desktop and tap mobile. |
| `footer.tsx` | 4-column structure per §2.H, swap mock copy for real NAP. |
| `benefits.tsx` | Slight visual tweak: aqua-tinted circular icons (per Apex) instead of dark-navy ones. Content stays — the 6 benefits already align. |
| `testimonials.tsx` | Restyle cards to white + soft border, 5-star row, real review pull when David provides them. |
| `faq.tsx` | Stays. We'll add a service-specific FAQ instance per service page. |
| `booking.tsx` | Becomes thin wrapper around `EstimateForm`; or delete and reference `EstimateForm` directly from page composition. Decision in §6. |
| `about-trainer.tsx` | Migrate to `app/about/page.tsx` content (founder story module) or delete. |

### shadcn/ui components already present (under `components/ui/`)

`button`, `input`, `select`, `textarea`, `label`, `form`, `dialog`, `dropdown-menu`, `navigation-menu`, `sonner`, etc. All exist. **No new shadcn installs required for v1.**

---

## 6. The 6-field Estimate form

### Visual structure (per `reference/apex/05-form-desktop.png` + `reference/wahoo/13-contact-page-fullpage-desktop.png`)

White card on aqua-soft background. 8px border-radius (`rounded-2xl`), large label-less inputs with placeholders, generous 56px height, 2-column grid where it makes sense.

### Field order, types, layout

| # | Field | Type | Width | Required | Placeholder |
|---|---|---|---|---|---|
| 1 | First Name | `text` | 1/2 (md+) | yes | First Name * |
| 2 | Last Name | `text` | 1/2 (md+) | yes | Last Name * |
| 3 | Phone | `tel` | 1/2 (md+) | yes | Phone * |
| 4 | Email | `email` | 1/2 (md+) | yes | Email * |
| 5 | Street Address | `text` | full | yes | Street Address * |
| 6 | Water Source | `select` | 1/2 (md+) | yes | Water Source * → [City Water, Well Water, Not Sure] |
| 7 | Additional Information | `textarea` (4 rows) | full | no | Tell us anything else about your home or water concerns… |

A 7th visual element is a checkbox: `"I agree to receive a follow-up text from Delahunty Water Systems."` This is **strongly recommended** for TCPA compliance since we're sending a Twilio SMS after submit. Default checked is acceptable in most US contexts; David should confirm with whoever does his compliance.

### Validation UX

- **Library:** `react-hook-form` + `@hookform/resolvers` + `zod` (all already in `package.json`).
- **Inline errors:** appear under the field on blur or on submit. Red border + 13px message.
- **Phone:** US-only normalize to E.164 client-side before submit (basic strip-non-digits, prepend `+1` if 10 digits). Server-side re-validates with Zod.
- **Email:** standard regex via Zod.
- **Submit button:** disabled while pending; spinner inside button; text "Sending…" while in flight.

### Success state

After a successful POST to `/api/leads`:
- Replace the form card in-place with a success block: large checkmark icon, "Thanks — we got your request" headline, 2-line copy ("Check your phone for a confirmation text. We'll reach out within one business day."), secondary "Back to home" link.
- Also fire a Sonner toast for redundancy.
- This avoids a hard navigation, keeps analytics on the same page, and gives the user a calm landing.

### Failure state

- Sonner error toast with copy `"Something went wrong on our end — please call (XXX) XXX-XXXX or try again in a moment."`
- Form stays populated so the user can retry without re-typing.
- For 4xx validation errors from server, surface field-level errors via RHF's `setError`.

### Where the form lives

- **`/contact`:** primary instance, full 6-field form.
- **Home:** Footer-area "Final CTA" includes the full form inline (matches David's brief: home page lists Final CTA as a section). This avoids a click-to-page jump for the hottest leads.
- **Hero (optional, recommended):** a `EstimateFormCompact` (3 fields: First Name + Phone + Zip) that posts to the same endpoint with optional fields blank. Wahoo + Apex both do this; it lifts hero conversion meaningfully. **Decision flag for David.**

---

## 7. Mobile responsiveness approach

**Breakpoints:** Tailwind defaults (`sm 640 / md 768 / lg 1024 / xl 1280`).

**Strategy:** desktop-first polish but mobile must still feel intentional. Specifically:

- **Nav:** Drawer on mobile (`Sheet` from shadcn or simple state-driven panel like the current header). Services dropdown becomes accordion in the drawer.
- **Hero:** stacks to single column. Photo moves above headline on mobile (Apex pattern, `reference/apex/20-hero-mobile.png`) — reads warmer than text-first on phone.
- **3-card grids (Trust / Services / Process):** stack on mobile. Process steps may stay horizontal-scroll on mobile; we'll prototype both and pick the cleaner one.
- **Form:** Always 1-column on mobile. The 1/2-width pairs collapse to full-width.
- **Top utility bar:** hidden on mobile; phone CTA sits in the sticky header instead.
- **CTA strips:** become single-column with the button below the headline.
- **Tap targets:** all interactive elements minimum 44×44.
- **Sticky bottom bar (consider):** a fixed "Call now / Get estimate" bar on mobile only is a strong conversion lever for local service. Recommend, mark for v1 if time.

Test viewports: 390×844 (iPhone 14), 428×926 (iPhone 14 Pro Max), 768×1024 (iPad). Re-run Playwright captures of our build at the same widths once the home page is built.

---

## 8. SEO / AEO foundation

### Metadata

Use Next App Router `export const metadata` per page and a default in `app/layout.tsx`. Per-page `title` template `"%s | Delahunty Water Systems"`, per-page `description` and `openGraph` images. Each service page gets unique meta. Blog posts get article-type Open Graph.

### Structured data (schema.org)

Inject JSON-LD `<script type="application/ld+json">` blocks via a small `Schema` component:

| Page | Schema types |
|---|---|
| Site-wide (in `layout.tsx`) | `LocalBusiness` (or `Plumber`) with `name`, `image`, `address` (NE Ohio), `geo`, `telephone`, `priceRange`, `areaServed[]` listing each county/city, `sameAs[]` for social, `aggregateRating` once we have reviews |
| Home | `WebSite` + `Organization` + `BreadcrumbList` |
| Service pages | `Service` with `provider` referencing the LocalBusiness and `areaServed` |
| Blog index | `Blog` |
| Blog post | `Article` with `author`, `datePublished`, `dateModified` |
| FAQ blocks | `FAQPage` — important for AI Overview surfacing |

### Sitemap & robots

`app/sitemap.ts` (Next 15 supports it), `app/robots.ts` allow-all in prod, disallow on preview deployments via env check.

### AEO (AI Engine Optimization) tactics

- Phrase H2s and FAQ entries as **questions** ("Is well water in Northeast Ohio safe to drink?", "How much does a whole-house filter cost?").
- Lead each answer with a **direct, self-contained answer in the first sentence**, then expand. AI overviews prefer this shape.
- Use `Article` schema with `dateModified` on blog posts so freshness is visible.
- Internal-link service pages to the relevant blog posts and vice versa.
- Add an `Author` byline per blog post pointing to David (with `Person` schema). LLMs and Google E-E-A-T both reward this.

### Blog template structure

- Front-matter (or top-of-file consts): `title`, `slug`, `excerpt`, `category`, `publishedAt`, `updatedAt`, `coverImage`, `author`.
- Body in MDX (recommended) or TSX. MDX makes it easy for David to edit later.
- Suggested initial categories: `Water Quality`, `Buying Guides`, `Maintenance`, `Local NE Ohio`.
- Build each post with one focused question intent (matches AEO point above).

---

## 9. Asset requirements (what we need from David)

Mark each item priority **P0** (blocking launch), **P1** (needed within a sprint of launch), **P2** (nice to have).

| Asset | Priority | Notes |
|---|---|---|
| Final company logo (SVG + PNG) | P0 | Current logo is a placeholder SVG inside `header.tsx` |
| Brand color confirmation | P0 | Lock the aqua hex + CTA color (yellow vs green per §3) |
| Phone number for site-wide CTA | P0 | Replace placeholder `(435) 901-5045` everywhere (currently in `header.tsx`, `hero.tsx`, `booking.tsx`) |
| Business address(es) + service area list | P0 | For footer, schema, "Proudly Serving" section |
| Hours of operation | P0 | For schema + Contact page |
| Hero photo of David / team / branded vehicle | P0 | The single highest-impact asset; affects 3+ surfaces |
| 3 service photos (whole house unit, softener, RO under-sink) | P0 | One per service page hero + service tile |
| 4–6 jobsite / install photos | P1 | Used in About, education block, blog stock |
| Founder bio + headshot | P1 | About page |
| Real Google reviews (5–8) | P1 | Replace placeholder testimonials |
| Initial blog topics list (5+) | P1 | We can draft starter SEO posts: "Is hard water common in NE Ohio?", "City water vs well water in Cuyahoga County", etc. |
| Privacy policy + Terms copy | P1 | Linked from form + footer |
| Social profile URLs | P2 | For footer + `sameAs` schema |
| Favicon set | P2 | Currently uses the default placeholder icons |
| Embedded map / service area map graphic | P2 | Either Google Maps embed or a static SVG of NE Ohio counties |

---

## 10. Order of implementation (frontend)

Each step ends with a working preview deploy on Vercel.

1. **Foundation** — install `next/font` choices, refactor `app/globals.css` to the new tokens (§3), add typography utility classes, mount `Sonner` `Toaster` in `app/layout.tsx`, set up shared `<Container>` and section spacing primitives.
2. **Header + Footer refactor** — multi-page nav with Services dropdown (Radix `NavigationMenu`), responsive drawer, footer with NAP block. Confirms layout shell across all pages.
3. **Home page composition** — build/replace components in this order: `TopUtilityBar` → `HomeHero` → `TrustStrip` → `ServicesOverview` → `WaterEducation` → `ProcessSteps` → `Benefits` (existing, restyled) → `Testimonials` (existing, restyled) → `CtaStrip` containing `EstimateForm` → `Footer`. Run Playwright captures and visually diff against `reference/wahoo/` to confirm rhythm.
4. **`/contact` page** — hero + `EstimateForm` + business info card + map placeholder. Wires form to a stubbed `/api/leads` for now (the real API arrives via the backend plan).
5. **`/services` hub + `ServicePageLayout` template** — build the layout once, then stamp the 3 service pages (`whole-house-filtration`, `water-softeners`, `reverse-osmosis`) as content variants.
6. **`/about`** — founder/team module + values + mini service area + CTA.
7. **`/blog` + `/blog/[slug]`** — index card grid + post layout. Seed with 1 placeholder MDX post so the route is real and indexable.
8. **SEO/AEO pass** — metadata per page, JSON-LD schema, `sitemap.ts`, `robots.ts`, OG image generation (use Next's `ImageResponse` API for dynamic OG cards per page).
9. **Mobile pass** — re-walk every page at 390px, 428px, 768px. Fix any awkward breakpoints. Decide on the sticky mobile call/CTA bar.
10. **Asset swap** — replace every placeholder image and the placeholder phone number with real assets from David. This is the final pre-launch checklist item.

Backend work (form → Jobber → Twilio) runs in parallel with steps 4–10 and is described in `BACKEND_PLAN.md`.
