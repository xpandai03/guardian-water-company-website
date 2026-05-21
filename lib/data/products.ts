// Product catalogue for the Phase B service pages.
//
// Source: David's May 15 product info (the 9 Water-Right product photos in
// public/products/). Each `name` is the model identifier from that email;
// `brand`, `description`, and `features` need David's wording and are marked
// TODO(david) until he supplies them after the meeting.

export type ServiceCategory =
  | "city-water"
  | "well-water-ferrous"
  | "well-water-ferric"
  | "ro";

export interface Product {
  /** Stable kebab-case id. */
  id: string;
  /** Model / identifier name — known from David's product list. */
  name: string;
  /** Manufacturer / brand. TODO(david). */
  brand: string;
  /** A product may serve more than one category (see asp2-imps below). */
  category: ServiceCategory[];
  /** 1–2 image paths under /public. Combos carry two. */
  images: string[];
  /** Homeowner-facing description. TODO(david). */
  description: string;
  /** Optional short badge shown on the card (e.g. dual-iron coverage). */
  badge?: string;
  /** Optional feature bullets. TODO(david) when David supplies them. */
  features?: string[];
}

// ---------------------------------------------------------------------------
// DISPLAY DECISION — the ASP2 + IMPS dual-iron combo (`asp2-imps`)
//
// David recommends this combo for BOTH ferrous ("clear-water", dissolved) and
// ferric ("red-water", oxidized) iron, so it is tagged with both well-water
// categories and renders in BOTH sub-sections of the well-water page — once
// under ferrous, once under ferric.
//
// Why show it twice instead of once: a homeowner who knows they have
// red-water iron reads only the ferric sub-section; one with clear-water iron
// reads only the ferrous sub-section. If the combo lived in just one section,
// half the audience would never see the system that actually fits them.
// To stop the repeat from reading as a listing bug, this entry carries a
// `badge` ("Treats both iron types") so it is instantly recognisable as the
// one versatile, do-it-all option — reassuring rather than confusing.
// ---------------------------------------------------------------------------

export const products: Product[] = [
  // ---- City water ----
  {
    id: "fc-1000",
    name: "FC-1000",
    brand: "TODO(david): brand",
    category: ["city-water"],
    images: ["/products/FC-1000.png"],
    description:
      "TODO(david): homeowner-facing description of the FC-1000 — what it does and which homes it suits.",
  },
  {
    id: "imprc",
    name: "IMPRC Softener + Carbon Combo",
    brand: "TODO(david): brand",
    category: ["city-water"],
    images: ["/products/IMPRC.jpg"],
    description:
      "TODO(david): homeowner-facing description of the IMPRC softener + carbon combo.",
  },
  {
    id: "imprc-one-filter",
    name: "IMPRC + ONE Filter Combo",
    brand: "TODO(david): brand",
    category: ["city-water"],
    images: ["/products/IMPRC.jpg", "/products/ONE Filter.jpg"],
    description:
      "TODO(david): homeowner-facing description of the IMPRC + ONE Filter combo.",
  },

  // ---- Well water: ferrous (clear-water) iron ----
  {
    id: "imp",
    name: "IMP",
    brand: "TODO(david): brand",
    category: ["well-water-ferrous"],
    images: ["/products/IMP.jpg"],
    description:
      "TODO(david): homeowner-facing description of the IMP system.",
  },
  {
    id: "asp2",
    name: "ASP2",
    brand: "TODO(david): brand",
    category: ["well-water-ferrous"],
    images: ["/products/ASP2.jpg"],
    description:
      "TODO(david): homeowner-facing description of the ASP2 system.",
  },

  // ---- Well water: dual-iron combo (ferrous + ferric) — see note above ----
  {
    id: "asp2-imps",
    name: "ASP2 + IMPS Combo",
    brand: "TODO(david): brand",
    category: ["well-water-ferrous", "well-water-ferric"],
    images: ["/products/ASP2.jpg", "/products/IMPS.jpg"],
    description:
      "TODO(david): homeowner-facing description of the ASP2 + IMPS dual-iron combo — it treats both ferrous and ferric iron.",
    badge: "Treats both iron types",
  },

  // ---- Well water: ferric (red-water) iron ----
  {
    id: "impfe-imp",
    name: "IMPFE + IMP Combo",
    brand: "TODO(david): brand",
    category: ["well-water-ferric"],
    images: ["/products/IMPFE.jpg", "/products/IMP.jpg"],
    description:
      "TODO(david): homeowner-facing description of the IMPFE + IMP combo.",
  },

  // ---- Reverse osmosis ----
  {
    id: "impression-ro",
    name: "Impression RO",
    brand: "TODO(david): brand",
    category: ["ro"],
    images: ["/products/Impression RO.jpg"],
    description:
      "TODO(david): homeowner-facing description of the Impression RO drinking-water system.",
  },
  {
    id: "quadpro",
    name: "QuadPro",
    brand: "TODO(david): brand",
    category: ["ro"],
    images: ["/products/QuadPro-with-Carts.png"],
    description:
      "TODO(david): homeowner-facing description of the QuadPro RO system.",
  },
];

/** All products tagged with the given category. */
export function getProductsByCategory(category: ServiceCategory): Product[] {
  return products.filter((product) => product.category.includes(category));
}
