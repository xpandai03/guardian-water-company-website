import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/data/products";

// White-card product display for the service pages. Product photos sit on a
// white field via `object-contain` so they are never cropped. Combo products
// carry two images and render them side by side.
export function ProductCard({ product }: { product: Product }) {
  const isCombo = product.images.length > 1;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card shadow-sm">
      {/* Image area — white background, product never cropped */}
      <div className="border-b border-border p-4">
        <div
          className={cn(
            "grid gap-3",
            isCombo ? "grid-cols-2" : "grid-cols-1",
          )}
        >
          {product.images.map((src) => (
            <div key={src} className="relative aspect-[4/3]">
              <Image
                src={src}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-contain"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-2 p-5">
        {product.badge && (
          <Badge
            variant="secondary"
            className="border-transparent bg-accent-soft text-accent"
          >
            {product.badge}
          </Badge>
        )}
        <h3 className="text-lg font-bold text-primary">{product.name}</h3>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {product.brand}
        </p>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {product.description}
        </p>
        {product.features && product.features.length > 0 && (
          <ul className="mt-1 space-y-1">
            {product.features.map((feature) => (
              <li
                key={feature}
                className="flex gap-2 text-sm text-muted-foreground"
              >
                <span className="text-accent" aria-hidden="true">
                  •
                </span>
                {feature}
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}
