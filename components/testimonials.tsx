import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";

const testimonials = [
  {
    name: "Tim",
    location: "Medina, OH",
    quote:
      "Our shower doors and dishwasher had constant buildup. After installation, the difference was immediate—less spotting, less scrubbing, and water that actually feels better. No upselling, just what we needed.",
  },
  {
    name: "Brendon C.",
    location: "Hinckley, OH",
    quote:
      "Our well water had a strong sulfur smell that made the house uncomfortable. After install, the smell was gone and the water looks and tastes clean. Huge difference in daily life.",
  },
  {
    name: "Sheila",
    location: "Strongsville, OH",
    quote:
      "We stopped buying bottled water after the RO system. The water tastes better and we're saving money every month. Install was clean and simple.",
  },
] as const;

function StarRow() {
  /* TODO: Add Google G logo inline with 5-star ratings — awaiting asset from Raunek.
     Per David (May 27): one ~20px G mark per card, vertically centered with the
     star row (before/after the stars) to signal the review source. */
  return (
    <div className="flex gap-0.5 mb-4" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className="text-amber-500 text-lg leading-none" aria-hidden="true">
          ★
        </span>
      ))}
    </div>
  );
}

function InitialAvatar({ name }: { name: string }) {
  const initials = (name.trim()[0] ?? "?").toUpperCase();

  return (
    <div
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent-soft text-sm font-bold text-accent ring-1 ring-accent/20"
      aria-hidden="true"
    >
      {initials}
    </div>
  );
}

export function Testimonials() {
  return (
    <Section>
      <Container>
        <div className="text-center mb-12 md:mb-14 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-primary">
            Hear From Our Happy Homeowners
          </h2>
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
