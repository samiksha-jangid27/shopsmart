import { ProductGrid } from "@/components/product/product-grid";
import { EmptyState } from "@/components/ui/empty-state";
import { apiFetch } from "@/lib/api";
import type { Product } from "@/types/catalog";

type Wishlist = { items: { product: Product }[] };

export default async function WishlistPage() {
  const { wishlist } = await apiFetch<{ wishlist: Wishlist }>("/customer/wishlist", { auth: true });
  const products = wishlist.items.map((item) => item.product);
  return (
    <div className="container-padded py-12">
      <h1 className="font-serif text-5xl">Wishlist</h1>
      <div className="mt-8">{products.length ? <ProductGrid products={products} /> : <EmptyState title="Nothing saved yet" message="Save pieces while browsing to build a considered wishlist." actionHref="/shop" actionLabel="Browse pieces" />}</div>
    </div>
  );
}
