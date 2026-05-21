import type { Metadata } from "next";

import { ServicePageLayout } from "@/components/services/service-page-layout";

export const metadata: Metadata = {
  title: "Well Water Treatment",
  description:
    "Iron, sulfur, and hardness treatment for private well water in Northeast Ohio — solutions for both clear-water and red-water iron.",
};

export default function WellWaterPage() {
  return (
    <ServicePageLayout
      eyebrow="Water Filtration"
      title="Well Water Solutions"
      subhead="Iron, sulfur, and hardness treatment built around what is actually in your well."
      intro="Private well water in Northeast Ohio is untreated — what comes out of the ground is what reaches your taps, commonly iron, sulfur, and hardness. Iron shows up two ways: ferrous (clear-water) iron is dissolved and invisible until it oxidizes and stains, while ferric (red-water) iron has already oxidized and arrives visibly rusty. The right system depends on which kind you have — which is exactly what an on-site water test tells us."
      whyOhio={[
        "Private wells are common across rural and outer Northeast Ohio, and well water is unregulated — treatment is the homeowner's responsibility.",
        "Iron is one of the most common well-water problems in the region, leaving orange or brown stains on fixtures, laundry, and sinks.",
        "Sulfur — the 'rotten egg' smell — frequently accompanies iron in local well water.",
        "Matching the system to ferrous versus ferric iron is the difference between a fix that lasts and one that clogs.",
      ]}
      productSections={[
        {
          heading: "For clear-water (ferrous) iron",
          category: "well-water-ferrous",
        },
        {
          heading: "For red-water (ferric) iron",
          category: "well-water-ferric",
        },
      ]}
    />
  );
}
