import type { Metadata } from "next";
import Image from "next/image";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { PageHero } from "@/components/page-hero";
import { Section } from "@/components/layout/section";
import { Container } from "@/components/layout/container";
import { CtaStrip } from "@/components/cta-strip";
import { AnimateInView } from "@/components/layout/animate-in-view";

export const metadata: Metadata = {
  title: "About",
  description:
    "Guardian Water is a Northeast Ohio water filtration specialist focused on honest recommendations and long-term solutions.",
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main>
        <PageHero
          eyebrow="About Us"
          title="About Guardian Water"
          subhead="Northeast Ohio water filtration specialist focused on honest recommendations and long-term solutions."
        />

        {/* Who we are */}
        <Section>
          <Container size="narrow">
            <AnimateInView distance="subtle">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-primary">
                Who we are
              </h2>
              <div className="mt-4 space-y-4 text-base md:text-lg leading-relaxed text-muted-foreground">
                <p>
                  Guardian Water was built out of a simple observation: most
                  homeowners are sold water treatment systems before they fully
                  understand what&apos;s in their water.
                </p>
                <p>We started the company to change that.</p>
                <p>
                  Our focus is diagnosing water properly first, then
                  recommending treatment based on real results — not guesswork,
                  not one-size-fits-all systems, and not sales quotas.
                </p>
                <p>
                  We serve Northeast Ohio because water conditions here vary
                  significantly from home to home, especially between city
                  systems and private wells. That variability requires real
                  testing and local experience to get it right.
                </p>
              </div>
            </AnimateInView>
          </Container>
        </Section>

        {/* How we work */}
        <Section bg="muted">
          <Container size="narrow">
            <AnimateInView distance="subtle">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-primary">
                How we work
              </h2>
              <div className="mt-4 space-y-4 text-base md:text-lg leading-relaxed text-muted-foreground">
                <p>
                  Every home starts the same way: with a free on-site water
                  test.
                </p>
                <p>
                  We test your water directly in your home and review the
                  results with you in plain language — what&apos;s in your
                  water, what it means, and what actually matters.
                </p>
                <p>
                  If treatment is needed, we recommend a system based on your
                  water conditions, home layout, and long-term goals.
                </p>
                <p>
                  There are no pressure tactics and no pre-set packages. The
                  recommendation is built around your water, not a sales
                  script.
                </p>
              </div>
            </AnimateInView>
          </Container>
        </Section>

        {/* What we stand for */}
        <Section>
          <Container size="narrow">
            <AnimateInView distance="subtle">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-primary">
                What we stand for
              </h2>
              <div className="mt-4 space-y-4 text-base md:text-lg leading-relaxed text-muted-foreground">
                <p>
                  Our goal is simple: better water for Northeast Ohio families
                  without confusion or guesswork.
                </p>
                <p className="font-semibold text-primary">
                  We believe homeowners should:
                </p>
                <ul className="ml-5 list-disc space-y-2">
                  <li>understand their water clearly</li>
                  <li>feel confident in the system installed in their home</li>
                  <li>have long-term support after installation</li>
                </ul>
                <p>
                  Every installation we complete is backed by that standard.
                </p>
              </div>
            </AnimateInView>
          </Container>
        </Section>

        {/* Our equipment partner */}
        <Section bg="muted">
          <Container size="narrow">
            <AnimateInView distance="subtle">
              <div className="grid gap-8 md:grid-cols-[1fr_180px] md:items-center">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-primary">
                    Our equipment partner
                  </h2>
                  <div className="mt-4 space-y-4 text-base md:text-lg leading-relaxed text-muted-foreground">
                    <p>We are an authorized dealer of Water-Right systems.</p>
                    <p>
                      This partnership gives us access to professionally
                      engineered, tested, and supported equipment designed for
                      residential water treatment applications. It also
                      ensures proper warranty coverage and ongoing manufacturer
                      support for installed systems.
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-center md:justify-end">
                  <div className="rounded-xl bg-white p-4 ring-1 ring-border">
                    <Image
                      src="/products/Water-Right LOGO.jpg"
                      alt="Water-Right — authorized dealer"
                      width={1076}
                      height={929}
                      className="h-auto w-[140px] object-contain"
                    />
                  </div>
                </div>
              </div>
            </AnimateInView>
          </Container>
        </Section>

        <CtaStrip />
      </main>
      <Footer />
    </>
  );
}
