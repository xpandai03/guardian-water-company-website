import type { Metadata } from "next";
import Link from "next/link";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { PageHero } from "@/components/page-hero";
import { Section } from "@/components/layout/section";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Learning Center",
  description:
    "Water-quality education for Northeast Ohio homeowners — coming soon from Guardian Water.",
};

export default function BlogPage() {
  return (
    <>
      <Header />
      <main>
        <PageHero eyebrow="Resources" title="Learning Center" />
        <Section>
          <Container size="narrow">
            <div className="text-center">
              <p className="text-lg leading-relaxed text-muted-foreground">
                We&apos;re working on educational content to help homeowners
                understand water quality. In the meantime, get in touch for
                personalized advice.
              </p>
              <Button
                asChild
                size="lg"
                className="mt-8 rounded-full bg-cta font-semibold text-cta-foreground hover:bg-cta/90"
              >
                <Link href="/contact">Get a Free Water Test</Link>
              </Button>
            </div>
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  );
}
