import type { Metadata } from "next";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { PageHero } from "@/components/page-hero";
import { Section } from "@/components/layout/section";
import { Container } from "@/components/layout/container";
import { AnimateInView } from "@/components/layout/animate-in-view";
import { CtaStrip } from "@/components/cta-strip";
import { BlogPostCard } from "@/components/blog/blog-post-card";
import { getAllBlogPosts } from "@/lib/data/blog-posts";

export const metadata: Metadata = {
  title: "Learning Center",
  description:
    "Water-quality education for Northeast Ohio homeowners — hard water, well vs city water, iron staining, sulfur smell, and how to choose the right filtration system.",
};

export default function BlogPage() {
  const posts = getAllBlogPosts();

  return (
    <>
      <Header />
      <main>
        <PageHero
          eyebrow="Learning Center"
          title="Water-quality reading for Northeast Ohio homeowners"
          subhead="Practical articles on hard water, well vs city water, iron staining, sulfur smell, and how to choose the right filtration system for your home."
        />

        <AnimateInView>
          <Section>
            <Container>
              <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 items-stretch">
                {posts.map((post) => (
                  <li key={post.slug} className="h-full">
                    <BlogPostCard post={post} />
                  </li>
                ))}
              </ul>
            </Container>
          </Section>
        </AnimateInView>

        <CtaStrip />
      </main>
      <Footer />
    </>
  );
}
