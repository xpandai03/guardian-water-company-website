import type { ReactNode } from "react";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Container } from "@/components/layout/container";
import { ProcessSteps, type ProcessStep } from "@/components/process-steps";
import { CtaStrip } from "@/components/cta-strip";

export interface ServicePageLayoutProps {
  // Hero
  eyebrow: string;
  title: string;
  subhead: string;

  // "How it works" — service pages override headline/subhead/steps to keep
  // their wording distinct from the home-page version of ProcessSteps.
  processHeadline?: string;
  processSubhead?: string;
  processSteps?: readonly ProcessStep[];

  // Body sections (overview → notice? → products → why-it-matters) are
  // composed by each page using helpers in ./service-sections.tsx.
  children: ReactNode;
}

// Shared chrome for the three service sub-pages. Each page composes its own
// middle content via children; the layout only owns Header, Hero, the
// "How it works" process strip, the final CTA, and Footer.
export function ServicePageLayout({
  eyebrow,
  title,
  subhead,
  processHeadline = "How it works",
  processSubhead = "Simple, transparent process from first call to installation.",
  processSteps = SERVICE_DEFAULT_STEPS,
  children,
}: ServicePageLayoutProps) {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-background">
          <Container className="py-12 md:py-16">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
                {eyebrow}
              </p>
              <h1 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight text-primary leading-[1.1]">
                {title}
              </h1>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                {subhead}
              </p>
            </div>
          </Container>
        </section>

        {children}

        <ProcessSteps
          headline={processHeadline}
          subhead={processSubhead}
          steps={processSteps}
        />
        <CtaStrip />
      </main>
      <Footer />
    </>
  );
}

// David's verbatim 3-step copy for service-page process strips (shorter than
// the home-page version).
const SERVICE_DEFAULT_STEPS: readonly ProcessStep[] = [
  {
    n: "01",
    title: "Free Water Test",
    body: "We test your water on-site and explain exactly what we find.",
  },
  {
    n: "02",
    title: "System Recommendation",
    body: "We match you with the right solution based on your water and home.",
  },
  {
    n: "03",
    title: "Professional Installation",
    body: "Installed cleanly and correctly, with guidance on long-term care.",
  },
] as const;
