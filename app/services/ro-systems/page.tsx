import type { Metadata } from "next";

import { ServicePageLayout } from "@/components/services/service-page-layout";

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
      subhead="Drinking-water-grade purification, right at your kitchen sink."
      intro="Reverse osmosis (RO) pushes water through an ultra-fine membrane that removes dissolved solids, tastes, and contaminants whole-home filtration is not designed to catch. An RO system installs under the kitchen sink and feeds a dedicated faucet — and often the refrigerator and ice maker — so the water you drink and cook with is as clean as it gets."
      whyOhio={[
        "RO is the finishing step for drinking water — it complements, rather than replaces, whole-home filtration or softening.",
        "It removes dissolved solids that affect taste, giving consistently crisp water for drinking, coffee, and cooking.",
        "An under-sink system keeps purified water on tap without the cost and plastic waste of bottled water.",
        "Connected to the refrigerator line, it means cleaner ice and chilled water too.",
      ]}
      productSections={[{ category: "ro" }]}
    />
  );
}
