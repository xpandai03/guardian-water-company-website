"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Phone, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";

// Home page hero. Two-column desktop (text left, video right), single-column
// mobile with the video above text per Apex pattern (reference/apex/20-hero-mobile.png).
// The right slot holds an autoplaying, muted, looping water video that fills
// the same 4:3 frame the placeholder used.
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
      {/* Subtle aqua-soft wash behind the image side at md+ */}
      <div
        aria-hidden="true"
        className="absolute inset-y-0 right-0 hidden md:block w-1/2 bg-accent-soft"
      />

      <Container className="relative grid gap-10 md:grid-cols-2 md:gap-12 lg:gap-16 py-12 md:py-20 lg:py-24 items-center">
        {/* Hero video — order-1 on mobile so it appears above text.
            Slides in from the right at 200ms. */}
        <div
          className={cn(
            "order-1 md:order-2",
            REVEAL_BASE,
            loaded ? REVEALED : HIDDEN_RIGHT,
          )}
          style={{ transitionDelay: "200ms" }}
        >
          <HeroVideo />
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

// Autoplaying, muted, looping water video in the hero's right slot. Fills a
// 4:3 frame via object-cover so it scales cleanly across devices. The poster
// frame shows instantly while the video downloads (or if autoplay is blocked).
function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Belt-and-suspenders: force the element muted as a *property* (browsers
  // require this for autoplay) and kick off playback. A blocked autoplay
  // (e.g. data-saver mode) just leaves the poster frame visible.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    void video.play().catch(() => {});
  }, []);

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-accent-soft ring-1 ring-accent/15">
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/hero-water-poster.jpg"
        aria-hidden="true"
      >
        <source src="/hero-water.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
