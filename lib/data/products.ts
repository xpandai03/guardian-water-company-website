// Product catalogue for the service pages.
//
// Source: David's May 23 email (Bucket 3) — final product names,
// manufacturer attribution, and homeowner-facing descriptions.

export type ServiceCategory =
  | "city-water"
  | "well-water-ferrous"
  | "well-water-ferric"
  | "ro";

export interface Product {
  /** Stable kebab-case id. */
  id: string;
  /** Marketing product name shown on the card. */
  name: string;
  /** Manufacturer. ProductCard renders this as "By {brand}". */
  brand: string;
  /** A product may serve more than one category (see asp2-imps below). */
  category: ServiceCategory[];
  /** 1–2 image paths under /public. Combos carry two. */
  images: string[];
  /** Homeowner-facing description. */
  description: string;
  /** Optional short badge shown on the card (e.g. dual-iron coverage). */
  badge?: string;
  /** Optional feature bullets. */
  features?: string[];
}

// ---------------------------------------------------------------------------
// DISPLAY DECISION — the ASP2 + IMPS dual-iron combo (`asp2-imps`)
//
// David recommends this combo for BOTH ferrous (dissolved) and ferric
// (already-oxidized) iron, so it is tagged with both well-water categories
// and renders in BOTH sub-sections of the well-water page — once under
// ferrous, once under ferric.
// ---------------------------------------------------------------------------

export const products: Product[] = [
  // ---- City water ----
  {
    id: "fc-1000",
    name: "FC-1000 System",
    brand: "Water-Right",
    category: ["city-water"],
    images: ["/products/FC-1000.png"],
    description:
      "Best for homeowners primarily dealing with chlorine taste/odor and moderate water hardness. A strong entry-level whole home solution for improving overall water quality.",
  },
  {
    id: "imprc",
    name: "IMPRC Softener + Carbon Combo",
    brand: "Water-Right",
    category: ["city-water"],
    images: ["/products/IMPRC.jpg"],
    description:
      "Designed for homes with both hard water issues and noticeable chlorine and chloramine. Combines softening and filtration in one system for full-home protection.",
  },
  {
    id: "imprc-one-filter",
    name: "IMPRC Softener + Carbon + ONE Filtration Combo",
    brand: "Water-Right",
    category: ["city-water"],
    images: ["/products/IMPRC.jpg", "/products/ONE Filter.jpg"],
    description:
      "High-performance solution for homes with elevated hardness and heavier water quality concerns. Ideal for larger homes or households wanting maximum filtration coverage.",
  },

  // ---- Well water: ferrous iron ----
  {
    id: "imp",
    name: "IMP System",
    brand: "Water-Right",
    category: ["well-water-ferrous"],
    images: ["/products/IMP.jpg"],
    description:
      "Designed for homes dealing primarily with dissolved iron that causes staining after exposure to air. Helps prevent orange staining in fixtures, sinks, and laundry.",
  },
  {
    id: "asp2",
    name: "ASP2 System",
    brand: "Water-Right",
    category: ["well-water-ferrous"],
    images: ["/products/ASP2.jpg"],
    description:
      "A more advanced option for homes with higher iron levels or combined hardness concerns. Built for stronger, longer-lasting filtration performance.",
  },

  // ---- Well water: dual-iron combo (shown in BOTH ferrous and ferric) ----
  {
    id: "asp2-imps",
    name: "ASP2 + IMPS Combo System",
    brand: "Water-Right",
    category: ["well-water-ferrous", "well-water-ferric"],
    images: ["/products/ASP2.jpg", "/products/IMPS.jpg"],
    description:
      "Used when both dissolved and already-oxidized iron are present. Provides more complete treatment for homes with persistent staining or recurring buildup issues.",
    badge: "Treats both iron types",
  },

  // ---- Well water: ferric iron ----
  {
    id: "impfe-imp",
    name: "IMPFE + IMP System",
    brand: "Water-Right",
    category: ["well-water-ferric"],
    images: ["/products/IMPFE.jpg", "/products/IMP.jpg"],
    description:
      "High-capacity solution for more severe iron and sulfur conditions. Ideal for wells with heavy staining, odor, or long-term untreated water issues.",
  },

  // ---- Reverse osmosis ----
  {
    id: "impression-ro",
    name: "Impression RO System",
    brand: "Water-Right",
    category: ["ro"],
    images: ["/products/Impression RO.jpg"],
    description:
      "A reliable under-sink reverse osmosis system designed for everyday drinking water improvement. Ideal for households wanting clean, consistent water at a single faucet without complexity.",
  },
  {
    id: "quadpro",
    name: "QuadPro RO System",
    brand: "Water-Right",
    category: ["ro"],
    images: ["/products/QuadPro-with-Carts.png"],
    description:
      "A higher-capacity system designed for households with higher usage or multiple connection points (kitchen + refrigerator/ice maker). Built for stronger flow and longer filter life.",
  },
];

/** All products tagged with the given category. */
export function getProductsByCategory(category: ServiceCategory): Product[] {
  return products.filter((product) => product.category.includes(category));
}
