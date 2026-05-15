import Link from "next/link";
import { Droplets, Waves, GlassWater, ArrowRight } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";

// Services overview — 3 service teaser cards linking to /services/<slug>.
// Reference: reference/wahoo/06-services-cards-desktop.png. 3-up grid because
// David has exactly 3 services — a single full row reads as complete coverage
// (FRONTEND_PLAN.md §2.C).
const services = [
  {
    href: "/services/whole-house-filtration",
    icon: Droplets,
    title: "Whole House Filtration",
    description:
      "Clean, filtered water at every tap. Removes chlorine, sediment, and common contaminants from the water entering your home.",
  },
  {
    href: "/services/water-softeners",
    icon: Waves,
    title: "Water Softeners",
    description:
      "Eliminate hard-water scale and protect your plumbing, appliances, and water heater. Gentler on skin, hair, and laundry.",
  },
  {
    href: "/services/reverse-osmosis",
    icon: GlassWater,
    title: "Reverse Osmosis Systems",
    description:
      "Drinking-water-grade purification under your kitchen sink. Crisp, great-tasting water for cooking and drinking.",
  },
] as const;

export function ServicesOverview() {
  return (
    <Section>
      <Container>
        <div className="text-center mb-12 md:mb-16 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-primary">
            Our Water Filtration Services
          </h2>
          <p className="mt-3 text-base md:text-lg text-muted-foreground">
            Three core systems we install and service across Northeast Ohio.
          </p>
        </div>

        <ul className="grid gap-6 md:grid-cols-3">
          {services.map((service) => (
            <li key={service.href}>
              <Link
                href={service.href}
                className="group flex h-full flex-col rounded-2xl border border-border bg-card p-7 transition hover:border-accent/50 hover:shadow-md"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft">
                  <service.icon className="h-6 w-6 text-accent" strokeWidth={1.75} aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-2">{service.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1">
                  {service.description}
                </p>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-accent group-hover:gap-2 transition-all">
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
