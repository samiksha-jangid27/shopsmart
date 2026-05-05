import { FilterSidebar } from "@/components/product/filter-sidebar";
import { ProductGrid } from "@/components/product/product-grid";
import { SortDropdown } from "@/components/product/sort-dropdown";
import { EmptyState } from "@/components/ui/empty-state";
import { apiFetch } from "@/lib/api";
import type { Category, Product } from "@/types/catalog";

type ShopData = {
  products: Product[];
  total: number;
  page: number;
  pageCount: number;
  categories: Category[];
};

export default async function ShopPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  const query = new URLSearchParams(Object.entries(params).filter((entry): entry is [string, string] => Boolean(entry[1])));
  const data = await apiFetch<ShopData>(`/products?${query.toString()}`);

  return (
    <div className="container-padded py-12">
      <div className="mb-10 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-smoke">Shop</p>
          <h1 className="mt-3 font-serif text-5xl lg:text-7xl">Curated wardrobe</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-smoke">{data.total} pieces across tailoring, silks, knits, and essentials.</p>
        </div>
        <SortDropdown value={params.sort} />
      </div>
      <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
        <FilterSidebar categories={data.categories} selectedCategory={params.category} />
        {data.products.length ? <ProductGrid products={data.products} /> : <EmptyState title="No pieces found" message="Try removing a filter or exploring another collection." actionHref="/shop" actionLabel="Clear filters" />}
      </div>
    </div>
  );
}
