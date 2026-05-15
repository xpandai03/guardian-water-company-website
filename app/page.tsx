import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { HomeHero } from "@/components/home/hero";
import { TrustStrip } from "@/components/trust-strip";
import { ServicesOverview } from "@/components/services-overview";
import { WaterEducation } from "@/components/water-education";
import { ProcessSteps } from "@/components/process-steps";
import { Benefits } from "@/components/benefits";
import { Testimonials } from "@/components/testimonials";
import { CtaStrip } from "@/components/cta-strip";

// Home page composition — Phase 2.
// Section order locked per FRONTEND_PLAN.md §10 step 3.
export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HomeHero />
        <TrustStrip />
        <ServicesOverview />
        <WaterEducation />
        <ProcessSteps />
        <Benefits />
        <Testimonials />
        <CtaStrip />
      </main>
      <Footer />
    </>
  );
}
