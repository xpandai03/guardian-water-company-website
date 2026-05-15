import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";

// "How does it work?" — question-shaped H2 for AEO surfacing.
// Deep-aqua/navy background section with 3 numbered chips. Mobile stacks
// vertically. Reference rhythm: reference/wahoo/09-section-7422-desktop.png.

const steps = [
  {
    n: "01",
    title: "Free Water Test",
    body: "Schedule online or give us a call. We come out, test your water on-site, and walk you through the results — no cost.",
  },
  {
    n: "02",
    title: "Custom Recommendation",
    body: "We explain what's in your water and which system actually fits your home. No upsells, no scare tactics.",
  },
  {
    n: "03",
    title: "Pro Installation",
    body: "Our team installs your system cleanly and shows you how to maintain it. We're here for the long haul.",
  },
] as const;

export function ProcessSteps() {
  return (
    <Section bg="hero">
      <Container>
        <div className="text-center mb-12 md:mb-16 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-hero-foreground">
            How does it work?
          </h2>
          <p className="mt-3 text-base md:text-lg text-hero-foreground/80">
            Three simple steps from your first call to clean water flowing.
          </p>
        </div>

        <ol className="grid gap-8 md:grid-cols-3 md:gap-6">
          {steps.map((step) => (
            <li key={step.n} className="relative">
              <div className="flex items-baseline gap-3 mb-3">
                <span className="text-4xl md:text-5xl font-bold text-accent leading-none">
                  {step.n}
                </span>
                <span className="h-px flex-1 bg-hero-foreground/15" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold text-hero-foreground mb-2">
                {step.title}
              </h3>
              <p className="text-sm md:text-base text-hero-foreground/75 leading-relaxed">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
