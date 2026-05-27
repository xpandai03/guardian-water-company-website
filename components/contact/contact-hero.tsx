import { Container } from "@/components/layout/container";

// Page hero for /contact. Server component — static copy, no interactivity.
// The form sits directly below, so no CTA buttons here (PHASE_A_PLAN.md §1).
export function ContactHero() {
  return (
    <section className="bg-background">
      <Container className="py-12 md:py-16">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
            Contact Us
          </p>
          <h1 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight text-primary leading-[1.1]">
            Contact Guardian Water
          </h1>
          <p className="mt-4 text-xl md:text-2xl font-semibold text-primary leading-snug">
            Schedule your no-charge water test
          </p>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            We&apos;ll come to your home, test your water on-site, and walk
            you through exactly what we find — clearly and without pressure.
            If treatment makes sense, we&apos;ll explain your options. If it
            doesn&apos;t, we&apos;ll tell you that too.
          </p>
        </div>
      </Container>
    </section>
  );
}
