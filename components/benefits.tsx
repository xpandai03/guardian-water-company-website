import { Droplets, Sparkles, Wrench, MapPin, Leaf, Handshake } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";

// Six-benefit grid — David's verbatim copy from May 23 email (Bucket 2).
const benefits = [
  {
    icon: Droplets,
    title: "Better-Tasting Drinking Water",
    description: "Reduce chlorine taste, odors, sediment, and unwanted impurities for cleaner water from every tap.",
  },
  {
    icon: Sparkles,
    title: "Softer Water for Skin, Hair & Laundry",
    description: "Soft water helps reduce dryness, soap buildup, spotting, and hard-water scale throughout your home.",
  },
  {
    icon: Wrench,
    title: "Protect Your Plumbing & Appliances",
    description: "Reduce mineral buildup that can shorten the lifespan of water heaters, dishwashers, fixtures, and pipes.",
  },
  {
    icon: MapPin,
    title: "Solutions Built for Northeast Ohio Water",
    description: "From city water chlorine to well water iron and sulfur, we design systems around the issues common in this area.",
  },
  {
    icon: Leaf,
    title: "Less Bottled Water. Less Waste.",
    description: "Enjoy high-quality drinking water at home while cutting down on bottled water costs and plastic waste.",
  },
  {
    icon: Handshake,
    title: "Straightforward Recommendations",
    description: "No scare tactics or one-size-fits-all systems. We recommend solutions based on your water, your home, and your goals.",
  },
] as const;

export function Benefits() {
  return (
    <Section bg="muted">
      <Container>
        <div className="text-center mb-14 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-primary">
            Why Northeast Ohio Homeowners Choose Us
          </h2>
        </div>

        <ul className="grid gap-x-10 gap-y-10 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
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
