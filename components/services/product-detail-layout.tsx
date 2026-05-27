import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Check,
  ChevronRight,
  FileText,
  BookOpen,
  ClipboardList,
} from "lucide-react";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { AnimateInView } from "@/components/layout/animate-in-view";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CtaStrip } from "@/components/cta-strip";
import { ProductCard } from "@/components/services/product-card";
import { ProductVideoModal } from "@/components/services/product-video-modal";
import {
  getProductBySlug,
  getRelatedProducts,
  type Product,
  type ProductDocuments,
  type DetailUrlCategory,
} from "@/lib/data/products";
import { cn } from "@/lib/utils";

// Human-readable label per category — used for the breadcrumb back-link.
const CATEGORY_LABEL: Record<DetailUrlCategory, string> = {
  "city-water": "City Water",
  "well-water": "Well Water",
  "ro-systems": "Reverse Osmosis Systems",
};

// Document type → label + icon. Renders in the Product Documents section.
const DOC_META: Record<
  keyof ProductDocuments,
  { label: string; icon: typeof FileText }
> = {
  specs: { label: "Specifications", icon: ClipboardList },
  manual: { label: "Owner's Manual", icon: BookOpen },
  brochure: { label: "Brochure", icon: FileText },
};

export function ProductDetailLayout({ product }: { product: Product }) {
  const isCombo = !!product.comboComponents?.length;
  const categoryUrl =
    product.detailUrlCategory ?? ("city-water" as DetailUrlCategory);
  const categoryLabel = CATEGORY_LABEL[categoryUrl];

  // Aggregate features across components for combos; otherwise use the
  // product's own detailedFeatures.
  const featureSource: { heading?: string; features: readonly string[] }[] =
    isCombo
      ? (product.comboComponents ?? [])
          .map((id) => getProductBySlug(id))
          .filter((c): c is Product => Boolean(c))
          .map((component) => ({
            heading: component.name,
            features: component.detailedFeatures ?? [],
          }))
          .filter((entry) => entry.features.length > 0)
      : product.detailedFeatures && product.detailedFeatures.length > 0
        ? [{ features: product.detailedFeatures }]
        : [];

  // Combo: prefer its own video; otherwise use the first component's video.
  const heroVideoPath =
    product.videoPath ??
    (isCombo
      ? (product.comboComponents ?? [])
          .map((id) => getProductBySlug(id)?.videoPath)
          .find(Boolean)
      : undefined);

  const relatedProducts = getRelatedProducts(product, 3);

  return (
    <>
      <Header />
      <main>
        {/* Breadcrumb */}
        <div className="bg-background border-b border-border/60">
          <Container className="py-3">
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-1.5 text-xs text-muted-foreground"
            >
              <Link href="/services" className="hover:text-accent transition">
                Services
              </Link>
              <ChevronRight className="h-3 w-3" aria-hidden="true" />
              <Link
                href={`/services/${categoryUrl}`}
                className="hover:text-accent transition"
              >
                {categoryLabel}
              </Link>
              <ChevronRight className="h-3 w-3" aria-hidden="true" />
              <span className="text-foreground/80">{product.name}</span>
            </nav>
          </Container>
        </div>

        {/* Hero */}
        <section className="bg-background">
          <Container className="py-10 md:py-16">
            <div className="grid gap-10 md:grid-cols-2 md:gap-12 lg:gap-16 items-start">
              {/* Image */}
              <div className="rounded-2xl border border-border bg-white p-6 md:p-8 shadow-sm">
                <ProductHeroImages product={product} />
              </div>

              {/* Info */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                  By {product.brand}
                </p>
                <h1 className="mt-3 text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-primary leading-[1.1]">
                  {product.name}
                </h1>
                {product.tagline && (
                  <p className="mt-3 text-lg md:text-xl text-muted-foreground leading-snug">
                    {product.tagline}
                  </p>
                )}
                {product.badge && (
                  <Badge
                    variant="secondary"
                    className="mt-4 self-start border-transparent bg-accent-soft text-accent"
                  >
                    {product.badge}
                  </Badge>
                )}
                {product.fullDescription && (
                  <p className="mt-5 text-base md:text-lg text-muted-foreground leading-relaxed">
                    {product.fullDescription}
                  </p>
                )}

                <div className="mt-7 flex flex-col sm:flex-row gap-3">
                  <Button
                    asChild
                    size="lg"
                    className="rounded-full bg-cta hover:bg-cta/90 text-cta-foreground font-semibold px-6"
                  >
                    <Link href="/contact">
                      Get a Free Water Test
                      <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
                    </Link>
                  </Button>
                  {heroVideoPath && (
                    <ProductVideoModal
                      videoPath={heroVideoPath}
                      productName={product.name}
                    />
                  )}
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Key Features */}
        {featureSource.length > 0 && (
          <AnimateInView>
            <Section bg="muted">
              <Container>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-primary">
                  Key Features
                </h2>
                <div className="mt-8 space-y-10">
                  {featureSource.map((entry, idx) => (
                    <div key={entry.heading ?? idx}>
                      {entry.heading && (
                        <h3 className="mb-4 text-lg font-bold text-primary">
                          {entry.heading}
                        </h3>
                      )}
                      <ul className="grid gap-x-8 gap-y-3 md:grid-cols-2">
                        {entry.features.map((feature) => (
                          <li key={feature} className="flex gap-3">
                            <span
                              className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-soft"
                              aria-hidden="true"
                            >
                              <Check
                                className="h-3.5 w-3.5 text-accent"
                                strokeWidth={2.5}
                              />
                            </span>
                            <span className="text-sm md:text-base leading-relaxed text-muted-foreground">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </Container>
            </Section>
          </AnimateInView>
        )}

        {/* Documents */}
        <ProductDocumentsSection product={product} />

        {/* Combo components */}
        {isCombo && (
          <ComboComponentsSection
            componentIds={product.comboComponents ?? []}
          />
        )}

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <AnimateInView>
            <Section bg="muted">
              <Container>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-primary">
                  Other Products to Consider
                </h2>
                <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
                  {relatedProducts.map((related) => (
                    <li key={related.id} className="h-full">
                      <ProductCard product={related} />
                    </li>
                  ))}
                </ul>
              </Container>
            </Section>
          </AnimateInView>
        )}

        <CtaStrip />
      </main>
      <Footer />
    </>
  );
}

// Hero image renderer — handles single + combo cases the same way as
// ProductCard but at a larger size and without the "By {brand}" label.
function ProductHeroImages({ product }: { product: Product }) {
  const isCombo = product.images.length > 1;
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-md bg-white",
        "aspect-[4/3]",
      )}
    >
      {isCombo ? (
        <div className="absolute inset-0 grid grid-cols-2 gap-4 p-2">
          {product.images.map((src) => (
            <div key={src} className="relative h-full w-full">
              <Image
                src={src}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 40vw, 25vw"
                className="object-contain"
                priority
              />
            </div>
          ))}
        </div>
      ) : (
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 80vw, 40vw"
          className="object-contain p-4"
          priority
        />
      )}
    </div>
  );
}

// Card-style document download list. Renders nothing if there are no docs.
function ProductDocumentsSection({ product }: { product: Product }) {
  // For combo products without their own docs, aggregate component docs
  // under sub-headings.
  if (product.documents) {
    const entries = Object.entries(product.documents) as [
      keyof ProductDocuments,
      string | undefined,
    ][];
    const docs = entries.filter(([, href]) => Boolean(href)) as [
      keyof ProductDocuments,
      string,
    ][];
    if (docs.length === 0) return null;
    return (
      <AnimateInView>
        <Section>
          <Container>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-primary">
              Product Documents
            </h2>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {docs.map(([type, href]) => (
                <li key={type}>
                  <DocumentLink type={type} href={href} />
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      </AnimateInView>
    );
  }

  // Combo case: render per-component doc subsections if any component has docs.
  if (product.comboComponents?.length) {
    const componentsWithDocs = product.comboComponents
      .map((id) => getProductBySlug(id))
      .filter((c): c is Product => Boolean(c))
      .filter((c) => c.documents && Object.values(c.documents).some(Boolean));
    if (componentsWithDocs.length === 0) return null;

    return (
      <AnimateInView>
        <Section>
          <Container>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-primary">
              Product Documents
            </h2>
            <div className="mt-8 space-y-10">
              {componentsWithDocs.map((component) => {
                const entries = Object.entries(component.documents ?? {}) as [
                  keyof ProductDocuments,
                  string | undefined,
                ][];
                const docs = entries.filter(([, href]) => Boolean(href)) as [
                  keyof ProductDocuments,
                  string,
                ][];
                return (
                  <div key={component.id}>
                    <h3 className="mb-4 text-lg font-bold text-primary">
                      {component.name}
                    </h3>
                    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {docs.map(([type, href]) => (
                        <li key={type}>
                          <DocumentLink type={type} href={href} />
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

  return null;
}

function DocumentLink({
  type,
  href,
}: {
  type: keyof ProductDocuments;
  href: string;
}) {
  const meta = DOC_META[type];
  const Icon = meta.icon;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-3 rounded-lg border border-border bg-card p-4 transition hover:border-accent hover:shadow-sm"
    >
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent"
        aria-hidden="true"
      >
        <Icon className="h-5 w-5" strokeWidth={1.75} />
      </span>
      <span className="flex-1">
        <span className="block text-sm font-semibold text-primary">
          {meta.label}
        </span>
        <span className="block text-xs text-muted-foreground">PDF · opens in new tab</span>
      </span>
      <ChevronRight
        className="h-4 w-4 text-muted-foreground transition group-hover:text-accent"
        aria-hidden="true"
      />
    </a>
  );
}

function ComboComponentsSection({
  componentIds,
}: {
  componentIds: readonly string[];
}) {
  const components = componentIds
    .map((id) => getProductBySlug(id))
    .filter((c): c is Product => Boolean(c));
  if (components.length === 0) return null;

  return (
    <AnimateInView>
      <Section>
        <Container>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-primary">
            What&apos;s in this combo
          </h2>
          <p className="mt-3 max-w-2xl text-base md:text-lg text-muted-foreground leading-relaxed">
            This combo pairs the following Water-Right systems together for a
            complete treatment package:
          </p>
          <ul className="mt-8 grid gap-6 sm:grid-cols-2">
            {components.map((component) => (
              <li key={component.id}>
                <ComboComponentCard product={component} />
              </li>
            ))}
          </ul>
        </Container>
      </Section>
    </AnimateInView>
  );
}

function ComboComponentCard({ product }: { product: Product }) {
  const hasDetailPage = product.detailUrlCategory !== undefined;
  const inner = (
    <article className="flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card">
      <div className="border-b border-border bg-white p-4">
        <div className="relative aspect-[4/3] w-full">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 80vw, 40vw"
            className="object-contain p-2"
          />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="text-base font-bold text-primary leading-snug">
          {product.name}
        </h3>
        {product.tagline && (
          <p className="text-sm text-muted-foreground leading-snug">
            {product.tagline}
          </p>
        )}
        {hasDetailPage && (
          <span className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-accent">
            View details
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
        )}
      </div>
    </article>
  );

  if (!hasDetailPage) return inner;
  return (
    <Link
      href={`/services/${product.detailUrlCategory}/${product.slug}`}
      className="group block h-full transition hover:[&_article]:border-accent hover:[&_article]:shadow-sm"
    >
      {inner}
    </Link>
  );
}
