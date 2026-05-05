import Link from "next/link";
import { apiFetch } from "@/lib/api";
import type { User } from "@/types/catalog";

export default async function AccountPage() {
  const { user } = await apiFetch<{ user: User }>("/auth/me", { auth: true });
  return (
    <div className="container-padded py-12">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-smoke">Account</p>
      <h1 className="mt-3 font-serif text-5xl">Welcome, {user.name}</h1>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {[["Orders", "/account/orders"], ["Wishlist", "/account/wishlist"], ["Admin tools", "/admin"]].map(([label, href]) => (
          <Link key={href} href={href} className="border border-oat bg-white p-8 transition hover:shadow-soft">
            <h2 className="font-serif text-3xl">{label}</h2>
            <p className="mt-3 text-sm text-smoke">Open your {label.toLowerCase()} area.</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
