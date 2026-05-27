import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";

import type { BlogPost } from "@/lib/data/blog-posts";

// Index-page card for /blog. Clickable entire card → /blog/[slug].
// Visual treatment mirrors ProductCard (rounded border + hover lift) so the
// two surfaces feel consistent.
export function BlogPostCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block h-full"
      aria-label={`${post.title} — read article`}
    >
      <article className="flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card p-6 shadow-sm transition group-hover:border-accent group-hover:shadow-md">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <time dateTime={post.publishedAt}>
            {formatDate(post.publishedAt)}
          </time>
          <span aria-hidden="true">·</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" aria-hidden="true" />
            {post.readingMinutes} min read
          </span>
        </div>
        <h3 className="mt-3 text-lg md:text-xl font-bold text-primary leading-snug">
          {post.title}
        </h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
          {post.excerpt}
        </p>
        <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-accent transition-all group-hover:gap-2">
          Read more
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
      </article>
    </Link>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
