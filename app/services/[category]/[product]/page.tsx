import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductDetailLayout } from "@/components/services/product-detail-layout";
import {
  getProductBySlug,
  getProductsWithDetailPage,
  type DetailUrlCategory,
} from "@/lib/data/products";

interface RouteParams {
  category: string;
  product: string;
}

// Resolve the product + verify the category segment matches the product's
// canonical detailUrlCategory. Mismatches 404.
function resolveProduct({ category, product }: RouteParams) {
  const found = getProductBySlug(product);
  if (!found || found.detailUrlCategory === undefined) return null;
  if (found.detailUrlCategory !== (category as DetailUrlCategory)) return null;
  return found;
}

export function generateStaticParams(): RouteParams[] {
  return getProductsWithDetailPage().map((p) => ({
    category: p.detailUrlCategory as string,
    product: p.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const resolved = await params;
  const product = resolveProduct(resolved);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description:
      product.tagline ?? product.fullDescription ?? product.description,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const resolved = await params;
  const product = resolveProduct(resolved);
  if (!product) notFound();
  return <ProductDetailLayout product={product} />;
}
