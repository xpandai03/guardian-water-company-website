import type { Metadata } from "next";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { PageHero } from "@/components/page-hero";
import { Section } from "@/components/layout/section";
import { Container } from "@/components/layout/container";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for the Guardian Water, LLC website.",
};

/*
  TODO(david): These Terms of Service are generic boilerplate provided so the
  site has no broken links. Replace with copy reviewed by your attorney before
  relying on it.
*/
export default function TermsPage() {
  return (
    <>
      <Header />
      <main>
        <PageHero eyebrow="Legal" title="Terms of Service" />
        <Section>
          <Container size="narrow">
            <div className="rounded-lg border border-border bg-muted p-4 text-sm text-muted-foreground">
              These Terms of Service are preliminary and provided for
              completeness. They are pending review by legal counsel and may
              change.
            </div>

            <p className="mt-6 text-sm text-muted-foreground">
              Last updated: May 21, 2026
            </p>

            <div className="mt-8 space-y-8 text-base leading-relaxed text-muted-foreground">
              <p>
                These Terms of Service govern your use of the Guardian Water,
                LLC (&quot;Guardian Water&quot;) website. By using this site,
                you agree to these terms.
              </p>

              <section className="space-y-3">
                <h2 className="text-xl font-bold text-primary">
                  Use of this site
                </h2>
                <p>
                  This website is provided for general informational purposes
                  about Guardian Water&apos;s water filtration products and
                  services. Content does not constitute a binding quote or a
                  guarantee of results for your home.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-bold text-primary">
                  No warranty
                </h2>
                <p>
                  Information on this site is provided &quot;as is&quot; without
                  warranties of any kind. Product details, availability, and
                  pricing may change without notice.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-bold text-primary">
                  Intellectual property
                </h2>
                <p>
                  Content on this site is the property of Guardian Water, LLC
                  unless otherwise noted, and may not be reused without
                  permission.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-bold text-primary">
                  Limitation of liability
                </h2>
                <p>
                  To the fullest extent permitted by law, Guardian Water, LLC
                  is not liable for any damages arising from your use of this
                  site.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-bold text-primary">Contact</h2>
                <p>
                  Questions about these terms? Contact Guardian Water, LLC
                  through our contact page.
                </p>
              </section>
            </div>
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  );
}
