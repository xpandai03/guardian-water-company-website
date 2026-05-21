import { MapPin, Star } from "lucide-react";

import { Container } from "@/components/layout/container";

// Thin utility bar above the main header — matches the Wahoo reference pattern.
// Desktop-only (hidden below md; too cramped on phones). NOT sticky — only the
// main header sticks on scroll.
export function TopUtilityBar() {
  return (
    <div className="hidden md:block bg-primary text-primary-foreground">
      <Container className="flex h-9 items-center justify-between text-xs">
        {/* Left: location.
            TODO(david): swap "Serving Northeast Ohio" for the real business
            address once David provides it. */}
        <div className="flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
          <span>Serving Northeast Ohio</span>
        </div>

        {/* Right: social proof.
            TODO(david): "5-Star Reviewed Locally" is substantiated by real
            homeowner reviews of David's pre-Guardian-Water individual service
            work (confirmed with Raunek 2026-05-21; David to confirm the final
            framing on the 05-22 call). Swap for a platform-verified badge with
            an exact review count once reviews are centralized on Google. */}
        <div className="flex items-center gap-1.5">
          <span className="flex items-center gap-0.5" aria-hidden="true">
            {Array.from({ length: 5 }, (_, i) => (
              <Star key={i} className="h-3.5 w-3.5 fill-accent text-accent" />
            ))}
          </span>
          <span>5-Star Reviewed Locally</span>
        </div>
      </Container>
    </div>
  );
}
