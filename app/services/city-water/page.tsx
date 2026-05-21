import type { Metadata } from "next";

import { ServicePageLayout } from "@/components/services/service-page-layout";

export const metadata: Metadata = {
  title: "City Water Filtration",
  description:
    "Whole-home filtration and softening for Northeast Ohio municipal (city) water — better taste, less chlorine, and no hard-water scale.",
};

export default function CityWaterPage() {
  return (
    <ServicePageLayout
      eyebrow="Water Filtration"
      title="City Water Solutions"
      subhead="Cleaner, softer municipal water for your Northeast Ohio home."
      intro="Municipal water in Northeast Ohio is treated to be safe to drink, but it often arrives with chlorine or chloramine, hardness minerals, and a taste or smell you would rather not have. A whole-home system filters and softens the water as it enters your house, so every tap delivers cleaner, better-tasting water — and your plumbing, water heater, and appliances are protected from scale."
      whyOhio={[
        "Most Northeast Ohio cities disinfect their water with chlorine or chloramine, which can leave a noticeable taste and odor at the tap.",
        "Hard water is common across the region — it builds scale inside water heaters, fixtures, and appliances, shortening their lifespan.",
        "Filtered, softened water is gentler on skin, hair, and laundry, and it means less soap and detergent.",
        "Treating the water where it enters the home protects every fixture in the house, not just the kitchen sink.",
      ]}
      productSections={[{ category: "city-water" }]}
    />
  );
}
