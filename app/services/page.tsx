import type { Metadata } from "next";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { PageHero } from "@/components/page-hero";
import { ServicesHub } from "@/components/services/services-hub";
import { CtaStrip } from "@/components/cta-strip";

export const metadata: Metadata = {
  title: "Our Services",
  description:
    "Water filtration for every Northeast Ohio home — city water, well water, and reverse osmosis drinking water systems.",
};

export default function ServicesPage() {
  return (
    <>
      <Header />
      <main>
        <PageHero
          eyebrow="Our Services"
          title="Water Filtration for Every Northeast Ohio Home"
          subhead="Your water is shaped by where it comes from. We tailor the system to your source — municipal city water, a private well, or drinking-water reverse osmosis."
        />
        <ServicesHub />
        <CtaStrip />
      </main>
      <Footer />
    </>
  );
}
