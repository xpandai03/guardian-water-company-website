// Product catalogue for the service + product-detail pages.
//
// Short copy (name, brand, description) is David's May 23 email (Bucket 3).
// Detail-page copy (tagline, fullDescription, detailedFeatures, videoPath,
// documents) is sourced from each product's matching Water-Right page —
// David is an authorized Water-Right dealer (Bucket 4).
//
// TODO(david): confirm Water-Right dealer permission for use of the
// manufacturer's marketing copy, demo videos, and PDF downloads. The sourced
// fields are all flagged with `SOURCED FROM WATER-RIGHT` inline comments
// directly above the relevant data entries.

export type ServiceCategory =
  | "city-water"
  | "well-water-ferrous"
  | "well-water-ferric"
  | "ro";

/** URL segment under /services for product detail pages. */
export type DetailUrlCategory = "city-water" | "well-water" | "ro-systems";

export interface ProductDocuments {
  specs?: string;
  manual?: string;
  brochure?: string;
}

export interface Product {
  /** Stable kebab-case id. Also used as the URL slug. */
  id: string;
  /** URL slug (kebab-case). Matches `id` for every product today. */
  slug: string;
  /** Marketing product name shown on the card. */
  name: string;
  /** Manufacturer. ProductCard renders this as "By {brand}". */
  brand: string;
  /** Service-page categories this product surfaces in. Empty for
   *  components that only appear inside a combo. */
  category: ServiceCategory[];
  /** Set ⇒ this product has its own /services/{detailUrlCategory}/{slug}
   *  detail page. Omitted ⇒ component-only (no standalone detail page). */
  detailUrlCategory?: DetailUrlCategory;
  /** 1–2 image paths under /public. Combos carry two. */
  images: string[];
  /** Short homeowner-facing description (David's Bucket 3 copy). Shown on
   *  the service-page ProductCard. */
  description: string;
  /** Optional badge shown on the card. */
  badge?: string;
  /** Optional short feature bullets (legacy, unused today). */
  features?: string[];

  // ----- Detail-page content -----
  /** Tagline / strapline shown under the H1 on the detail page. */
  tagline?: string;
  /** Marketing intro paragraph for the detail-page hero. */
  fullDescription?: string;
  /** Full feature bullets (8-12 typically) for the "Key Features" block. */
  detailedFeatures?: string[];
  /** Self-hosted demo video — opened in a modal from the hero CTA. */
  videoPath?: string;
  /** Self-hosted PDF downloads. */
  documents?: ProductDocuments;
  /** Original Water-Right page URL — kept for traceability. */
  waterRightUrl?: string;
  /** For combo products: array of component product IDs. The detail page
   *  uses this to render the "What's in this combo" section and to
   *  aggregate component features into "Key Features". */
  comboComponents?: string[];
}

// ---------------------------------------------------------------------------
// DISPLAY DECISION — the ASP2 + IMPS dual-iron combo (`asp2-imps`)
// is tagged with both well-water categories so it renders in BOTH ferrous
// and ferric subsections of the well-water page. Its canonical detail-page
// URL lives under /services/well-water/asp2-imps regardless of entry point.
// ---------------------------------------------------------------------------

