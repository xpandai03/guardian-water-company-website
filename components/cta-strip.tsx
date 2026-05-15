"use client";

import Link from "next/link";
import { Phone, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";

// Final CTA panel. Replaces the legacy `final-cta.tsx`. Inspired by Wahoo's
// dark CTA strips (reference/wahoo/04-membership-benefits-desktop.png +
// reference/wahoo/10-process-cta-desktop.png) — but in our aqua/navy palette
// rather than purple.
export function CtaStrip() {
  return (
    <section className="bg-background py-14 md:py-20">
      <Container>
        <div className="relative overflow-hidden rounded-3xl bg-hero-bg text-hero-foreground px-6 py-12 md:px-12 md:py-16 lg:px-16">
          {/* Decorative water-drop watermark, bottom-right */}
          <svg
            viewBox="0 0 200 200"
            className="absolute -bottom-8 -right-8 h-56 w-56 opacity-15 pointer-events-none"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M100 20L40 110C40 150 65 180 100 180C135 180 160 150 160 110L100 20Z"
              className="fill-accent"
            />
          </svg>

          <div className="relative grid gap-8 md:grid-cols-2 md:gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
                Ready for cleaner water?
              </h2>
              <p className="mt-3 text-base md:text-lg text-hero-foreground/80 max-w-md">
                Book your free on-site water test. We&apos;ll show you exactly what&apos;s in your water — and what to do about it.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row md:justify-end gap-3">
              <Button
                asChild
                size="lg"
                className="bg-cta hover:bg-cta/90 text-cta-foreground font-semibold rounded-full px-6"
              >
                <Link href="/contact">
                  Get a Free Water Test
                  <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>

              {/* TODO(david): replace `#` with real tel: link once David sends his number */}
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full px-6 border-2 border-hero-foreground/40 text-hero-foreground hover:bg-hero-foreground hover:text-hero-bg bg-transparent"
              >
                <a href="#" aria-label="Call (phone number coming soon)">
                  <Phone className="mr-1 h-4 w-4" />
                  Call (xxx) xxx-xxxx
                </a>
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
