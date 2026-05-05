import Image from "next/image";
import Link from "next/link";

export function EditorialBlocks() {
  return (
    <section className="container-padded grid gap-8 py-20 lg:grid-cols-2 lg:items-center">
      <div className="relative aspect-[4/5] overflow-hidden bg-bone">
        <Image src="https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=1400&q=85" alt="Editorial fashion styling" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
      </div>
      <div className="lg:px-12">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-smoke">The atelier note</p>
        <h2 className="mt-4 font-serif text-5xl leading-tight lg:text-6xl">Built around fewer, better pieces.</h2>
        <p className="mt-6 text-base leading-8 text-smoke">ShopSmart treats commerce like an editorial wardrobe: structured discovery, generous imagery, honest materials, and quiet conversion moments that keep the product in focus.</p>
        <Link href="/about" className="editorial-link mt-8">Read the story</Link>
      </div>
    </section>
  );
}
