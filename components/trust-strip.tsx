import { BadgeCheck, MapPin, Handshake } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";

// Trust strip — 3 cards reinforcing why local homeowners pick a small operator.
// Pattern: reference/wahoo/02-trust-credentials-desktop.png (centered headline
// + 3 white cards with checkmark icons). Card content is editable copy in one
// place per FRONTEND_PLAN.md §2.B.
const items = [
  {
    icon: BadgeCheck,
    title: "Free Water Test",
    description: "On-site water analysis at no cost — no obligation.",
  },
  {
    icon: MapPin,
    title: "Local & Family-Operated",
    description: "Based right here in Northeast Ohio, not a national chain.",
  },
  {
    icon: Handshake,
    title: "No High-Pressure Sales",
    description: "Honest recommendations only — we install what your home actually needs.",
  },
] as const;

export function TrustStrip() {
  return (
    <Section bg="muted">
      <Container>
        <div className="text-center mb-10 md:mb-14 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-primary">
            Trusted Across Northeast Ohio
          </h2>
          <p className="mt-3 text-base md:text-lg text-muted-foreground">
            Most homeowners don&apos;t think about their water until something goes wrong. We make the next step easy.
          </p>
        </div>

        <ul className="grid gap-5 md:grid-cols-3">
          {items.map((item) => (
            <li
              key={item.title}
              className="rounded-2xl bg-card border border-border p-7 text-center shadow-sm"
            >
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft">
                <item.icon className="h-6 w-6 text-accent" strokeWidth={2} aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-primary mb-1.5">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
