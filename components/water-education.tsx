import { Beaker, AlertTriangle, Droplet, Microscope } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";

// "What's actually in Northeast Ohio tap water?" — AEO-shaped section title
// (question form) per FRONTEND_PLAN.md §2.D. Two-column desktop, stacked
// mobile. Left: H2 + intro + icon list. Right: supporting image placeholder.
// Reference: reference/apex/06-hidden-dangers-desktop.png.

const risks = [
  {
    icon: Beaker,
    title: "Chlorine & chloramines",
    body: "Added at the municipal level to disinfect water — but leave a taste, odor, and dry-out effect on skin.",
  },
  {
    icon: AlertTriangle,
    title: "Lead from old plumbing",
    body: "Older homes across NE Ohio can still leach lead from aging service lines and solder joints.",
  },
  {
    icon: Droplet,
    title: "Hard-water scale",
    body: "Calcium and magnesium build up inside pipes, water heaters, and dishwashers, shortening their life.",
  },
  {
    icon: Microscope,
    title: "Bacteria & sediment",
    body: "Especially common on well water, but can also reach city water during main breaks or seasonal events.",
  },
] as const;

export function WaterEducation() {
  return (
    <Section bg="accentSoft">
      <Container className="grid gap-12 md:gap-16 md:grid-cols-2 items-start">
        {/* Left: heading + risks */}
        <div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-primary leading-tight">
            What&apos;s actually in Northeast Ohio tap water?
          </h2>
          <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed">
            Whether you&apos;re on city water or a private well, your home&apos;s water picks up things you can&apos;t see, taste, or smell. Here&apos;s what most homes deal with.
          </p>

          <ul className="mt-8 space-y-6">
            {risks.map((risk) => (
              <li key={risk.title} className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-card ring-1 ring-accent/20">
                  <risk.icon className="h-5 w-5 text-accent" strokeWidth={1.75} aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-primary">{risk.title}</h3>
                  <p className="mt-0.5 text-sm md:text-base text-muted-foreground leading-relaxed">
                    {risk.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: supporting image placeholder */}
        <div className="md:pl-4">
          <EducationImagePlaceholder />
        </div>
      </Container>
    </Section>
  );
}

// TODO(david): replace with a supporting image — options include a NE Ohio
// county-shaded service-area map, a microscope/water-droplet photo, or a
// before/after water clarity comparison. See FRONTEND_PLAN.md §9 asset list.
function EducationImagePlaceholder() {
  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-gradient-to-br from-accent/15 via-background to-accent/5 ring-1 ring-accent/15">
      <svg
        viewBox="0 0 200 200"
        className="absolute inset-0 m-auto h-3/5 w-3/5 opacity-90"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Concentric water rings motif */}
        <circle cx="100" cy="100" r="80" className="stroke-accent/40" strokeWidth="2" />
        <circle cx="100" cy="100" r="55" className="stroke-accent/50" strokeWidth="2" />
        <circle cx="100" cy="100" r="30" className="stroke-accent/70" strokeWidth="2" />
        <circle cx="100" cy="100" r="6" className="fill-accent" />
      </svg>
      <span className="sr-only">
        Placeholder for a supporting water-quality image.
      </span>
    </div>
  );
}
