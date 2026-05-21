import type { Metadata } from "next";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { PageHero } from "@/components/page-hero";
import { Section } from "@/components/layout/section";
import { Container } from "@/components/layout/container";
import { CtaStrip } from "@/components/cta-strip";
import { WaterRightBadge } from "@/components/water-right-badge";
import { AnimateInView } from "@/components/layout/animate-in-view";

export const metadata: Metadata = {
  title: "About",
  description:
    "Guardian Water is Northeast Ohio's local, family-operated water filtration specialist — honest recommendations and clean installs.",
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main>
        <PageHero
          eyebrow="About Us"
          title="About Guardian Water"
          subhead="Northeast Ohio's local, family-operated water filtration specialists."
        />

        {/* Company story — TODO(david): replace all three paragraphs with real copy. */}
        <Section>
          <Container size="narrow">
            <AnimateInView distance="subtle">
              <div className="space-y-5 text-base md:text-lg leading-relaxed text-muted-foreground">
                <p>
                  TODO(david): Paragraph 1 — who you are and how Guardian Water
                  got started. Your background in water treatment and why you
                  chose to serve Northeast Ohio homeowners.
                </p>
                <p>
                  TODO(david): Paragraph 2 — how you work: the free on-site
                  water test, an honest recommendation matched to the home, and
                  no high-pressure sales.
                </p>
                <p>
                  TODO(david): Paragraph 3 — the mission: cleaner, safer water
                  for local families, and standing behind every installation.
                </p>
              </div>
            </AnimateInView>
          </Container>
        </Section>

        {/* Service area + manufacturer partner */}
        <Section bg="muted">
          <Container size="narrow">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-primary">
              Serving Northeast Ohio
            </h2>
            <p className="mt-4 text-base md:text-lg leading-relaxed text-muted-foreground">
              Guardian Water serves homeowners across Northeast Ohio, including
              Cleveland, Akron, Canton, and the surrounding communities.
            </p>

            <h2 className="mt-12 text-2xl md:text-3xl font-bold tracking-tight text-primary">
              Our manufacturer partner
            </h2>
            {/* TODO(david): replace with real copy on the Water-Right partnership. */}
            <p className="mt-4 text-base md:text-lg leading-relaxed text-muted-foreground">
              TODO(david): one or two sentences on the Water-Right partnership
              and what it means for customers — equipment quality, warranty,
              and ongoing support.
            </p>
            <WaterRightBadge className="mt-6" />
          </Container>
        </Section>

        <CtaStrip />
      </main>
      <Footer />
    </>
  );
}
