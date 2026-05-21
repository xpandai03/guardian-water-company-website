import type { Metadata } from "next";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { ContactHero } from "@/components/contact/contact-hero";
import { BusinessInfoCard } from "@/components/contact/business-info-card";
import { EstimateForm } from "@/components/estimate-form";

// Title resolves to "Contact | Guardian Water" via the template in
// app/layout.tsx metadata.
export const metadata: Metadata = {
  title: "Contact",
  description:
    "Request a free water test from Guardian Water. Tell us about your Northeast Ohio home's water and we'll personally follow up within one business day.",
};

// /contact — page composition. Server component; the form (EstimateForm) is the
// only client island. See PHASE_A_PLAN.md §1.
export default function ContactPage() {
  return (
    <>
      <Header />
      <main>
        <ContactHero />

        {/* White form card on the aqua-soft band (PHASE_A_PLAN.md §4). */}
        <Section bg="accentSoft">
          <Container>
            <div className="grid gap-8 lg:grid-cols-[1fr_22rem] lg:items-start lg:gap-12">
              <EstimateForm />
              <BusinessInfoCard />
            </div>
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  );
}
