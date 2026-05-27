import type { Metadata } from "next";

import { ServicePageLayout } from "@/components/services/service-page-layout";
import {
  ServiceOverview2Col,
  ServiceColumn,
  ServiceBulletList,
  ServiceProductsSection,
  ServiceWhyItMatters,
} from "@/components/services/service-sections";

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
      subhead="Cleaner, better-tasting water for your Northeast Ohio home — from every tap."
    >
      <ServiceOverview2Col
        left={
          <ServiceColumn heading="What this system does">
            <p>
              Even though municipal water is treated for safety, it can still
              contain chlorine or chloramine, hardness minerals, and other
              elements that affect taste, odor, and long-term plumbing health.
            </p>
            <p>
              A whole-home filtration system treats water as it enters your
              home, so every faucet, shower, and appliance receives cleaner,
              better-balanced water.
            </p>
            <p>
              The result is simple: better tasting water, less buildup, and
              less wear on your plumbing and appliances.
            </p>
          </ServiceColumn>
        }
        right={
          <ServiceColumn heading="Common results homeowners notice">
            <ServiceBulletList
              items={[
                "Cleaner, better-tasting drinking water",
                "Less chlorine smell in showers",
                "Reduced scale buildup on fixtures and appliances",
                "Softer feel on skin and hair",
                "Less soap and detergent usage",
              ]}
            />
          </ServiceColumn>
        }
      />

      <ServiceProductsSection sections={[{ category: "city-water" }]} />

      <ServiceWhyItMatters
        intro="Hard water and disinfectant treatments are common across the region, and they can impact everything from plumbing performance to daily comfort."
        subhead="A properly designed whole-home system helps:"
        bullets={[
          "protect plumbing and appliances from scale buildup",
          "improve taste and odor at every tap",
          "reduce soap and detergent usage",
          "improve skin and hair comfort",
        ]}
      />
    </ServicePageLayout>
  );
}
