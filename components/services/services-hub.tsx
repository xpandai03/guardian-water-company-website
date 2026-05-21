import Link from "next/link";
import { Building2, Droplets, GlassWater, ArrowRight } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";

// Hub body for /services — 3 category cards linking to the service sub-pages.
// Mirrors the ServicesOverview card pattern, with the water-source structure.
const categories = [
  {
    href: "/services/city-water",
    icon: Building2,
    title: "City Water",
    description:
      "Municipal water carries chlorine, hardness, and taste or odor issues. We filter and soften it for cleaner water at every tap.",
  },
  {
    href: "/services/well-water",
    icon: Droplets,
    title: "Well Water",
    description:
      "Private wells often bring iron staining, sulfur smell, and hardness. We diagnose ferrous vs. ferric iron and treat accordingly.",
  },
  {
    href: "/services/ro-systems",
    icon: GlassWater,
    title: "RO Systems",
    description:
      "Reverse osmosis delivers drinking-water-grade purity at the kitchen sink — crisp water for drinking, cooking, and ice.",
  },
] as const;

export function ServicesHub() {
  return (
    <Section bg="muted">
      <Container>
        <ul className="grid gap-6 md:grid-cols-3">
          {categories.map((category) => (
            <li key={category.href}>
              <Link
                href={category.href}
                className="group flex h-full flex-col rounded-2xl border border-border bg-card p-7 transition hover:border-accent/50 hover:shadow-md"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft">
                  <category.icon
                    className="h-6 w-6 text-accent"
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                </div>
                <h2 className="mb-2 text-xl font-bold text-primary">
                  {category.title}
                </h2>
                <p className="mb-6 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {category.description}
                </p>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-accent transition-all group-hover:gap-2">
                  Learn more
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
