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
import { AnimateInView } from "@/components/layout/animate-in-view";

// Home page composition — Phase 2.
// Section order locked per FRONTEND_PLAN.md §10 step 3.
// Each section below the hero gets a scroll-triggered fade+rise via
// AnimateInView. Hero is above the fold and renders immediately.
export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HomeHero />
        <AnimateInView><TrustStrip /></AnimateInView>
        <AnimateInView><ServicesOverview /></AnimateInView>
        <AnimateInView><WaterEducation /></AnimateInView>
        <AnimateInView><ProcessSteps /></AnimateInView>
        <AnimateInView><Benefits /></AnimateInView>
        <AnimateInView><Testimonials /></AnimateInView>
        <AnimateInView><CtaStrip /></AnimateInView>
      </main>
      <Footer />
    </>
  );
}
