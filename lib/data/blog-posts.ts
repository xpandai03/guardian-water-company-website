// Blog catalogue for /blog and /blog/[slug].
//
// Source: David's six article PDFs delivered 2026-05-24 (kept untracked in
// /BlogPosts/). Body content is preserved verbatim — section headings, bullet
// lists, and paragraph breaks all match the originals. Related products link
// each post to one or more product detail pages from /lib/data/products.ts.

export type BlogBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: readonly string[] };

export interface BlogPost {
  /** Kebab-case URL slug — used in /blog/[slug]. */
  slug: string;
  /** Article title (verbatim from David's PDF). */
  title: string;
  /** Short summary (1-2 sentences) shown on the index card. */
  excerpt: string;
  /** ISO date the article was delivered. */
  publishedAt: string;
  /** Estimated read time at ~200 wpm. */
  readingMinutes: number;
  /** Structured body content — each block renders distinctly in the layout. */
  body: readonly BlogBlock[];
  /** Optional product slugs for the "Related Products" rail. */
  relatedProductSlugs?: readonly string[];
}

export const blogPosts: BlogPost[] = [
  // 1. Water softeners / hard water
  {
    slug: "do-you-need-a-water-softener-in-northeast-ohio",
    title: "Do You Need a Water Softener in Northeast Ohio?",
    excerpt:
      "Hard water is extremely common across Northeast Ohio — and most homeowners don't realize how much damage it may quietly be doing. Spotted dishes, dry skin, and shortened appliance life are the first signs.",
    publishedAt: "2026-05-24",
    readingMinutes: 3,
    relatedProductSlugs: ["imp", "imprc", "imprc-one-filter"],
    body: [
      {
        type: "p",
        text: "Many homeowners throughout Northeast Ohio deal with hard water every day without realizing how much damage it may be causing inside their home.",
      },
      {
        type: "p",
        text: "Hard water is extremely common in Ohio and can impact everything from plumbing and appliances to skin, hair, laundry, and water heating efficiency.",
      },
      {
        type: "p",
        text: "If you have noticed buildup on fixtures, dry skin after showering, or white spots on dishes, there is a good chance your home may benefit from a water softener.",
      },
      { type: "h2", text: "What Is Hard Water?" },
      {
        type: "p",
        text: "Hard water contains elevated levels of dissolved minerals, primarily calcium and magnesium. As water moves through underground rock and soil, it picks up these minerals before reaching your home.",
      },
      {
        type: "p",
        text: "While hard water is generally not considered dangerous to drink, it can create a wide range of household problems.",
      },
      { type: "h2", text: "Signs You May Have Hard Water" },
      { type: "h3", text: "White Buildup on Fixtures" },
      {
        type: "p",
        text: "One of the most common signs of hard water is white chalky buildup around faucets, showerheads, and sinks.",
      },
      {
        type: "p",
        text: "This mineral buildup can become difficult to remove over time.",
      },
      { type: "h3", text: "Spots on Dishes and Glassware" },
      {
        type: "p",
        text: "Hard water often leaves spots and streaks on dishes even after washing.",
      },
      { type: "h3", text: "Dry Skin and Hair" },
      {
        type: "p",
        text: "Minerals in hard water can make it more difficult for soap to rinse cleanly, which may leave skin feeling dry or irritated.",
      },
      { type: "h3", text: "Soap Doesn't Lather Well" },
      {
        type: "p",
        text: "Hard water reduces soap efficiency, causing homeowners to use more soap and cleaning products.",
      },
      { type: "h3", text: "Appliance Damage" },
      { type: "p", text: "Mineral buildup can accumulate inside:" },
      {
        type: "ul",
        items: [
          "Water heaters",
          "Dishwashers",
          "Washing machines",
          "Pipes",
          "Coffee makers",
        ],
      },
      {
        type: "p",
        text: "Over time, this buildup can reduce efficiency and shorten appliance lifespan.",
      },
      { type: "h2", text: "How a Water Softener Works" },
      {
        type: "p",
        text: "A water softener removes hardness minerals through a process called ion exchange.",
      },
      {
        type: "p",
        text: "The system replaces calcium and magnesium with sodium or potassium, helping reduce mineral buildup throughout the home.",
      },
      { type: "h2", text: "Benefits of a Water Softener" },
      { type: "p", text: "Installing a water softener may help:" },
      {
        type: "ul",
        items: [
          "Extend appliance lifespan",
          "Improve soap performance",
          "Reduce plumbing buildup",
          "Improve skin and hair feel",
          "Reduce cleaning time",
          "Improve water heater efficiency",
        ],
      },
      { type: "h2", text: "Is Hard Water Common in Northeast Ohio?" },
      {
        type: "p",
        text: "Yes. Many areas throughout Medina County, Cuyahoga County, Summit County, and surrounding communities experience moderate to high water hardness.",
      },
      {
        type: "p",
        text: "Homes with private wells may experience even higher hardness levels.",
      },
      { type: "h2", text: "Should You Get Your Water Tested?" },
      {
        type: "p",
        text: "Testing is the best way to determine your water hardness level and identify any additional issues like iron, sulfur, chlorine, or sediment.",
      },
      {
        type: "p",
        text: "Many homeowners discover they need more than just a water softener depending on their specific water conditions.",
      },
      { type: "h2", text: "Final Thoughts" },
      {
        type: "p",
        text: "If your home has hard water, a properly sized water softener can improve water quality while helping protect your plumbing and appliances.",
      },
      {
        type: "p",
        text: "The key is selecting the right system based on your household size, water usage, and overall water conditions.",
      },
    ],
  },

  // 2. Medina County water problems overview
  {
    slug: "whats-really-in-medina-county-water",
    title:
      "What's Really in Medina County Water? Common Water Problems Homeowners Should Know",
    excerpt:
      "Even when your tap water looks clean, taste, odor, staining, and buildup can still be hiding underneath. Here's what we see most often in Medina County homes — and how to start figuring out what's actually in your water.",
    publishedAt: "2026-05-24",
    readingMinutes: 4,
    relatedProductSlugs: ["fc-1000", "imprc", "impression-ro"],
    body: [
      {
        type: "p",
        text: "If you live in Medina County, your water may look clean when it comes out of the tap — but many homeowners still experience issues with taste, odor, staining, buildup, and overall water quality.",
      },
      {
        type: "p",
        text: "Throughout Northeast Ohio, water conditions can vary significantly depending on whether your home uses municipal water or a private well. Understanding the most common water problems in Medina County can help homeowners protect their plumbing, appliances, and drinking water.",
      },
      { type: "h2", text: "Common Water Problems in Medina County" },
      { type: "h3", text: "Hard Water" },
      {
        type: "p",
        text: "Hard water is one of the most common complaints among homeowners in Medina County and surrounding areas. Hard water contains elevated levels of minerals like calcium and magnesium.",
      },
      { type: "p", text: "Signs of hard water include:" },
      {
        type: "ul",
        items: [
          "White buildup on faucets and showerheads",
          "Spots on dishes and glassware",
          "Dry skin and hair after showering",
          "Soap that does not lather properly",
          "Reduced efficiency of water heaters and appliances",
        ],
      },
      {
        type: "p",
        text: "Over time, hard water can shorten the lifespan of dishwashers, washing machines, and water heaters.",
      },
      { type: "h3", text: "Chlorine Taste and Odor" },
      {
        type: "p",
        text: "Many municipal water systems use chlorine during the treatment process to disinfect water before it reaches homes. While this helps kill bacteria, some homeowners dislike the strong taste or smell chlorine can leave behind.",
      },
      {
        type: "p",
        text: "A carbon filtration system can often help reduce chlorine taste and odor while improving overall water quality.",
      },
      { type: "h3", text: "Iron Staining" },
      {
        type: "p",
        text: "Homes with well water throughout Medina County often experience elevated iron levels. Iron in water can create:",
      },
      {
        type: "ul",
        items: [
          "Orange or reddish stains in sinks and toilets",
          "Metallic taste",
          "Laundry staining",
          "Buildup inside plumbing fixtures",
        ],
      },
      {
        type: "p",
        text: "Iron filtration systems are commonly used to address these issues.",
      },
      { type: "h3", text: "Sulfur or Rotten Egg Smell" },
      {
        type: "p",
        text: "A rotten egg smell is often caused by hydrogen sulfide gas or sulfur bacteria in the water supply. This issue is more common in homes using private wells.",
      },
      {
        type: "p",
        text: "The smell can become especially noticeable when using hot water.",
      },
      { type: "h3", text: "Sediment and Cloudy Water" },
      {
        type: "p",
        text: "Some homeowners experience sediment, sand, or cloudy water due to aging plumbing, well conditions, or mineral content.",
      },
      {
        type: "p",
        text: "Sediment filtration systems can help improve clarity and protect appliances.",
      },
      { type: "h2", text: "City Water vs Well Water in Medina County" },
      {
        type: "p",
        text: "Homeowners using municipal water often deal with chlorine, hardness, and taste concerns. Homes with private wells may experience iron, sulfur, bacteria, sediment, or fluctuating water conditions.",
      },
      {
        type: "p",
        text: "Because water quality varies from one property to another, testing is one of the best ways to determine what is actually in your water.",
      },
      { type: "h2", text: "Why Water Testing Matters" },
      { type: "p", text: "A professional water test can identify:" },
      {
        type: "ul",
        items: [
          "Water hardness levels",
          "Iron content",
          "Chlorine levels",
          "Sulfur issues",
          "Sediment",
          "pH imbalance",
          "Other water quality concerns",
        ],
      },
      {
        type: "p",
        text: "Without testing, many homeowners end up purchasing the wrong filtration equipment.",
      },
      { type: "h2", text: "Finding the Right Water Filtration System" },
      {
        type: "p",
        text: "The best filtration solution depends on your specific water conditions.",
      },
      { type: "p", text: "Common systems used in Medina County homes include:" },
      {
        type: "ul",
        items: [
          "Water softeners",
          "Whole-house carbon filtration systems",
          "Reverse osmosis drinking water systems",
          "Iron filtration systems",
          "UV purification systems",
          "Sediment filters",
        ],
      },
      { type: "h2", text: "Final Thoughts" },
      {
        type: "p",
        text: "Water quality issues are extremely common throughout Medina County and Northeast Ohio. Whether you are noticing hard water buildup, staining, odor issues, or unpleasant taste, the right water treatment system can significantly improve your home's water.",
      },
      {
        type: "p",
        text: "The first step is understanding what is actually in your water through proper testing and evaluation.",
      },
    ],
  },

  // 3. Well vs city water
  {
    slug: "well-water-vs-city-water-in-northeast-ohio",
    title: "Well Water vs City Water in Northeast Ohio: Which Is Better?",
    excerpt:
      "Some Northeast Ohio homes pull from a municipal supply, others from a private well — and the right filtration depends on which you have. A side-by-side look at the typical problems with each.",
    publishedAt: "2026-05-24",
    readingMinutes: 3,
    relatedProductSlugs: ["imprc", "imp", "impfe-imp"],
    body: [
      {
        type: "p",
        text: "Throughout Northeast Ohio, some homes rely on municipal water systems while others use private wells. Each water source has advantages and potential challenges.",
      },
      {
        type: "p",
        text: "Understanding the differences between well water and city water can help homeowners determine what type of filtration system may be best for their home.",
      },
      { type: "h2", text: "What Is City Water?" },
      {
        type: "p",
        text: "City water is treated by a municipal water facility before being distributed to homes.",
      },
      {
        type: "p",
        text: "Municipal systems typically disinfect water using chlorine or chloramine and test water regularly according to government regulations.",
      },
      { type: "h2", text: "Common Concerns with City Water" },
      { type: "h3", text: "Chlorine Taste and Odor" },
      {
        type: "p",
        text: "Many homeowners dislike the taste or smell associated with chlorine-treated water.",
      },
      { type: "h3", text: "Aging Infrastructure" },
      {
        type: "p",
        text: "Older plumbing systems and infrastructure can sometimes impact water quality before it reaches your home.",
      },
      { type: "h3", text: "Hard Water" },
      {
        type: "p",
        text: "Many municipal systems throughout Northeast Ohio still contain significant mineral content.",
      },
      { type: "h2", text: "What Is Well Water?" },
      {
        type: "p",
        text: "Well water comes directly from underground groundwater sources located on private property.",
      },
      {
        type: "p",
        text: "Unlike municipal water, private well owners are responsible for monitoring and maintaining their own water quality.",
      },
      { type: "h2", text: "Common Well Water Problems" },
      { type: "h3", text: "Iron" },
      {
        type: "p",
        text: "High iron levels are common in well water and can create staining and metallic taste.",
      },
      { type: "h3", text: "Sulfur Smell" },
      {
        type: "p",
        text: "Hydrogen sulfide gas can create a rotten egg odor.",
      },
      { type: "h3", text: "Sediment" },
      {
        type: "p",
        text: "Well systems may contain dirt, sand, or sediment particles.",
      },
      { type: "h3", text: "Bacteria" },
      {
        type: "p",
        text: "Private wells may require periodic bacteria testing and disinfection.",
      },
      { type: "h3", text: "Hard Water" },
      {
        type: "p",
        text: "Many wells throughout Northeast Ohio also experience high hardness levels.",
      },
      { type: "h2", text: "Which Water Source Is Better?" },
      {
        type: "p",
        text: "Neither system is automatically better. Each home's water quality depends on multiple factors including:",
      },
      {
        type: "ul",
        items: [
          "Location",
          "Plumbing condition",
          "Water source",
          "Treatment methods",
          "Geological conditions",
        ],
      },
      {
        type: "p",
        text: "Many homes using both city water and well water benefit from filtration systems.",
      },
      { type: "h2", text: "Common Water Filtration Solutions" },
      { type: "h3", text: "For City Water" },
      {
        type: "ul",
        items: [
          "Carbon filtration systems",
          "Water softeners",
          "Reverse osmosis systems",
        ],
      },
      { type: "h3", text: "For Well Water" },
      {
        type: "ul",
        items: [
          "Iron filters",
          "Sulfur removal systems",
          "UV purification systems",
          "Sediment filtration",
          "Water softeners",
        ],
      },
      { type: "h2", text: "Why Water Testing Is Important" },
      {
        type: "p",
        text: "Testing helps homeowners identify the exact issues affecting their water.",
      },
      {
        type: "p",
        text: "Without testing, it is difficult to determine the right treatment solution.",
      },
      { type: "h2", text: "Final Thoughts" },
      {
        type: "p",
        text: "Whether your home uses well water or city water, proper filtration can improve water quality, taste, odor, and appliance protection.",
      },
      {
        type: "p",
        text: "Every home is different, which is why customized water testing and system recommendations are important.",
      },
    ],
  },

  // 4. 5 signs your home needs whole-house filtration
  {
    slug: "5-signs-your-home-needs-whole-house-filtration",
    title:
      "5 Signs Your Home in Cuyahoga County Needs a Whole House Water Filtration System",
    excerpt:
      "Your water can look clear and still cause real problems at home. Five everyday signs in Cuyahoga County that a whole-house filtration system is worth a closer look.",
    publishedAt: "2026-05-24",
    readingMinutes: 2,
    relatedProductSlugs: ["fc-1000", "imprc", "imprc-one-filter"],
    body: [
      {
        type: "p",
        text: "Many homeowners assume their water is fine as long as it looks clear. However, water quality problems often show up through subtle signs throughout the home.",
      },
      {
        type: "p",
        text: "If you live in Cuyahoga County and have noticed taste, odor, or buildup issues, a whole-house water filtration system may help improve your home's water quality.",
      },
      { type: "h2", text: "1. Your Water Has a Strong Taste or Smell" },
      {
        type: "p",
        text: "If your water smells like chlorine or tastes unpleasant, contaminants or treatment chemicals may be affecting your water quality.",
      },
      {
        type: "p",
        text: "Whole-house carbon filtration systems are commonly used to improve taste and odor.",
      },
      { type: "h2", text: "2. You Notice White Buildup Around Fixtures" },
      {
        type: "p",
        text: "White residue around sinks and faucets is often caused by hard water minerals.",
      },
      {
        type: "p",
        text: "Over time, this buildup can damage plumbing fixtures and appliances.",
      },
      { type: "h2", text: "3. Your Skin and Hair Feel Dry After Showering" },
      {
        type: "p",
        text: "Hard water and chlorine exposure may contribute to dry skin and hair.",
      },
      {
        type: "p",
        text: "Many homeowners notice improvement after installing water treatment systems.",
      },
      { type: "h2", text: "4. You Have Staining in Sinks or Toilets" },
      {
        type: "p",
        text: "Orange, brown, or black stains may indicate iron, manganese, or other mineral issues.",
      },
      {
        type: "p",
        text: "These issues are especially common in homes with well water.",
      },
      { type: "h2", text: "5. Your Appliances Seem to Wear Out Quickly" },
      {
        type: "p",
        text: "Water heaters, dishwashers, and washing machines can all suffer from mineral buildup over time.",
      },
      {
        type: "p",
        text: "Treating your water may help improve efficiency and extend appliance lifespan.",
      },
      { type: "h2", text: "What Is a Whole-House Water Filter?" },
      {
        type: "p",
        text: "A whole-house filtration system treats water as it enters the home so filtered water is distributed throughout the property.",
      },
      { type: "p", text: "Depending on the system, filtration may target:" },
      {
        type: "ul",
        items: [
          "Chlorine",
          "Sediment",
          "Hardness minerals",
          "Iron",
          "Sulfur",
          "Odor",
          "Taste",
        ],
      },
      { type: "h2", text: "Choosing the Right System" },
      { type: "p", text: "No single system works for every home." },
      { type: "p", text: "The best solution depends on:" },
      {
        type: "ul",
        items: [
          "Water source",
          "Household size",
          "Water test results",
          "Specific water concerns",
        ],
      },
      { type: "h2", text: "Final Thoughts" },
      {
        type: "p",
        text: "If you are noticing water quality problems throughout your home, a professional water test can help identify the cause.",
      },
      {
        type: "p",
        text: "The right whole-house filtration system can improve water quality while protecting plumbing and appliances.",
      },
    ],
  },

  // 5. Why NE Ohio homes struggle with hard water
  {
    slug: "why-northeast-ohio-homes-struggle-with-hard-water",
    title: "Why Northeast Ohio Homes Struggle with Hard Water",
    excerpt:
      "Hard water is one of the most common water quality issues in Northeast Ohio. Here's why it shows up in so many homes — and what it takes to actually fix it.",
    publishedAt: "2026-05-24",
    readingMinutes: 2,
    relatedProductSlugs: ["imp", "imprc"],
    body: [
      {
        type: "p",
        text: "Hard water is one of the most common water quality problems throughout Northeast Ohio.",
      },
      {
        type: "p",
        text: "Many homeowners experience mineral buildup, dry skin, cloudy dishes, and appliance issues without fully understanding the cause.",
      },
      { type: "h2", text: "What Causes Hard Water?" },
      {
        type: "p",
        text: "Hard water forms when groundwater travels through rock and soil containing calcium and magnesium.",
      },
      {
        type: "p",
        text: "These minerals dissolve into the water supply before entering homes.",
      },
      {
        type: "p",
        text: "Because of Northeast Ohio's geology, hard water is common throughout the region.",
      },
      { type: "h2", text: "Common Signs of Hard Water" },
      { type: "h3", text: "Mineral Buildup" },
      {
        type: "p",
        text: "White residue on fixtures and showerheads is one of the most noticeable signs.",
      },
      { type: "h3", text: "Dry Skin and Hair" },
      {
        type: "p",
        text: "Hard water can make it more difficult to rinse soap completely.",
      },
      { type: "h3", text: "Soap Scum" },
      {
        type: "p",
        text: "Soap reacts with minerals in hard water, creating buildup on tubs and showers.",
      },
      { type: "h3", text: "Reduced Appliance Efficiency" },
      {
        type: "p",
        text: "Mineral deposits can build up inside appliances and plumbing.",
      },
      { type: "h2", text: "How Hard Water Affects Your Home" },
      { type: "p", text: "Hard water can impact:" },
      {
        type: "ul",
        items: [
          "Water heaters",
          "Dishwashers",
          "Washing machines",
          "Plumbing systems",
          "Faucets and fixtures",
          "Laundry quality",
        ],
      },
      {
        type: "p",
        text: "Over time, mineral buildup may increase maintenance costs and reduce efficiency.",
      },
      { type: "h2", text: "Are Water Softeners Worth It?" },
      {
        type: "p",
        text: "For many Northeast Ohio homeowners, water softeners can help reduce mineral buildup and improve overall water quality.",
      },
      { type: "p", text: "Benefits often include:" },
      {
        type: "ul",
        items: [
          "Cleaner dishes",
          "Softer laundry",
          "Easier cleaning",
          "Improved appliance performance",
          "Reduced scale buildup",
        ],
      },
      { type: "h2", text: "Additional Filtration May Be Needed" },
      { type: "p", text: "Some homes may also require:" },
      {
        type: "ul",
        items: [
          "Carbon filtration",
          "Iron filtration",
          "Reverse osmosis systems",
          "Sediment filters",
        ],
      },
      { type: "p", text: "A water test can help determine the best setup." },
      { type: "h2", text: "Final Thoughts" },
      {
        type: "p",
        text: "Hard water is extremely common throughout Northeast Ohio, but proper water treatment can help reduce its impact on your home.",
      },
      {
        type: "p",
        text: "Testing your water is the first step toward selecting the right solution.",
      },
    ],
  },

  // 6. Cleveland tap water safety
  {
    slug: "is-cleveland-tap-water-safe-to-drink",
    title: "Is Cleveland Tap Water Safe to Drink?",
    excerpt:
      "Cleveland tap water is treated and regulated — but many homeowners still want better taste, less chlorine, and cleaner drinking water. Here's what to know.",
    publishedAt: "2026-05-24",
    readingMinutes: 2,
    relatedProductSlugs: ["fc-1000", "impression-ro", "quadpro"],
    body: [
      {
        type: "p",
        text: "Many homeowners throughout Cleveland and Northeast Ohio wonder whether their tap water is truly safe to drink.",
      },
      {
        type: "p",
        text: "Municipal water systems are regulated and treated according to federal and state standards, but homeowners may still experience concerns related to taste, odor, aging infrastructure, or household plumbing.",
      },
      { type: "h2", text: "How Cleveland Water Is Treated" },
      {
        type: "p",
        text: "Municipal water systems use treatment processes designed to remove contaminants and disinfect water before it reaches homes.",
      },
      { type: "p", text: "This often includes:" },
      {
        type: "ul",
        items: [
          "Filtration",
          "Disinfection with chlorine or chloramine",
          "Water quality testing",
        ],
      },
      { type: "h2", text: "Common Concerns Homeowners Have" },
      { type: "h3", text: "Chlorine Taste and Smell" },
      {
        type: "p",
        text: "Many residents notice chlorine odor or taste in their tap water.",
      },
      { type: "h3", text: "Older Plumbing Systems" },
      {
        type: "p",
        text: "Older homes may contain aging plumbing components that impact water quality.",
      },
      { type: "h3", text: "Hard Water Minerals" },
      {
        type: "p",
        text: "Mineral content can create buildup and affect taste.",
      },
      { type: "h3", text: "Sediment or Discoloration" },
      {
        type: "p",
        text: "Temporary discoloration can sometimes occur due to infrastructure maintenance or pipe disturbances.",
      },
      { type: "h2", text: "Should You Filter Cleveland Tap Water?" },
      {
        type: "p",
        text: "Many homeowners choose to install filtration systems to improve:",
      },
      {
        type: "ul",
        items: [
          "Taste",
          "Odor",
          "Water clarity",
          "Mineral reduction",
          "Drinking water quality",
        ],
      },
      { type: "p", text: "Popular systems include:" },
      {
        type: "ul",
        items: [
          "Carbon filtration",
          "Reverse osmosis systems",
          "Water softeners",
          "Whole-house filtration systems",
        ],
      },
      { type: "h2", text: "The Importance of Water Testing" },
      { type: "p", text: "Every home is different." },
      { type: "p", text: "Testing can help identify:" },
      {
        type: "ul",
        items: [
          "Water hardness",
          "Chlorine levels",
          "Iron",
          "Sediment",
          "Plumbing-related concerns",
        ],
      },
      { type: "h2", text: "Final Thoughts" },
      {
        type: "p",
        text: "Cleveland tap water undergoes treatment and testing, but many homeowners still choose to improve their water quality with additional filtration systems.",
      },
      {
        type: "p",
        text: "The best approach depends on your home's plumbing, water source, and personal preferences.",
      },
    ],
  },
];

/** Lookup a blog post by slug. */
export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

/** Returns posts ordered as they appear in the array (David's intended order). */
export function getAllBlogPosts(): BlogPost[] {
  return blogPosts;
}
