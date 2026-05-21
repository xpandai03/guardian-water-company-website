import type { Metadata } from "next";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { PageHero } from "@/components/page-hero";
import { Section } from "@/components/layout/section";
import { Container } from "@/components/layout/container";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for the Guardian Water, LLC website.",
};

/*
  TODO(david): This Privacy Policy is generic boilerplate provided so the site
  has no broken links. Replace it with copy reviewed by your attorney before
  relying on it. Confirm what data is actually collected and which third-party
  processors (CRM, scheduling, analytics) are in use.
*/
export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main>
        <PageHero eyebrow="Legal" title="Privacy Policy" />
        <Section>
          <Container size="narrow">
            <div className="rounded-lg border border-border bg-muted p-4 text-sm text-muted-foreground">
              This Privacy Policy is preliminary and provided for completeness.
              It is pending review by legal counsel and may change.
            </div>

            <p className="mt-6 text-sm text-muted-foreground">
              Last updated: May 21, 2026
            </p>

            <div className="mt-8 space-y-8 text-base leading-relaxed text-muted-foreground">
              <p>
                Guardian Water, LLC (&quot;Guardian Water,&quot; &quot;we,&quot;
                &quot;us&quot;) respects your privacy. This policy explains what
                information we collect through this website and how we use it.
              </p>

              <section className="space-y-3">
                <h2 className="text-xl font-bold text-primary">
                  Information we collect
                </h2>
                <p>
                  When you submit our contact or estimate form, we collect the
                  information you provide — such as your name, phone number,
                  email address, and home address — so we can respond to your
                  request. We may also collect basic, non-identifying analytics
                  about how visitors use the site.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-bold text-primary">
                  How we use your information
                </h2>
                <p>
                  We use the information you submit solely to respond to your
                  inquiry, schedule services, and communicate with you about
                  your request. We do not sell your personal information.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-bold text-primary">
                  Cookies and analytics
                </h2>
                <p>
                  This site may use cookies and third-party analytics to
                  understand site usage and improve the experience.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-bold text-primary">
                  Third-party services
                </h2>
                <p>
                  Form submissions are processed through third-party tools
                  (such as our scheduling and CRM providers) for the purpose of
                  handling your request.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-bold text-primary">Contact</h2>
                <p>
                  Questions about this policy? Contact Guardian Water, LLC
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
