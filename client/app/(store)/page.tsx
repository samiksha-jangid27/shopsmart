import { CollectionSection } from "@/components/sections/collection-section";
import { EditorialBlocks } from "@/components/sections/editorial-blocks";
import { HeroCarousel } from "@/components/sections/hero-carousel";
import { ReviewSection } from "@/components/sections/review-section";
import { ProductGrid } from "@/components/product/product-grid";
import { apiFetch } from "@/lib/api";
import type { Category, Collection, Product, Review } from "@/types/catalog";

type HomeData = {
  featured: Product[];
  newArrivals: Product[];
  bestSellers: Product[];
  collections: Collection[];
  categories: Category[];
  reviews: Review[];
};

export default async function HomePage() {
  let data: HomeData | null = null;

  try {
    data = await apiFetch<HomeData>("/home");
  } catch (err) {
    console.error("Home API failed:", err);
  }

  return (
    <>
      <HeroCarousel />
      <CollectionSection collections={data?.collections || []} />

      <section className="container-padded py-16">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-smoke">New arrivals</p>
            <h2 className="mt-3 font-serif text-4xl lg:text-5xl">Fresh from the rail</h2>
          </div>
        </div>
        <ProductGrid products={data?.newArrivals || []} />
      </section>

      <EditorialBlocks />

      <section className="container-padded py-16">
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-smoke">Best sellers</p>
          <h2 className="mt-3 font-serif text-4xl lg:text-5xl">Most requested pieces</h2>
        </div>
        <ProductGrid products={data?.bestSellers || []} />
      </section>

      <section className="container-padded grid gap-5 py-16 md:grid-cols-3">
        {["Maison Luma", "Atelier Aven", "Loom Studio"].map((brand) => (
          <article key={brand} className="border border-oat bg-white p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-smoke">Curated brand</p>
            <h3 className="mt-4 font-serif text-3xl">{brand}</h3>
            <p className="mt-4 text-sm leading-7 text-smoke">
              Selected for material integrity, modern proportion, and pieces that last past one season.
            </p>
          </article>
        ))}
      </section>

      <ReviewSection reviews={data?.reviews || []} />
    </>
  );
}