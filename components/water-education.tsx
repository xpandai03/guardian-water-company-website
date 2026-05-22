import { Beaker, AlertTriangle, Droplet, Microscope } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { WaterEducationVideo } from "@/components/water-education-video";

// "What's actually in Northeast Ohio tap water?" — AEO-shaped section title
// (question form) per FRONTEND_PLAN.md §2.D. Two-column desktop, stacked
// mobile. Left: H2 + intro + icon list. Right: supporting water video.
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

        {/* Right: supporting water video */}
        <div className="md:pl-4">
          <WaterEducationVideo />
        </div>
      </Container>
    </Section>
  );
}
