import { Check } from "lucide-react";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { AnimateInView } from "@/components/layout/animate-in-view";
import { ProcessSteps } from "@/components/process-steps";
import { CtaStrip } from "@/components/cta-strip";
import { ProductCard } from "@/components/services/product-card";
import {
  getProductsByCategory,
  type ServiceCategory,
} from "@/lib/data/products";

interface ProductSection {
  /** Optional sub-heading — used by the well-water page (ferrous / ferric). */
  heading?: string;
  category: ServiceCategory;
}

export interface ServicePageLayoutProps {
  eyebrow: string;
  title: string;
  subhead: string;
  /** "What it does" paragraph. */
  intro: string;
  /** "Why it matters in Northeast Ohio" bullet points. */
  whyOhio: string[];
  /** One section for city-water / ro-systems; two for well-water. */
  productSections: ProductSection[];
}

// Shared template for the three service sub-pages. Each page supplies its own
// content; ProcessSteps and CtaStrip are reused as-is (no prop changes).
// The content sections reveal on scroll via AnimateInView.
export function ServicePageLayout({
  eyebrow,
  title,
  subhead,
  intro,
  whyOhio,
  productSections,
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

        {/* What it does */}
        <AnimateInView>
          <Section>
            <Container size="narrow">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-primary">
                What it does
              </h2>
              <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed">
                {intro}
              </p>
            </Container>
          </Section>
        </AnimateInView>

        {/* Recommended products */}
        <AnimateInView>
          <Section bg="muted">
            <Container>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-primary">
                Recommended Systems
              </h2>
              <div className="mt-8 space-y-12">
                {productSections.map((productSection) => {
                  const items = getProductsByCategory(productSection.category);
                  return (
                    <div key={productSection.category}>
                      {productSection.heading && (
                        <h3 className="mb-5 text-lg font-bold text-primary">
                          {productSection.heading}
                        </h3>
                      )}
                      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {items.map((product) => (
                          <li key={product.id} className="h-full">
                            <ProductCard product={product} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </Container>
          </Section>
        </AnimateInView>

        {/* Why it matters in Northeast Ohio */}
        <AnimateInView>
          <Section>
            <Container size="narrow">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-primary">
                Why it matters in Northeast Ohio
              </h2>
              <ul className="mt-6 space-y-4">
                {whyOhio.map((point) => (
                  <li key={point} className="flex gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-soft">
                      <Check
                        className="h-4 w-4 text-accent"
                        strokeWidth={2.5}
                        aria-hidden="true"
                      />
                    </span>
                    <span className="text-base leading-relaxed text-muted-foreground">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
            </Container>
          </Section>
        </AnimateInView>

        {/* Process + final CTA — reused as-is */}
        <ProcessSteps />
        <CtaStrip />
      </main>
      <Footer />
    </>
  );
}
