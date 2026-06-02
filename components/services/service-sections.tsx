import type { ReactNode } from "react";
import Image from "next/image";
import { Check } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { AnimateInView } from "@/components/layout/animate-in-view";
import { ProductCard } from "@/components/services/product-card";
import {
  getProductsByCategory,
  type ServiceCategory,
} from "@/lib/data/products";

// ---------------------------------------------------------------------------
// ServiceOverview2Col — side-by-side overview on desktop, stacked on mobile.
// Each page provides custom left/right content (paragraphs, sub-headings,
// bullet lists) via children. The grid keeps both columns top-aligned so
// uneven content lengths still read cleanly.
// ---------------------------------------------------------------------------
export function ServiceOverview2Col({
  left,
  right,
}: {
  left: ReactNode;
  right: ReactNode;
}) {
  return (
    <AnimateInView>
      <Section>
        <Container>
          <div className="grid gap-10 md:grid-cols-2 md:gap-12 lg:gap-16 items-start">
            <div>{left}</div>
            <div>{right}</div>
          </div>
        </Container>
      </Section>
    </AnimateInView>
  );
}

// ---------------------------------------------------------------------------
// ServiceContentMediaSplit — a single content block that optionally pairs with
// a photo. Without `image` it renders one full-width (narrow) column; with
// `image` it becomes a 2-column content+photo split on desktop that stacks on
// mobile. `imageSide` controls whether the photo sits left or right of the
// copy. Used for the David photo placements (May 27) and the "moved up"
// city-water intro.
// ---------------------------------------------------------------------------
export function ServiceContentMediaSplit({
  heading,
  children,
  image,
  imageSide = "right",
  bg,
}: {
  heading: string;
  children: ReactNode;
  image?: { src: string; alt: string };
  imageSide?: "left" | "right";
  bg?: "muted";
}) {
  if (!image) {
    return (
      <AnimateInView>
        <Section bg={bg}>
          <Container size="narrow">
            <ServiceColumn heading={heading}>{children}</ServiceColumn>
          </Container>
        </Section>
      </AnimateInView>
    );
  }

  const media = (
    <div className="relative mx-auto aspect-[4/5] w-full max-w-[420px] overflow-hidden rounded-2xl ring-1 ring-border md:max-w-none">
      <Image
        src={image.src}
        alt={image.alt}
        fill
        className="object-cover"
        sizes="(min-width: 768px) 50vw, 100vw"
      />
    </div>
  );
  const content = <ServiceColumn heading={heading}>{children}</ServiceColumn>;

  return (
    <AnimateInView>
      <Section bg={bg}>
        <Container>
          <div className="grid items-center gap-10 md:grid-cols-2 md:gap-12 lg:gap-16">
            {imageSide === "left" ? (
              <>
                {media}
                {content}
              </>
            ) : (
              <>
                {content}
                {media}
              </>
            )}
          </div>
        </Container>
      </Section>
    </AnimateInView>
  );
}

// Headline + body convenience block used inside ServiceOverview2Col columns.
export function ServiceColumn({
  heading,
  children,
}: {
  heading: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-4 text-base md:text-lg text-muted-foreground leading-relaxed">
      <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-primary leading-tight">
        {heading}
      </h2>
      {children}
    </div>
  );
}

// Vertically stacked checklist used inside ServiceOverview2Col columns.
export function ServiceBulletList({ items }: { items: readonly string[] }) {
  return (
    <ul className="mt-4 space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span
            className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-soft"
            aria-hidden="true"
          >
            <Check className="h-4 w-4 text-accent" strokeWidth={2.5} />
          </span>
          <span className="text-base text-muted-foreground leading-relaxed">
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}

// ---------------------------------------------------------------------------
// ServiceNoticeList — standalone full-width section used on the RO page for
// "What homeowners notice" (a bullet list that doesn't fit into the 2-column
// overview because RO uses the right column for "Where it fits in your home").
// ---------------------------------------------------------------------------
export function ServiceNoticeList({
  heading,
  bullets,
}: {
  heading: string;
  bullets: readonly string[];
}) {
  return (
    <AnimateInView>
      <Section>
        <Container size="narrow">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-primary">
            {heading}
          </h2>
          <ServiceBulletList items={bullets} />
        </Container>
      </Section>
    </AnimateInView>
  );
}

// ---------------------------------------------------------------------------
// ServiceProductsSection — renders one or more product subsections (for
// well-water's ferrous + ferric split) on a muted background. Each subsection
// reads from products.ts via getProductsByCategory.
// ---------------------------------------------------------------------------
export interface ProductSubsection {
  heading?: string;
  category: ServiceCategory;
}

export function ServiceProductsSection({
  heading = "Recommended Systems",
  intro,
  sections,
  image,
}: {
  heading?: string;
  intro?: string;
  sections: readonly ProductSubsection[];
  image?: { src: string; alt: string };
}) {
  const header = (
    <>
      <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-primary">
        {heading}
      </h2>
      {intro && (
        <p className="mt-3 max-w-3xl text-base md:text-lg text-muted-foreground leading-relaxed">
          {intro}
        </p>
      )}
    </>
  );

  return (
    <AnimateInView>
      <Section bg="muted">
        <Container>
          {image ? (
            // Header + intro paired with a photo on the right; the product grid
            // stays full-width below so the cards don't get squeezed.
            <div className="grid items-center gap-10 md:grid-cols-2 md:gap-12 lg:gap-16">
              <div>{header}</div>
              <div className="relative mx-auto aspect-[4/5] w-full max-w-[420px] overflow-hidden rounded-2xl ring-1 ring-border md:max-w-none">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 50vw, 100vw"
                />
              </div>
            </div>
          ) : (
            header
          )}
          <div className="mt-8 space-y-12">
            {sections.map((section) => {
              const items = getProductsByCategory(section.category);
              return (
                <div key={section.category}>
                  {section.heading && (
                    <h3 className="mb-5 text-lg font-bold text-primary">
                      {section.heading}
                    </h3>
                  )}
                  <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
                    {items.map((product) => (
                      <li key={product.id} className="h-full">
                        <ProductCard product={product} />
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </Container>
      </Section>
    </AnimateInView>
  );
}

// ---------------------------------------------------------------------------
// ServiceWhyItMatters — "Why it matters in Northeast Ohio" section. Optional
// intro paragraph, optional sub-heading above the bullets, required bullets,
// optional closing paragraph beneath the bullets.
// ---------------------------------------------------------------------------
export function ServiceWhyItMatters({
  heading = "Why it matters in Northeast Ohio",
  intro,
  subhead,
  bullets,
  closing,
}: {
  heading?: string;
  intro?: string;
  subhead?: string;
  bullets: readonly string[];
  closing?: string;
}) {
  return (
    <AnimateInView>
      <Section>
        <Container size="narrow">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-primary">
            {heading}
          </h2>
          {intro && (
            <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed">
              {intro}
            </p>
          )}
          {subhead && (
            <p className="mt-6 text-base md:text-lg font-semibold text-primary">
              {subhead}
            </p>
          )}
          <ServiceBulletList items={bullets} />
          {closing && (
            <p className="mt-6 text-base md:text-lg text-muted-foreground leading-relaxed">
              {closing}
            </p>
          )}
        </Container>
      </Section>
    </AnimateInView>
  );
}