export const products: Product[] = [
  // ===== City water =====
  {
    id: "fc-1000",
    slug: "fc-1000",
    name: "FC-1000 System",
    brand: "Water-Right",
    category: ["city-water"],
    detailUrlCategory: "city-water",
    images: ["/products/FC-1000.png"],
    description:
      "Best for homeowners primarily dealing with chlorine taste/odor and moderate water hardness. A strong entry-level whole home solution for improving overall water quality.",
    // SOURCED FROM WATER-RIGHT (fc-1000-city-water-filter-with-scale-control-media)
    tagline:
      "Providing cleaner, better-tasting water, with built-in scale protection, for your whole home",
    fullDescription:
      "Designed for homes with city water, the A. O. Smith FC-1000 delivers whole-home filtration and salt-free scale reduction. This system improves water quality at every tap and helps protect plumbing and appliances.",
    detailedFeatures: [
      "Whole-Home Filtration: Premium coconut shell activated carbon reduces chlorine taste and odor throughout your home.",
      "Salt-Free Scale Control: Helps minimize scale buildup in pipes and hot water appliances — no salt, chemicals, or electricity required.",
      "Efficient Design: Vortech® plate technology and upflow service design improve flow and reduce pressure loss, with no need for backwashing.",
      "Low Maintenance: No drain line or power connection needed for operation.",
      "Protects Plumbing and Appliances: Effectively reduces internal scale buildup to help extend the life of your water-using systems.",
      "City Water Only: Not intended for use with well water or non-municipal sources.",
    ],
    documents: {
      manual: "/pdfs/products/fc-1000/manual.pdf",
      brochure: "/pdfs/products/fc-1000/brochure.pdf",
    },
    waterRightUrl:
      "https://www.water-right.com/products/fc-1000-city-water-filter-with-scale-control-media/",
  },
  {
    id: "imprc",
    slug: "imprc",
    name: "IMPRC Softener + Carbon Combo",
    brand: "Water-Right",
    category: ["city-water"],
    detailUrlCategory: "city-water",
    images: ["/products/IMPRC.jpg"],
    description:
      "Designed for homes with both hard water issues and noticeable chlorine and chloramine. Combines softening and filtration in one system for full-home protection.",
    // SOURCED FROM WATER-RIGHT (impression-plus-rc-series)
    tagline: "The trusted whole house water purification system",
    fullDescription:
      "Soft, odor-free water in an environmentally friendly tank design: that's the promise of Impression Plus® RC Series water softeners. Eliminating the need for two systems by combining everything you need in one tank. Activated carbon removes chlorine and other unwanted tastes, while high capacity resin maximizes softening capabilities. This unit is perfect for homes with municipal water.",
    detailedFeatures: [
      'Our unique "mid-plate" design eliminates the need for two tanks',
      "Backlit LED display",
      "Top tank flange for easy servicing",
      "The meter monitors and self-adjusts regeneration cycles, based on household water use trends",
      "Efficient to operate, using less water and energy, and with less wear on appliances",
      "Single tank design reduces pressure drops",
      "Extends the life of resin media on chlorinated water",
      "Advanced history, diagnostic screens, and lithium battery backup",
      "Upper flange on tank for convenient access",
    ],
    videoPath: "/videos/products/imprc.mp4",
    documents: {
      specs: "/pdfs/products/imprc/specs.pdf",
      manual: "/pdfs/products/imprc/manual.pdf",
      brochure: "/pdfs/products/imprc/brochure.pdf",
    },
    waterRightUrl:
      "https://www.water-right.com/products/impression-plus-rc-series/",
  },
  {
    id: "imprc-one-filter",
    slug: "imprc-one-filter",
    name: "IMPRC Softener + Carbon + ONE Filtration Combo",
    brand: "Water-Right",
    category: ["city-water"],
    detailUrlCategory: "city-water",
    images: ["/products/IMPRC.jpg", "/products/ONE Filter.jpg"],
    description:
      "High-performance solution for homes with elevated hardness and heavier water quality concerns. Ideal for larger homes or households wanting maximum filtration coverage.",
    tagline:
      "Whole-home softening + carbon + high-capacity particulate filtration in one combo.",
    fullDescription:
      "This combo pairs the Impression Plus® RC Series softener and carbon filter with the ONE® Cartridge Filter Tank for an extra layer of particulate removal. It is the most complete city-water solution we install — ideal for larger homes or households with elevated hardness and additional water quality concerns.",
    comboComponents: ["imprc", "one-filter"],
  },

  // ===== Well water: ferrous iron =====
  {
    id: "imp",
    slug: "imp",
    name: "IMP System",
    brand: "Water-Right",
    category: ["well-water-ferrous"],
    detailUrlCategory: "well-water",
    images: ["/products/IMP.jpg"],
    description:
      "Designed for homes dealing primarily with dissolved iron that causes staining after exposure to air. Helps prevent orange staining in fixtures, sinks, and laundry.",
    // SOURCED FROM WATER-RIGHT (impression-plus)
    tagline: "Soft water for you and your household.",
    fullDescription:
      "Whether you need to treat hard municipal water or want a well water system, Impression Plus Series® softeners make sure that only high quality soft water flows out of your faucet. An easy-to-read LED screen and user-friendly console let you monitor all operating functions.",
    detailedFeatures: [
      "NSF/ANSI 44 Tested and Certified",
      "Solid-state microprocessor controls",
      "Top tank flange for easy servicing",
      "Meter monitors and self-adjusts regeneration cycles based on household trend of water consumption",
      "Easily programmed for optimum performance",
      "Backlit LED display",
      'Flexible "adjustable cycle sequence" programming saves salt and water',
      "Advanced history and diagnostic screens and lithium battery backup",
      "Optional cabinet design offers excellent space savings",
    ],
    videoPath: "/videos/products/imp.mp4",
    documents: {
      specs: "/pdfs/products/imp/specs.pdf",
      manual: "/pdfs/products/imp/manual.pdf",
      brochure: "/pdfs/products/imp/brochure.pdf",
    },
    waterRightUrl: "https://www.water-right.com/products/impression-plus/",
  },
  {
    id: "asp2",
    slug: "asp2",
    name: "ASP2 System",
    brand: "Water-Right",
    category: ["well-water-ferrous"],
    detailUrlCategory: "well-water",
    images: ["/products/ASP2.jpg"],
    description:
      "A more advanced option for homes with higher iron levels or combined hardness concerns. Built for stronger, longer-lasting filtration performance.",
    // SOURCED FROM WATER-RIGHT (sanitizer-plus)
    tagline:
      "A new level of intelligence and innovation in water treatment",
    fullDescription:
      "Sanitizer Plus Series® performs like four water treatment systems, in a single unit. By combining our patented self-chlorinating technology* with advanced electronics, Sanitizer Plus softens, removes iron and manganese, and raises low pH levels.",
    detailedFeatures: [
      "Only our Crystal-Right™ media removes water hardness, iron, and manganese, and corrects low pH, in a single unit",
      "Our patented self-chlorinating technology* for controls odor caused by nuisance bacteria",
      "No chemicals or added equipment are needed, ever",
      'Visual and audible "Check Salt" indicator',
      "Overrun capacity protection",
      'Flexible "adjustable cycle sequence" programming that saves salt and water',
      "Advanced history and diagnostic screens",
      "The optional weather cover for outdoor installations",
      "An extended lithium battery backup",
    ],
    videoPath: "/videos/products/asp2.mp4",
    documents: {
      specs: "/pdfs/products/asp2/specs.pdf",
      manual: "/pdfs/products/asp2/manual.pdf",
      brochure: "/pdfs/products/asp2/brochure.pdf",
    },
    waterRightUrl: "https://www.water-right.com/products/sanitizer-plus/",
  },

  // ===== Well water: ferric iron =====
  // Ordered IMPFE + IMP first per David (May 27): lead with the high-capacity
  // air-injection solution, then the dual-iron combo below.
  {
    id: "impfe-imp",
    slug: "impfe-imp",
    name: "IMPFE + IMP System",
    brand: "Water-Right",
    category: ["well-water-ferric"],
    detailUrlCategory: "well-water",
    images: ["/products/IMPFE.jpg", "/products/IMP.jpg"],
    description:
      "High-capacity solution for more severe iron and sulfur conditions. Ideal for wells with heavy staining, odor, or long-term untreated water issues.",
    tagline:
      "Air-injection iron and sulfur removal paired with a high-capacity water softener.",
    fullDescription:
      "This combo pairs the Impression Plus® Air System (air-injection oxidation for severe iron and sulfur conditions) with the Impression Plus Series® Softener for hardness treatment. It is our recommended solution for wells with heavy staining, persistent odor, or long-term untreated water issues.",
    comboComponents: ["impfe", "imp"],
  },

  // ===== Well water: dual-iron combo (renders in BOTH ferrous and ferric) =====
  {
    id: "asp2-imps",
    slug: "asp2-imps",
    name: "ASP2 + IMPS Combo System",
    brand: "Water-Right",
    category: ["well-water-ferrous", "well-water-ferric"],
    detailUrlCategory: "well-water",
    images: ["/products/ASP2.jpg", "/products/IMPS.jpg"],
    description:
      "Used when both dissolved and already-oxidized iron are present. Provides more complete treatment for homes with persistent staining or recurring buildup issues.",
    badge: "Treats both iron types",
    tagline:
      "Comprehensive softening, iron, and sulfur treatment for variable well conditions.",
    fullDescription:
      "This combo pairs the Sanitizer Plus Series® Conditioner (softening + iron + manganese + pH correction in a single tank) with the Impression Plus® Air System (air-injection oxidation for sulfur and iron precipitate removal). It is used when both dissolved and already-oxidized iron are present — or when sulfur odor and hardness need to be tackled together.",
    comboComponents: ["asp2", "imps"],
  },

  // ===== Reverse osmosis =====
  {
    id: "impression-ro",
    slug: "impression-ro",
    name: "Impression RO System",
    brand: "Water-Right",
    category: ["ro"],
    detailUrlCategory: "ro-systems",
    images: ["/products/Impression RO.jpg"],
    description:
      "A reliable under-sink reverse osmosis system designed for everyday drinking water improvement. Ideal for households wanting clean, consistent water at a single faucet without complexity.",
    // SOURCED FROM WATER-RIGHT (impression-series-r-o)
    tagline: "Purified drinking water for your home",
    fullDescription:
      "Reduce harmful contaminants with the Impression® Reverse Osmosis, which turns common tap water into the fresh, quality water that nature intended us to drink. A four-stage system filters water down to the molecular level, then uses a final carbon filter to remove any unwanted tastes or odors. The result is simply healthier, better tasting water.",
    detailedFeatures: [
      "Multi-Stage filtration for purified drinking water",
      "Environmentally sound water treatment",
      "More cost-effective than bottled drinking water",
      "Fresh filtered water from your tap, at your convenience",
    ],
    documents: {
      specs: "/pdfs/products/impression-ro/specs.pdf",
      manual: "/pdfs/products/impression-ro/manual.pdf",
      brochure: "/pdfs/products/impression-ro/brochure.pdf",
    },
    waterRightUrl:
      "https://www.water-right.com/products/impression-series-r-o/",
  },
  {
    id: "quadpro",
    slug: "quadpro",
    name: "QuadPro RO System",
    brand: "Water-Right",
    category: ["ro"],
    detailUrlCategory: "ro-systems",
    images: ["/products/QuadPro-with-Carts.png"],
    description:
      "A higher-capacity system designed for households with higher usage or multiple connection points (kitchen + refrigerator/ice maker). Built for stronger flow and longer filter life.",
    // SOURCED FROM WATER-RIGHT (interflo-quadpro-sst-tankless-reverse-osmosis-system)
    tagline: "Innovative Technology for Clean Drinking Water",
    fullDescription:
      "InterFlo® QuadPro SST is a tankless reverse osmosis drinking water system that features Superior SmartFlow® Technology. This technology reduces waste while delivering the clean water you need. InterFlo® QuadPro SST provides three glasses of clean drinking water to every one glass of reject water, a significant increase compared to a typical RO system that produces 4-5 glasses of reject water for every one glass of clean water. And has an efficiency rating of 60%.",
    detailedFeatures: [
      "Clean water at a consistent rate",
      "Easy to replace filter cartridges",
      "Reduced potential for bacterial growth",
      "Efficiency rating of 60%",
      "Recovery rating of 74.5%",
      "3 glasses of clean water for every 1 glass of wastewater",
      "LED status alert notifications – know when to change the filters",
      "No airgap faucet to mitigate noise and leaking from faucet",
      "Patented InterFlo® QuadPro SST Reverse Osmosis membrane filter is designed for extended life of up to four years based on system use.",
    ],
    documents: {
      manual: "/pdfs/products/quadpro/manual.pdf",
      brochure: "/pdfs/products/quadpro/brochure.pdf",
    },
    waterRightUrl:
      "https://www.water-right.com/products/interflo-quadpro-sst-tankless-reverse-osmosis-system/",
  },

  // ===== Component-only products (no service-page listing, no detail page) =====
  // These are referenced exclusively via comboComponents from the 3 combos.
  // They carry their Water-Right marketing content so combo pages can
  // aggregate features and surface component documents.
  {
    id: "one-filter",
    slug: "one-filter",
    name: "ONE Cartridge Filter Tank",
    brand: "Water-Right",
    category: [],
    images: ["/products/ONE Filter.jpg"],
    description:
      "High-capacity cartridge filtration tank used as a particulate-removal stage alongside the IMPRC softener + carbon combo.",
    // SOURCED FROM WATER-RIGHT (one-cartridge-filter-tank)
    tagline: "Handle virtually any application.",
    fullDescription:
      "The unique ONE™ cartridge tank home water filtration system—designed to replace smaller, commonly used cartridge filters—is the ideal solution for the removal of a multitude of particulates. Water-Right's ONE system utilizes a variety of proprietary, large capacity cartridges which greatly extend replacement cycle times.",
    detailedFeatures: [
      "Cartridges specially designed for higher flow rates and higher contaminant retention capacities",
      "Wide variety of application-specific cartridges available",
      "Easy access to cartridge for service and replacement purposes — no special tools required",
      "Bottom drain allows particles to flush from the system and extends cartridge life",
      "Ideal for applications where pre- or post-filtration for particulates is needed",
      "Top mount valve including bypass",
    ],
    videoPath: "/videos/products/one-filter.mp4",
    documents: {
      specs: "/pdfs/products/one-filter/specs.pdf",
      manual: "/pdfs/products/one-filter/manual.pdf",
      brochure: "/pdfs/products/one-filter/brochure.pdf",
    },
    waterRightUrl:
      "https://www.water-right.com/products/one-cartridge-filter-tank/",
  },
  {
    id: "imps",
    slug: "imps",
    name: "IMPS Air System",
    brand: "Water-Right",
    category: [],
    images: ["/products/IMPS.jpg"],
    description:
      "Impression Plus® Air-Injected Sulfur (IMPS) filter — pairs with the ASP2 conditioner for combined hardness/iron/sulfur treatment.",
    // SOURCED FROM WATER-RIGHT (impression-plus-air-system)
    tagline: "Your chemical-free answer to water filtration",
    fullDescription:
      "Impression® and Impression® Plus Air-Injected Sulfur (IMPS) and Air-Injected Iron (IMPFE) Filters are extremely effective in removing sulfur and iron, commonly associated with problematic well-water. The systems use air-injection to oxidize sulfur or iron into precipitates that can be readily filtered and removed. Air filtration is environmentally safe — no toxic chemicals are used. The result is simply refreshingly good water from the tap, every time.",
    detailedFeatures: [
      "Patented 'Inch Worm' technology eliminates noisy air discharge",
      "Easily programmed for optimum performance",
      "Advanced history and diagnostic screens",
      "Extended lithium battery backup",
      "Extremely low-cost operation",
      "Environmentally safe",
      "Optional ozone kit for additional bacteria control (Available only on IMPS)",
      "Unique AirCat control features",
      "Exclusive backwash air technology",
      "Solves multiple water problems",
    ],
    videoPath: "/videos/products/imps.mp4",
    documents: {
      specs: "/pdfs/products/imps/specs.pdf",
      manual: "/pdfs/products/imps/manual.pdf",
      brochure: "/pdfs/products/imps/brochure.pdf",
    },
    waterRightUrl:
      "https://www.water-right.com/products/impression-plus-air-system/",
  },
  {
    id: "impfe",
    slug: "impfe",
    name: "IMPFE Air System",
    brand: "Water-Right",
    category: [],
    images: ["/products/IMPFE.jpg"],
    description:
      "Impression Plus® Air-Injected Iron (IMPFE) filter — pairs with the IMP softener for combined ferric-iron/hardness treatment.",
    // SOURCED FROM WATER-RIGHT (impression-plus-air-system — same page as IMPS)
    tagline: "Your chemical-free answer to water filtration",
    fullDescription:
      "Impression® and Impression® Plus Air-Injected Sulfur (IMPS) and Air-Injected Iron (IMPFE) Filters are extremely effective in removing sulfur and iron, commonly associated with problematic well-water. The systems use air-injection to oxidize sulfur or iron into precipitates that can be readily filtered and removed. Air filtration is environmentally safe — no toxic chemicals are used. The result is simply refreshingly good water from the tap, every time.",
    detailedFeatures: [
      "Patented 'Inch Worm' technology eliminates noisy air discharge",
      "Easily programmed for optimum performance",
      "Advanced history and diagnostic screens",
      "Extended lithium battery backup",
      "Extremely low-cost operation",
      "Environmentally safe",
      "Unique AirCat control features",
      "Exclusive backwash air technology",
      "Solves multiple water problems",
    ],
    videoPath: "/videos/products/impfe.mp4",
    documents: {
      specs: "/pdfs/products/impfe/specs.pdf",
      manual: "/pdfs/products/impfe/manual.pdf",
      brochure: "/pdfs/products/impfe/brochure.pdf",
    },
    waterRightUrl:
      "https://www.water-right.com/products/impression-plus-air-system/",
  },
];

/** All products tagged with the given category. Component-only products
 *  with `category: []` are naturally excluded. */
export function getProductsByCategory(category: ServiceCategory): Product[] {
  return products.filter((product) => product.category.includes(category));
}

/** Lookup a product by id/slug. Returns undefined when not found. */
export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

/** Products with their own detail page route (i.e. detailUrlCategory set). */
export function getProductsWithDetailPage(): Product[] {
  return products.filter((product) => product.detailUrlCategory !== undefined);
}

/** Other products with detail pages in the same service-page category,
 *  excluding `excludeSlug`. Used for the "Other Products to Consider"
 *  section on each product detail page. */
export function getRelatedProducts(
  product: Product,
  limit = 3,
): Product[] {
  if (product.category.length === 0) return [];
  return products.filter(
    (other) =>
      other.slug !== product.slug &&
      other.detailUrlCategory !== undefined &&
      other.category.some((c) => product.category.includes(c)),
  ).slice(0, limit);
}
