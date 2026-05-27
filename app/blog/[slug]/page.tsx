import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BlogPostLayout } from "@/components/blog/blog-post-layout";
import {
  getAllBlogPosts,
  getBlogPostBySlug,
} from "@/lib/data/blog-posts";

interface RouteParams {
  slug: string;
}

export function generateStaticParams(): RouteParams[] {
  return getAllBlogPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const resolved = await params;
  const post = getBlogPostBySlug(resolved.slug);
  if (!post) return { title: "Article not found" };
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const resolved = await params;
  const post = getBlogPostBySlug(resolved.slug);
  if (!post) notFound();
  return <BlogPostLayout post={post} />;
}
