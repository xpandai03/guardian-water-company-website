"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Phone, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";

// Home page hero. Two-column desktop (text left, image right), single-column
// mobile with image above text per Apex pattern (reference/apex/20-hero-mobile.png).
// Visual rhythm follows reference/wahoo/01-hero-desktop.png — real-people photo
// belongs in the right slot. Aqua placeholder used until David sends one.
//
// Page-load animation (Phase C): on mount, the left column reveals in a
// staggered cascade (eyebrow > headline > subhead > CTAs) sliding up; the
// image slides in from the right. prefers-reduced-motion shows everything
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
      {/* Subtle aqua-soft wash behind the image side at md+ */}
      <div
        aria-hidden="true"
        className="absolute inset-y-0 right-0 hidden md:block w-1/2 bg-accent-soft"
      />

      <Container className="relative grid gap-10 md:grid-cols-2 md:gap-12 lg:gap-16 py-12 md:py-20 lg:py-24 items-center">
        {/* Image / photo placeholder — order-1 on mobile so it appears above text.
            Slides in from the right at 200ms. */}
        <div
          className={cn(
            "order-1 md:order-2",
            REVEAL_BASE,
            loaded ? REVEALED : HIDDEN_RIGHT,
          )}
          style={{ transitionDelay: "200ms" }}
        >
          <HeroPhotoPlaceholder />
        </div>

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

            {/* TODO(david): replace `#` with real tel: link once David sends his number */}
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full px-6 border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              <a href="#" aria-label="Call (phone number coming soon)">
                <Phone className="mr-1 h-4 w-4" />
                Call (xxx) xxx-xxxx
              </a>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}

// TODO(david): replace this placeholder with a real photo asset. Target:
// real-people shot of David or a technician on-site (per Wahoo's hero
// pattern — reference/wahoo/01-hero-desktop.png). 4:3 to 16:10 ratio works.
function HeroPhotoPlaceholder() {
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-accent/20 via-accent-soft to-accent/10 ring-1 ring-accent/15">
      {/* Centered water-drop motif as a visual anchor */}
      <svg
        viewBox="0 0 200 200"
        className="absolute inset-0 m-auto h-2/3 w-2/3"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M100 20L40 110C40 150 65 180 100 180C135 180 160 150 160 110L100 20Z"
          className="fill-accent/30"
        />
        <path
          d="M100 60L70 110C70 130 82 150 100 150C118 150 130 130 130 110L100 60Z"
          className="fill-accent/50"
        />
      </svg>
      <span className="sr-only">
        Placeholder for hero photo — David&apos;s team photo coming soon.
      </span>
    </div>
  );
}
