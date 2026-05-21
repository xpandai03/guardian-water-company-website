import { Container } from "@/components/layout/container";

// Page hero for /contact. Server component — static copy, no interactivity.
// The form sits directly below, so no CTA buttons here (PHASE_A_PLAN.md §1).
export function ContactHero() {
  return (
    <section className="bg-background">
      <Container className="py-12 md:py-16">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
            Contact Guardian Water
          </p>
          <h1 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight text-primary leading-[1.1]">
            Get your free water test
          </h1>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            Tell us about your home and water below. David will personally
            follow up within one business day to schedule your free,
            no-obligation on-site water test.
          </p>
        </div>
      </Container>
    </section>
  );
}
