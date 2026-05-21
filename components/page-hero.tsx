import { Container } from "@/components/layout/container";

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  subhead?: string;
}

// Generic page hero — eyebrow + H1 + optional subhead. Server component.
// Shared by /services, /about, /blog, /privacy, /terms.
export function PageHero({ eyebrow, title, subhead }: PageHeroProps) {
  return (
    <section className="bg-background">
      <Container className="py-12 md:py-16">
        <div className="max-w-2xl">
          {eyebrow && (
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
              {eyebrow}
            </p>
          )}
          <h1 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight text-primary leading-[1.1]">
            {title}
          </h1>
          {subhead && (
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              {subhead}
            </p>
          )}
        </div>
      </Container>
    </section>
  );
}
