import { Droplets, Sparkles, Wrench, Leaf, GlassWater, Settings } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";

// Six-benefit grid. Content is unchanged from the v0 baseline (it already
// matches Apex's "Why Choose" pattern — reference/apex/03-why-choose-desktop.png).
// Phase 2 visual change: icon bubbles switch from navy to aqua-soft per
// FRONTEND_PLAN.md §2.J review note.
const benefits = [
  {
    icon: GlassWater,
    title: "Healthier Drinking Water",
    description: "Removes harmful contaminants like heavy metals and bacteria, giving you cleaner, safer water.",
  },
  {
    icon: Sparkles,
    title: "Gentle on Skin & Hair",
    description: "Softened water prevents dryness and irritation, keeping skin and hair healthier and hydrated.",
  },
  {
    icon: Wrench,
    title: "Protects Plumbing & Appliances",
    description: "Prevents scale buildup, protecting pipes and fixtures while extending the lifespan of appliances.",
  },
  {
    icon: Leaf,
    title: "Eco-Friendly & Cost-Effective",
    description: "Reduce bottled water waste, save money, and enjoy clean, great-tasting water at home.",
  },
  {
    icon: Droplets,
    title: "Better-Tasting & Odor-Free",
    description: "Eliminates chlorine taste and impurities, delivering fresh, crisp, great-tasting water.",
  },
  {
    icon: Settings,
    title: "Tailored to Your Needs",
    description: "Custom filtration matched to your home, improving taste, purity, and overall water quality.",
  },
] as const;

export function Benefits() {
  return (
    <Section bg="muted">
      <Container>
        <div className="text-center mb-14 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-primary">
            Why Northeast Ohio homeowners choose us
          </h2>
        </div>

        <ul className="grid gap-x-12 gap-y-10 md:grid-cols-2 max-w-5xl mx-auto">
          {benefits.map((benefit) => (
            <li key={benefit.title} className="flex flex-col">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent-soft">
                <benefit.icon className="h-7 w-7 text-accent" strokeWidth={1.5} aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-primary mb-1.5">{benefit.title}</h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                {benefit.description}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
