"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

// Scroll-triggered reveal wrapper — fade + slide-in.
// - Fires once per page load (observer disconnects on first intersect; no
//   replay on scroll-back).
// - direction: "up" (default), "left", or "right" — vary it across a page so
//   the reveal isn't monotonous.
// - distance: "default" (~44px, dramatic) or "subtle" (~24px, gentle).
// - 700ms cubic-bezier(0.16, 1, 0.3, 1) ease-out.
// - prefers-reduced-motion: content shows immediately with no transition,
//   handled via Tailwind's `motion-reduce:` variants (CSS-only, no JS branch).
//
// SSR note: server renders the hidden initial state. Without JS, content
// stays hidden — acceptable for a marketing site in 2026.

type Direction = "up" | "left" | "right";
type Distance = "default" | "subtle";

interface AnimateInViewProps {
  children: ReactNode;
  className?: string;
  direction?: Direction;
  distance?: Distance;
}

// Literal class strings (no interpolation) so Tailwind's JIT keeps them, and
// so the motion-reduce: variants can still override them.
const HIDDEN: Record<Direction, Record<Distance, string>> = {
  up: {
    default: "opacity-0 translate-y-[44px]",
    subtle: "opacity-0 translate-y-[24px]",
  },
  left: {
    default: "opacity-0 translate-x-[-44px]",
    subtle: "opacity-0 translate-x-[-24px]",
  },
  right: {
    default: "opacity-0 translate-x-[44px]",
    subtle: "opacity-0 translate-x-[24px]",
  },
};

export function AnimateInView({
  children,
  className,
  direction = "up",
  distance = "default",
}: AnimateInViewProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const el = ref.current;
    if (!el) {
      setShown(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            observer.disconnect();
            break;
          }
        }
      },
      // ~12% of section visible AND it's at least 8% above the viewport
      // bottom — feels like the section is "settling in", not just touching.
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "transition-[opacity,transform] duration-700 will-change-[opacity,transform]",
        "[transition-timing-function:cubic-bezier(0.16,1,0.3,1)]",
        shown
          ? "opacity-100 translate-x-0 translate-y-0"
          : HIDDEN[direction][distance],
        // Respect prefers-reduced-motion: render fully visible, no transition.
        "motion-reduce:opacity-100 motion-reduce:translate-x-0 motion-reduce:translate-y-0 motion-reduce:transition-none",
        className
      )}
    >
      {children}
    </div>
  );
}
