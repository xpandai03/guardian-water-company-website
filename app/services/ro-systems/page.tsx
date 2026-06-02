import type { Metadata } from "next";

import { ServicePageLayout } from "@/components/services/service-page-layout";
import {
  ServiceOverview2Col,
  ServiceColumn,
  ServiceBulletList,
  ServiceProductsSection,
} from "@/components/services/service-sections";

export const metadata: Metadata = {
  title: "Reverse Osmosis Systems",
  description:
    "Reverse osmosis drinking water systems for Northeast Ohio homes — crisp, purified water for drinking, cooking, and ice.",
};

export default function RoSystemsPage() {
  return (
    <ServicePageLayout
      eyebrow="Water Filtration"
      title="Reverse Osmosis Systems"
      subhead="Ultra-clean drinking water from a dedicated kitchen tap."
    >
      <ServiceOverview2Col
        left={
          <ServiceColumn heading="What it does">
            <p>
              Reverse osmosis is a point-of-use purification system installed
              under your kitchen sink that refines your drinking and cooking
              water.
            </p>
            <p>
              It is designed to go beyond whole-home filtration by reducing
              dissolved solids that affect taste, clarity, and overall water
              quality — giving you consistently clean water for drinking,
              cooking, coffee, and ice.
            </p>
          </ServiceColumn>
        }
        right={
          <ServiceColumn heading="Where it fits in your home">
            <p>RO systems are typically used alongside a whole-home system.</p>
            <ServiceBulletList
              items={[
                "Whole-home filtration treats all the water entering your house",
                "Reverse osmosis refines the water you actually consume",
              ]}
            />
            <p>
              Together, they create complete water coverage for your home.
            </p>
          </ServiceColumn>
        }
      />

      <ServiceProductsSection
        intro="We size and select your RO system based on household usage, water test results, and whether it will be connected to additional appliances like refrigerators or ice makers."
        sections={[{ category: "ro" }]}
        image={{
          src: "/assets/david/under-sink-photo.png",
          alt: "Under-sink reverse osmosis installation",
        }}
      />

      {/* "What homeowners notice" + "Why it matters" — side-by-side pair per David. */}
      <ServiceOverview2Col
        left={
          <ServiceColumn heading="What homeowners notice">
            <ServiceBulletList
              items={[
                "Cleaner, crisp-tasting drinking water",
                "Better coffee and cooking results",
                "No bottled water dependency",
                "Cleaner ice from refrigerator lines",
                "Consistent quality straight from the tap",
              ]}
            />
          </ServiceColumn>
        }
        right={
          <ServiceColumn heading="Why it matters in Northeast Ohio">
            <p>
              Even after whole-home filtration, many households choose RO as an
              added layer of purification for drinking water.
            </p>
            <p className="font-semibold text-primary">It helps ensure:</p>
            <ServiceBulletList
              items={[
                "consistently clean taste regardless of source water fluctuations",
                "reduced reliance on bottled water",
                "improved quality for cooking and beverages",
                "cleaner ice and refrigerator water supply",
              ]}
            />
          </ServiceColumn>
        }
      />
    </ServicePageLayout>
  );
}
