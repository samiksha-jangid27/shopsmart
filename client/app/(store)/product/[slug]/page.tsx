import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductGrid } from "@/components/product/product-grid";
import { ProductPurchase } from "@/components/product/product-purchase";
import { PriceDisplay } from "@/components/ui/price-display";
import { apiFetch } from "@/lib/api";
import type { Product } from "@/types/catalog";

type ProductData = { product: Product; related: Product[] };

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const data = await apiFetch<ProductData>(`/products/${slug}`);
    return { title: data.product.seoTitle ?? data.product.name, description: data.product.seoDescription ?? data.product.description };
  } catch {
    return { title: "Product" };
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await apiFetch<ProductData>(`/products/${slug}`).catch(() => null);
  if (!data) notFound();
  const { product, related } = data;

  return (
    <>
      <Breadcrumbs items={[{ label: "Shop", href: "/shop" }, { label: product.category.name, href: `/shop/${product.category.slug}` }, { label: product.name }]} />
      <section className="container-padded grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <ProductGallery images={product.images} name={product.name} />
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-smoke">{product.brand}</p>
          <h1 className="mt-3 font-serif text-5xl leading-tight">{product.name}</h1>
          <p className="mt-4 text-lg text-smoke">{product.subtitle}</p>
          <div className="mt-6"><PriceDisplay price={product.price} compareAtPrice={product.compareAtPrice} /></div>
          <p className="mt-7 text-sm leading-7 text-smoke">{product.description}</p>
          <div className="mt-8"><ProductPurchase product={product} /></div>
          <div className="mt-8 grid gap-4 border-t border-oat pt-6 text-sm text-smoke">
            <p><span className="font-semibold text-ink">Materials:</span> {product.materials}</p>
            <p><span className="font-semibold text-ink">Care:</span> {product.care}</p>
          </div>
        </div>
      </section>
      <section className="container-padded py-20">
        <h2 className="mb-8 font-serif text-4xl">Complete the edit</h2>
        <ProductGrid products={related} />
      </section>
    </>
  );
}
