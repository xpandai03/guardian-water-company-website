import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/data/products";

// White-card product display for the service pages. Product photos sit on a
// white field via `object-contain` so they are never cropped or recolored by
// their source backgrounds. Cards stretch to equal height inside the
// `items-stretch` grid in ServiceProductsSection so 1-image and 2-image
// (combo) entries appear visually uniform.
export function ProductCard({ product }: { product: Product }) {
  const isCombo = product.images.length > 1;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card shadow-sm">
      {/* Image area — fixed aspect, white background, never cropped. */}
      <div className="border-b border-border bg-white p-4">
        <div
          className={cn(
            "relative w-full overflow-hidden rounded-md bg-white aspect-[4/3]",
          )}
        >
          {isCombo ? (
            <div className="absolute inset-0 grid grid-cols-2 gap-3 p-2">
              {product.images.map((src) => (
                <div key={src} className="relative h-full w-full">
                  <Image
                    src={src}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 40vw, 20vw"
                    className="object-contain"
                  />
                </div>
              ))}
            </div>
          ) : (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 80vw, 33vw"
              className="object-contain p-2"
            />
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-2 p-5">
        {product.badge && (
          <Badge
            variant="secondary"
            className="self-start border-transparent bg-accent-soft text-accent"
          >
            {product.badge}
          </Badge>
        )}
        <h3 className="text-lg font-bold text-primary leading-snug">
          {product.name}
        </h3>
        <p className="text-xs font-semibold uppercase tracking-wide text-accent">
          By {product.brand}
        </p>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          {product.description}
        </p>
        {product.features && product.features.length > 0 && (
          <ul className="mt-2 space-y-1">
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
