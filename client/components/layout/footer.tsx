import Link from "next/link";
import { Instagram, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-oat bg-ink text-bone">
      <div className="container-padded grid gap-12 py-14 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div>
          <p className="font-serif text-4xl">ShopSmart Atelier</p>
          <p className="mt-5 max-w-md text-sm leading-7 text-bone/70">
            A premium college-project commerce platform shaped like a curated boutique, with a real API, Prisma schema, Cloudinary uploads, auth, orders, wishlist, reviews, and admin tools.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-bone/60">Visit</p>
          <div className="mt-5 space-y-3 text-sm text-bone/75">
            <Link href="/shop" className="block hover:text-white">Shop all</Link>
            <Link href="/about" className="block hover:text-white">Brand story</Link>
            <Link href="/account/orders" className="block hover:text-white">Orders</Link>
            <Link href="/admin" className="block hover:text-white">Admin</Link>
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-bone/60">Concierge</p>
          <div className="mt-5 space-y-3 text-sm text-bone/75">
            <p className="flex items-center gap-2"><Mail className="h-4 w-4" /> hello@shopsmart.local</p>
            <p className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Jaipur, India</p>
            <p className="flex items-center gap-2"><Instagram className="h-4 w-4" /> @shopsmartatelier</p>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <form className="container-padded flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-bone/70">Private preview list for new edits and collection notes.</p>
          <div className="flex w-full gap-2 sm:max-w-md">
            <Input type="email" placeholder="Email address" className="border-white/20 bg-white/10 text-bone placeholder:text-bone/50" />
            <Button type="button" variant="secondary" className="shrink-0 bg-bone">Join</Button>
          </div>
        </form>
      </div>
    </footer>
  );
}
