"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

// Scroll-triggered fade-in + slide-up wrapper.
// - Fires once per page load (observer disconnects on first intersect).
// - Trigger threshold: ~12% of section visible.
// - 700ms cubic-bezier(0.16, 1, 0.3, 1) ease-out — smooth, not bouncy.
// - prefers-reduced-motion: content shows immediately with no transition,
//   handled via Tailwind's `motion-reduce:` variant (CSS-only, no JS branch).
//
// SSR note: server renders the hidden initial state. Without JS, content
// stays hidden — acceptable for a marketing site in 2026 (IE-era fallback
// not a concern).

interface AnimateInViewProps {
  children: ReactNode;
  className?: string;
}

export function AnimateInView({ children, className }: AnimateInViewProps) {
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
        shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5",
        // Respect prefers-reduced-motion: render fully visible, no transition.
        "motion-reduce:opacity-100 motion-reduce:translate-y-0 motion-reduce:transition-none",
        className
      )}
    >
      {children}
    </div>
  );
}
