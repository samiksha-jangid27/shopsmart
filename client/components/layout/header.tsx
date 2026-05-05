"use client";

import Link from "next/link";
import { Menu, Search, UserRound, X } from "lucide-react";
import { useState } from "react";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { Input } from "@/components/ui/input";
import type { User } from "@/types/catalog";

const links = [
  { href: "/shop", label: "Shop" },
  { href: "/shop/women", label: "Women" },
  { href: "/shop/men", label: "Men" },
  { href: "/about", label: "Atelier" },
  { href: "/contact", label: "Contact" }
];

export function Header({ user }: { user: User | null }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="glass-nav sticky top-0 z-40 border-b border-oat/80">
      <div className="container-padded flex h-16 items-center justify-between gap-4 lg:h-20">
        <button type="button" onClick={() => setMenuOpen(true)} className="focus-ring h-10 w-10 lg:hidden" aria-label="Open menu">
          <Menu className="mx-auto h-5 w-5" />
        </button>
        <Link href="/" className="font-serif text-2xl tracking-tight lg:text-3xl">ShopSmart</Link>
        <nav className="hidden items-center gap-8 lg:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-700 transition hover:text-ink">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-1">
          <button type="button" onClick={() => setSearchOpen((value) => !value)} className="focus-ring h-10 w-10" aria-label="Toggle search">
            <Search className="mx-auto h-5 w-5" />
          </button>
          <Link href={user ? "/account" : "/auth/login"} className="focus-ring hidden h-10 w-10 items-center justify-center sm:inline-flex" aria-label="Account">
            <UserRound className="h-5 w-5" />
          </Link>
          <CartDrawer />
        </div>
      </div>
      {searchOpen ? (
        <form action="/shop" className="border-t border-oat bg-[#fbfaf7] px-4 py-3">
          <div className="container-padded px-0">
            <Input name="q" placeholder="Search tailoring, linen, outerwear..." />
          </div>
        </form>
      ) : null}
      <div className={`fixed inset-0 z-50 lg:hidden ${menuOpen ? "visible" : "invisible"}`}>
        <button type="button" className={`absolute inset-0 bg-ink/35 transition-opacity ${menuOpen ? "opacity-100" : "opacity-0"}`} onClick={() => setMenuOpen(false)} aria-label="Close menu overlay" />
        <aside className={`absolute left-0 top-0 h-full w-[86%] max-w-sm bg-[#fbfaf7] p-6 transition-transform duration-300 ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="mb-10 flex items-center justify-between">
            <Link href="/" className="font-serif text-3xl" onClick={() => setMenuOpen(false)}>ShopSmart</Link>
            <button type="button" className="focus-ring h-10 w-10" onClick={() => setMenuOpen(false)} aria-label="Close menu">
              <X className="mx-auto h-5 w-5" />
            </button>
          </div>
          <nav className="flex flex-col gap-5">
            {links.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className="border-b border-oat pb-4 font-serif text-3xl">
                {link.label}
              </Link>
            ))}
            {user?.role === "ADMIN" ? (
              <Link href="/admin" onClick={() => setMenuOpen(false)} className="border-b border-oat pb-4 font-serif text-3xl">Admin</Link>
            ) : null}
          </nav>
        </aside>
      </div>
    </header>
  );
}
