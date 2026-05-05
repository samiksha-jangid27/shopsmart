import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="container-padded grid gap-10 py-16 lg:grid-cols-2 lg:items-center">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-smoke">About</p>
        <h1 className="mt-3 font-serif text-5xl leading-tight lg:text-7xl">A premium storefront built for learning real commerce systems.</h1>
        <p className="mt-6 text-sm leading-8 text-smoke">ShopSmart combines a high-end fashion retail aesthetic with practical full-stack architecture: a polished Next.js client, Express API, Prisma data model, Cloudinary uploads, role-based auth, and admin operations.</p>
      </div>
      <div className="relative aspect-[4/5] overflow-hidden bg-bone">
        <Image src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=85" alt="Fashion editorial rail" fill className="object-cover" />
      </div>
    </div>
  );
}
