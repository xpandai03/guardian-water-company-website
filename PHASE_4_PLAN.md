# Bucket 4 — Product Detail Pages

## Scope

Build 9 product detail pages at `/services/[category]/[product]`, sourcing
marketing copy + features + videos + PDFs from each product's matching
Water-Right page (David is an authorized Water-Right dealer).

## Branch base

Branched from `feature/milestone-1-bucket-3-service-pages` (not `main`)
because Bucket 4 directly extends the Product schema and `ProductCard`
introduced in Bucket 3. Merge order **must** be: Bucket 2 → Bucket 3 →
Bucket 4.

## Canonical 9 product slugs

| Slug              | Category      | Combo? | Canonical URL                                 |
|-------------------|---------------|--------|-----------------------------------------------|
| `fc-1000`         | city-water    | no     | /services/city-water/fc-1000                  |
| `imprc`           | city-water    | no     | /services/city-water/imprc                    |
| `imprc-one-filter`| city-water    | yes    | /services/city-water/imprc-one-filter         |
| `imp`             | well-water    | no     | /services/well-water/imp                      |
| `asp2`            | well-water    | no     | /services/well-water/asp2                     |
| `asp2-imps`       | well-water    | yes    | /services/well-water/asp2-imps                |
| `impfe-imp`       | well-water    | yes    | /services/well-water/impfe-imp                |
| `impression-ro`   | ro-systems    | no     | /services/ro-systems/impression-ro            |
| `quadpro`         | ro-systems    | no     | /services/ro-systems/quadpro                  |

The `asp2-imps` combo carries the `well-water-ferrous` + `well-water-ferric`
category tags (so it surfaces in both subsections of the well-water page),
but its canonical detail-page URL lives under `well-water` (singular) per
`detailUrlCategory`. Clicking from either subsection lands at the same URL.

## Combo → component mapping

| Combo slug          | Component slugs       | Source pages (Water-Right)                                                                 |
|---------------------|-----------------------|-------------------------------------------------------------------------------------------|
| `imprc-one-filter`  | `imprc`, `one-filter` | impression-plus-rc-series + one-cartridge-filter-tank                                      |
| `asp2-imps`         | `asp2`, `imps`        | sanitizer-plus + impression-plus-air-system                                                |
| `impfe-imp`         | `impfe`, `imp`        | impression-plus-air-system + impression-plus                                               |

Note: `imps` and `impfe` share the same Water-Right page
(impression-plus-air-system) — they're the same physical product used in
different combo contexts. For data purposes, both component IDs reference
the same source content.

`one-filter` does NOT get its own detail page (it only appears as a
combo component); same for standalone `imps` / `impfe`. The 9 detail pages
are exactly the 9 products surfaced on the service pages today.

## Sourced-content provenance

Every sourced field (tagline, fullDescription, detailedFeatures, videoPath,
documents) carries a comment block in `lib/data/products.ts`:

```
// SOURCED FROM WATER-RIGHT (impression-plus-rc-series)
// TODO(david): confirm dealer permission for marketing copy use
```

## Asset paths

- Videos: `/public/videos/products/{slug}.mp4`
- PDFs:   `/public/pdfs/products/{slug}/{specs|manual|brochure}.pdf`

For combo products, the combo page reuses component videos/PDFs; no separate
combo assets are downloaded.

## Routing

- `app/services/[category]/[product]/page.tsx` (single file, dynamic)
- `generateStaticParams()` enumerates the 9 valid combinations from
  `products` data — invalid permutations 404 via `notFound()`.
- `generateMetadata()` per route returns product-specific title + description.
