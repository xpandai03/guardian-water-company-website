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
  title: "Well Water Treatment",
  description:
    "Iron, sulfur, and hardness treatment for private well water in Northeast Ohio — solutions for both clear-water and red-water iron.",
};

export default function WellWaterPage() {
  return (
    <ServicePageLayout
      eyebrow="Water Filtration"
      title="Well Water Solutions"
      subhead="Targeted treatment for iron, sulfur, and hard water issues common in Northeast Ohio wells."
    >
      <ServiceOverview2Col
        left={
          <ServiceColumn heading="What's in well water">
            <p>
              Unlike city water, private wells are not treated or regulated
              after they leave the ground. That means whatever is naturally
              present in the aquifer — or enters through the system — shows up
              at your taps.
            </p>
            <p className="font-semibold text-primary">
              In Northeast Ohio, the most common issues are:
            </p>
            <ServiceBulletList
              items={[
                "Iron staining in sinks, tubs, and laundry",
                "Sulfur odor (“rotten egg” smell)",
                "Hard water buildup in plumbing and appliances",
              ]}
            />
            <p>
              These issues vary from home to home, which is why testing is the
              first step.
            </p>
          </ServiceColumn>
        }
        right={
          <ServiceColumn heading="Why iron problems look different">
            <p>Iron can show up in two different ways:</p>
            <dl className="space-y-4">
              <div>
                <dt className="font-semibold text-primary">Ferrous Iron</dt>
                <dd className="mt-1 text-muted-foreground">
                  invisible at first, but turns orange or brown when exposed to
                  air
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-primary">Ferric Iron</dt>
                <dd className="mt-1 text-muted-foreground">
                  already oxidized, appearing rusty directly from the tap
                </dd>
              </div>
            </dl>
            <p>
              The treatment needed depends on which type is present — and many
              homes have a mix of both.
            </p>
            <p>
              This is why guessing usually leads to systems that don&apos;t
              fully solve the issue.
            </p>
          </ServiceColumn>
        }
      />

      <ServiceProductsSection
        intro="We design your system based on your water test results. Every home is different, but these are the most common solutions we install."
        sections={[
          {
            heading: "Ferrous Iron Treatment",
            category: "well-water-ferrous",
          },
          {
            heading: "Ferric Iron Treatment",
            category: "well-water-ferric",
          },
        ]}
      />

      <ServiceWhyItMatters
        intro="Well water in this region is highly variable — even neighboring homes can have completely different water conditions."
        subhead="Common effects include:"
        bullets={[
          "Orange or brown staining on fixtures and laundry",
          "Sulfur odors in showers and faucets",
          "Reduced lifespan of plumbing and appliances",
          "Frequent cleaning and maintenance issues",
        ]}
        closing="Proper treatment depends on matching the system to your exact water chemistry — not assumptions."
      />
    </ServicePageLayout>
  );
}
