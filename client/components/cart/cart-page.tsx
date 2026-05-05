"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/cart/cart-provider";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { clientFetch } from "@/lib/client-api";
import { formatMoney } from "@/lib/utils";

export function CartPageClient() {
  const { items, subtotal, updateQuantity, removeItem, clearCart } = useCart();
  const [shipping, setShipping] = useState({ fullName: "", email: "", phone: "", line1: "", line2: "", city: "", state: "", postalCode: "", country: "India", notes: "" });
  const [message, setMessage] = useState("");
  const total = subtotal + (subtotal >= 10000 || subtotal === 0 ? 0 : 499);

  async function checkout() {
    setMessage("");
    try {
      const data = await clientFetch<{ order: { orderNumber: string } }>("/customer/checkout", {
        method: "POST",
        body: JSON.stringify({
          items: items.map((item) => ({ productId: item.productId, variantId: item.variantId, quantity: item.quantity })),
          shipping
        })
      });
      clearCart();
      setMessage(`Order ${data.order.orderNumber} was created.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not create order.");
    }
  }

  if (!items.length && !message) {
    return <EmptyState title="Your cart is empty" message="Start with a hero piece, then build the rest of the edit around it." actionHref="/shop" actionLabel="Shop now" />;
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_420px]">
      <div className="space-y-5">
        {message ? <div className="border border-olive bg-bone p-5 text-sm text-olive">{message}</div> : null}
        {items.map((item) => (
          <div key={`${item.productId}-${item.variantId}`} className="grid grid-cols-[96px_1fr] gap-4 border-b border-oat pb-5">
            <Image src={item.image} alt={item.name} width={120} height={160} className="aspect-[3/4] w-24 object-cover" />
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <Link href={`/product/${item.slug}`} className="font-semibold">{item.name}</Link>
                <p className="mt-1 text-xs text-smoke">{item.size ?? "One size"} · {item.color ?? "Core"}</p>
                <p className="mt-2 text-sm">{formatMoney(item.price)}</p>
              </div>
              <div className="flex items-center gap-3">
                <Input type="number" min={1} max={item.stock} value={item.quantity} onChange={(event) => updateQuantity(item.productId, item.variantId, Number(event.target.value))} className="h-10 w-20" />
                <Button type="button" variant="ghost" onClick={() => removeItem(item.productId, item.variantId)} className="min-h-10 px-3">Remove</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <aside className="self-start border border-oat bg-white p-6">
        <h2 className="font-serif text-3xl">Order flow</h2>
        <div className="mt-6 space-y-3">
          {(["fullName", "email", "phone", "line1", "line2", "city", "state", "postalCode"] as const).map((field) => (
            <Input key={field} placeholder={field.replace(/([A-Z])/g, " $1")} value={shipping[field]} onChange={(event) => setShipping({ ...shipping, [field]: event.target.value })} />
          ))}
        </div>
        <div className="mt-6 border-y border-oat py-4 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span>{formatMoney(subtotal)}</span></div>
          <div className="mt-2 flex justify-between"><span>Shipping</span><span>{subtotal >= 10000 ? "Free" : formatMoney(subtotal ? 499 : 0)}</span></div>
          <div className="mt-4 flex justify-between font-semibold"><span>Total</span><span>{formatMoney(total)}</span></div>
        </div>
        <Input className="mt-5" placeholder="Coupon code placeholder" />
        <Button type="button" onClick={checkout} className="mt-4 w-full">Create order</Button>
      </aside>
    </div>
  );
}
