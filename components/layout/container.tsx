import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

// Max-width centered wrapper. Default fits the 1280px hero/footer rhythm used
// across the design references (`reference/wahoo/01-hero-desktop.png`,
// `reference/wahoo/11-footer-desktop.png`). Use `size` to narrow for prose.
type Size = "default" | "narrow" | "wide";

const sizeClasses: Record<Size, string> = {
  default: "max-w-7xl",     // 80rem / 1280px — primary marketing container
  narrow:  "max-w-3xl",     // 48rem / 768px  — prose, single-column form
  wide:    "max-w-screen-2xl", // wider hero panels if needed
};

interface ContainerProps extends ComponentProps<"div"> {
  size?: Size;
}

export function Container({ className, size = "default", ...props }: ContainerProps) {
  return (
    <div
      className={cn("mx-auto w-full px-4 sm:px-6 lg:px-8", sizeClasses[size], className)}
      {...props}
    />
  );
}
