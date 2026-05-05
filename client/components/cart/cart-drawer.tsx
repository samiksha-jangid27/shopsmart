"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/components/cart/cart-provider";
import { Button, LinkButton } from "@/components/ui/button";
import { formatMoney } from "@/lib/utils";

export function CartDrawer() {
  const [open, setOpen] = useState(false);
  const { items, count, subtotal, removeItem } = useCart();

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="focus-ring relative inline-flex h-10 w-10 items-center justify-center"
        aria-label="Open cart"
      >
        <ShoppingBag className="h-5 w-5" aria-hidden />
        {count ? (
          <span className="absolute right-0 top-0 flex h-5 min-w-5 items-center justify-center rounded-full bg-ink px-1 text-[10px] font-bold text-bone">
            {count}
          </span>
        ) : null}
      </button>
      <div className={`fixed inset-0 z-50 transition ${open ? "visible" : "invisible"}`}>
        <button
          type="button"
          aria-label="Close cart overlay"
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-ink/35 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
        />
        <aside
          className={`absolute right-0 top-0 h-full w-full max-w-md bg-[#fbfaf7] shadow-soft transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-oat px-5 py-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-smoke">Cart Preview</p>
                <h2 className="font-serif text-2xl">Your edit</h2>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="focus-ring h-10 w-10" aria-label="Close cart">
                <X className="mx-auto h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <p className="font-serif text-3xl">Your wardrobe is waiting.</p>
                  <LinkButton href="/shop" className="mt-6" onClick={() => setOpen(false)}>
                    Start browsing
                  </LinkButton>
                </div>
              ) : (
                <div className="space-y-5">
                  {items.map((item) => (
                    <div key={`${item.productId}-${item.variantId}`} className="flex gap-4">
                      <Link href={`/product/${item.slug}`} onClick={() => setOpen(false)}>
                        <Image src={item.image} alt={item.name} width={96} height={128} className="h-28 w-20 object-cover" />
                      </Link>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">{item.name}</p>
                        <p className="mt-1 text-xs text-smoke">{item.size ?? "One size"} · {item.color ?? "Core"}</p>
                        <p className="mt-2 text-sm">{formatMoney(item.price)} × {item.quantity}</p>
                        <Button
                          type="button"
                          variant="ghost"
                          className="mt-2 min-h-0 px-0 py-1 text-xs text-smoke hover:bg-transparent"
                          onClick={() => removeItem(item.productId, item.variantId)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="border-t border-oat p-5">
              <div className="mb-4 flex items-center justify-between text-sm">
                <span>Subtotal</span>
                <span className="font-semibold">{formatMoney(subtotal)}</span>
              </div>
              <LinkButton href="/cart" className="w-full" onClick={() => setOpen(false)}>
                Review cart
              </LinkButton>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
