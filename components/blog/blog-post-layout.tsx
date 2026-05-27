import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { AnimateInView } from "@/components/layout/animate-in-view";
import { CtaStrip } from "@/components/cta-strip";
import { ProductCard } from "@/components/services/product-card";
import { getProductBySlug } from "@/lib/data/products";
import type { BlogBlock, BlogPost } from "@/lib/data/blog-posts";

export function BlogPostLayout({ post }: { post: BlogPost }) {
  const relatedProducts = (post.relatedProductSlugs ?? [])
    .map((slug) => getProductBySlug(slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-background border-b border-border/60">
          <Container size="narrow" className="py-10 md:py-14">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-accent/80 transition"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              All articles
            </Link>
            <h1 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-primary leading-[1.1]">
              {post.title}
            </h1>
            <div className="mt-5 flex items-center gap-3 text-sm text-muted-foreground">
              <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                {post.readingMinutes} min read
              </span>
            </div>
          </Container>
        </section>

        {/* Body */}
        <Section>
          <Container size="narrow">
            <AnimateInView distance="subtle">
              <article className="space-y-5">
                {post.body.map((block, idx) => (
                  <BlogBlockRenderer key={idx} block={block} />
                ))}
              </article>
            </AnimateInView>
          </Container>
        </Section>

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <AnimateInView>
            <Section bg="muted">
              <Container>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-primary">
                  Related Products
                </h2>
                <p className="mt-3 max-w-2xl text-base text-muted-foreground leading-relaxed">
                  Systems we typically recommend for the issues covered in this
                  article.
                </p>
                <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
                  {relatedProducts.map((product) => (
                    <li key={product.id} className="h-full">
                      <ProductCard product={product} />
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

function BlogBlockRenderer({ block }: { block: BlogBlock }) {
  switch (block.type) {
    case "h2":
      return (
        <h2 className="mt-10 text-2xl md:text-3xl font-bold tracking-tight text-primary">
          {block.text}
        </h2>
      );
    case "h3":
      return (
        <h3 className="mt-6 text-lg md:text-xl font-bold text-primary">
          {block.text}
        </h3>
      );
    case "ul":
      return (
        <ul className="ml-5 list-disc space-y-2 text-base md:text-lg leading-relaxed text-muted-foreground">
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    case "p":
    default:
      return (
        <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
          {block.text}
        </p>
      );
  }
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
