import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";

// TODO(david): replace these placeholder testimonials with real Google
// review pulls (3-5 quotes) once David shares review URLs or screenshots.
// Keep the same { name, location, quote } shape — no structural changes
// needed when swapping content.
const testimonials = [
  {
    name: "Placeholder Name",
    location: "Cleveland, OH",
    quote:
      "Honest review pending. Real quote from a Northeast Ohio homeowner about the water test, install experience, and after-service.",
  },
  {
    name: "Placeholder Name",
    location: "Akron, OH",
    quote:
      "Honest review pending. Should ideally mention how the system addressed a specific water issue (taste, hardness, sediment) and the team's professionalism.",
  },
  {
    name: "Placeholder Name",
    location: "Canton, OH",
    quote:
      "Honest review pending. Bonus if it speaks to family-operated trust and a recommendation to a neighbor.",
  },
] as const;

function StarRow() {
  return (
    <div className="flex gap-0.5 mb-4" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className="text-cta text-lg leading-none" aria-hidden="true">
          ★
        </span>
      ))}
    </div>
  );
}

function InitialAvatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent-soft text-sm font-bold text-accent ring-1 ring-accent/20"
      aria-hidden="true"
    >
      {initials || "?"}
    </div>
  );
}

export function Testimonials() {
  return (
    <Section>
      <Container>
        <div className="text-center mb-12 md:mb-14 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-primary">
            What our neighbors say
          </h2>
          <p className="mt-3 text-base md:text-lg text-muted-foreground">
            Real reviews from real Northeast Ohio homeowners (placeholders for now — Google review pull pending).
          </p>
        </div>

        <ul className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <li
              key={i}
              className="rounded-2xl bg-card border border-border p-7 shadow-sm hover:shadow-md transition"
            >
              <StarRow />
              <p className="text-sm md:text-base text-foreground/80 leading-relaxed mb-6">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <InitialAvatar name={t.name} />
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-primary">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.location}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
