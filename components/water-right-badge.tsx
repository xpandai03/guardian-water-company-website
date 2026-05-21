import Image from "next/image";

import { cn } from "@/lib/utils";

// Small, low-key "Authorized Water-Right Dealer" partner badge.
// The label has no color of its own — it inherits, so the badge works on
// both the light About page and the dark footer (pass a text color via
// `className` to tune it).
export function WaterRightBadge({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Image
        src="/products/Water-Right LOGO.jpg"
        alt="Water-Right"
        width={1076}
        height={929}
        className="h-10 w-auto rounded ring-1 ring-border"
      />
      <span className="text-xs font-semibold uppercase tracking-wide">
        Authorized Water-Right Dealer
      </span>
    </div>
  );
}
