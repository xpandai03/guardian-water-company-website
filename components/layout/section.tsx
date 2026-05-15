import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

// Vertical-rhythm wrapper. Default padding matches FRONTEND_PLAN.md §10:
// py-16 (mobile) / py-24 (md+). Pair with <Container> for horizontal width.
type Bg = "default" | "muted" | "accentSoft" | "hero" | "primary";

const bgClasses: Record<Bg, string> = {
  default:    "",
  muted:      "bg-muted",
  accentSoft: "bg-accent-soft",
  hero:       "bg-hero-bg text-hero-foreground",
  primary:    "bg-primary text-primary-foreground",
};

interface SectionProps extends ComponentProps<"section"> {
  bg?: Bg;
}

export function Section({ className, bg = "default", ...props }: SectionProps) {
  return (
    <section className={cn("py-16 md:py-24", bgClasses[bg], className)} {...props} />
  );
}
