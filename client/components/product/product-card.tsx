import Image from "next/image";
import Link from "next/link";
import { WishlistButton } from "@/components/product/wishlist-button";
import { PriceDisplay } from "@/components/ui/price-display";
import type { Product } from "@/types/catalog";

export function ProductCard({ product }: { product: Product }) {
  const image = product.images[0]?.secureUrl ?? "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=85";
  const hoverImage = product.images[1]?.secureUrl ?? image;
  const sizes = Array.from(new Set(product.variants.map((variant) => variant.size))).slice(0, 4);

  return (
    <article className="group relative">
      <div className="relative aspect-[3/4] overflow-hidden bg-bone">
        <Link href={`/product/${product.slug}`} className="block h-full">
          <Image src={image} alt={product.images[0]?.alt ?? product.name} fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition duration-700 group-hover:scale-105 group-hover:opacity-0" />
          <Image src={hoverImage} alt="" fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="object-cover opacity-0 transition duration-700 group-hover:scale-105 group-hover:opacity-100" />
        </Link>
        <WishlistButton productId={product.id} className="absolute right-3 top-3" />
        {product.compareAtPrice ? (
          <span className="absolute left-3 top-3 bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-wine">Sale</span>
        ) : product.isNewArrival ? (
          <span className="absolute left-3 top-3 bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-olive">New</span>
        ) : null}
      </div>
      <div className="pt-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-smoke">{product.brand}</p>
            <Link href={`/product/${product.slug}`} className="mt-1 block font-medium text-ink">{product.name}</Link>
          </div>
          <PriceDisplay price={product.price} compareAtPrice={product.compareAtPrice} />
        </div>
        <div className="mt-3 flex min-h-6 gap-2 text-xs text-smoke">
          {sizes.map((size) => <span key={size} className="border border-oat px-2 py-1">{size}</span>)}
        </div>
      </div>
    </article>
  );
}
