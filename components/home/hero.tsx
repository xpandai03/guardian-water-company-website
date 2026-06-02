"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Phone, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";

// Home page hero. Desktop: text on the left, a full-bleed water video filling
// the entire right half edge-to-edge. Mobile: a full-width video band above
// the text (single column).
//
// Page-load animation (Phase C): on mount, the left column reveals in a
// staggered cascade (eyebrow > headline > subhead > CTAs) sliding up; the
// video slides in from the right. prefers-reduced-motion shows everything
// immediately via the motion-reduce: variants.

// Transition shared by every revealed element. The motion-reduce variants
// pin the element to its final state with no transition.
const REVEAL_BASE =
  "transition-[opacity,transform] duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-[opacity,transform] " +
  "motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-x-0 motion-reduce:translate-y-0";

const REVEALED = "opacity-100 translate-x-0 translate-y-0";
const HIDDEN_UP = "opacity-0 translate-y-[30px]";
const HIDDEN_RIGHT = "opacity-0 translate-x-[60px]";

export function HomeHero() {
  const [loaded, setLoaded] = useState(false);

  // Flip on after mount so the CSS transition runs once on initial load.
  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <section className="relative bg-background overflow-hidden">
      {/* Hero photo — David in front of the Guardian Water truck. Mobile: a
          full-width band above the text. Desktop: full-bleed, filling the
          entire right half of the hero edge-to-edge. Slides in from the right
          at 200ms on page load. */}
      <div
        className={cn(
          "relative aspect-[4/3] w-full overflow-hidden",
          "md:absolute md:inset-y-0 md:right-0 md:w-1/2 md:aspect-auto",
          REVEAL_BASE,
          loaded ? REVEALED : HIDDEN_RIGHT,
        )}
        style={{ transitionDelay: "200ms" }}
      >
        <Image
          src="/assets/david/guardian-water-truck.png"
          alt="David Delahunty in front of Guardian Water truck"
          fill
          priority
          className="object-cover"
          sizes="(min-width: 768px) 50vw, 100vw"
        />
      </div>

      <Container className="relative grid gap-10 md:grid-cols-2 md:gap-12 lg:gap-16 py-12 md:py-20 lg:py-24 items-center">
        {/* Text content — staggered cascade, sliding up. */}
        <div className="order-2 md:order-1 flex flex-col gap-5">
          <p
            className={cn(
              "text-sm font-semibold uppercase tracking-[0.18em] text-accent",
              REVEAL_BASE,
              loaded ? REVEALED : HIDDEN_UP,
            )}
            style={{ transitionDelay: "100ms" }}
          >
            For Northeast Ohio Homeowners
          </p>

          <h1
            className={cn(
              "text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-primary leading-[1.05]",
              REVEAL_BASE,
              loaded ? REVEALED : HIDDEN_UP,
            )}
            style={{ transitionDelay: "250ms" }}
          >
            Better Water for Your Home.
          </h1>

          <p
            className={cn(
              "text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl",
              REVEAL_BASE,
              loaded ? REVEALED : HIDDEN_UP,
            )}
            style={{ transitionDelay: "400ms" }}
          >
            Whole House Filtration, Water Softeners &amp; Reverse Osmosis Systems in Northeast Ohio.
          </p>

          <div
            className={cn(
              "flex flex-col sm:flex-row gap-3 pt-2",
              REVEAL_BASE,
              loaded ? REVEALED : HIDDEN_UP,
            )}
            style={{ transitionDelay: "550ms" }}
          >
            <Button
              asChild
              size="lg"
              className="bg-cta hover:bg-cta/90 text-cta-foreground font-semibold rounded-full px-6"
            >
              <Link href="/contact">
                Get a Free Water Test
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full px-6 border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              <a href="tel:+14406434222" aria-label="Call Guardian Water at (440) 643-4222">
                <Phone className="mr-1 h-4 w-4" />
                Call (440) 643-4222
              </a>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
