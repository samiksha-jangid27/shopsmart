import Image from "next/image";
import Link from "next/link";
import type { Collection } from "@/types/catalog";

export function CollectionSection({ collections }: { collections: Collection[] }) {
  return (
    <section className="container-padded py-20">
      <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div><p className="text-xs font-semibold uppercase tracking-[0.24em] text-smoke">Featured collections</p><h2 className="mt-3 font-serif text-4xl lg:text-5xl">Wardrobe chapters</h2></div>
        <Link href="/shop" className="editorial-link">View all</Link>
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        {collections.map((collection, index) => (
          <Link key={collection.id} href={`/shop?collection=${collection.slug}`} className={`group relative min-h-[420px] overflow-hidden bg-ink text-bone ${index === 0 ? "lg:col-span-2" : ""}`}>
            <Image src={collection.coverUrl ?? collection.products[0]?.images[0]?.secureUrl ?? "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=85"} alt={collection.title} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover opacity-80 transition duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 p-6 lg:p-8">
              <p className="text-xs uppercase tracking-[0.22em] text-bone/70">{collection.products.length} pieces</p>
              <h3 className="mt-2 font-serif text-4xl">{collection.title}</h3>
              <p className="mt-3 max-w-md text-sm leading-6 text-bone/75">{collection.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
