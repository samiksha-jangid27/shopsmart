import Image from "next/image";
import { apiFetch } from "@/lib/api";
import type { Collection } from "@/types/catalog";

export default async function AdminCollectionsPage() {
  const { collections } = await apiFetch<{ collections: Collection[] }>("/admin/collections", { auth: true });
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {collections.map((collection) => (
        <article key={collection.id} className="overflow-hidden border border-oat bg-white">
          <div className="relative aspect-[16/9] bg-bone">
            <Image src={collection.coverUrl ?? collection.products[0]?.images[0]?.secureUrl ?? "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=85"} alt={collection.title} fill className="object-cover" />
          </div>
          <div className="p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-smoke">{collection.slug}</p>
            <h2 className="mt-2 font-serif text-3xl">{collection.title}</h2>
            <p className="mt-3 text-sm text-smoke">{collection.description}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
