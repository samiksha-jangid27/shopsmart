"use client";

import { ShoppingBag } from "lucide-react";
import { useMemo, useState } from "react";
import { useCart } from "@/components/cart/cart-provider";
import { ColorSelector, QuantitySelector, SizeSelector } from "@/components/product/selectors";
import { Button } from "@/components/ui/button";
import type { Product, ProductVariant } from "@/types/catalog";

export function ProductPurchase({ product }: { product: Product }) {
  const { addItem } = useCart();
  const sizes = Array.from(new Set(product.variants.map((variant) => variant.size)));
  const colors = product.variants.reduce<{ name: string; hex?: string | null }[]>((acc, variant) => {
    if (!acc.find((color) => color.name === variant.color)) acc.push({ name: variant.color, hex: variant.colorHex });
    return acc;
  }, []);
  const [size, setSize] = useState(sizes[0]);
  const [color, setColor] = useState(colors[0]?.name);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const variant = useMemo<ProductVariant | undefined>(() => product.variants.find((item) => item.size === size && item.color === color), [color, product.variants, size]);
  const stock = variant?.stock ?? product.inventoryQuantity;
  const image = product.images[0]?.secureUrl ?? "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=85";

  function handleAdd() {
    addItem({
      productId: product.id,
      variantId: variant?.id,
      name: product.name,
      slug: product.slug,
      image,
      price: Number(product.price),
      compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
      size,
      color,
      quantity,
      stock: Math.max(stock, 1)
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div className="space-y-7">
      <div>
        <div className="mb-3 flex items-center justify-between"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-smoke">Size</p><p className="text-xs text-smoke">Relaxed premium fit</p></div>
        <SizeSelector sizes={sizes} value={size} onChange={setSize} />
      </div>
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-smoke">Color</p>
        <ColorSelector colors={colors} value={color} onChange={setColor} />
      </div>
      <div className="flex items-center justify-between border-y border-oat py-5">
        <div><p className="text-sm font-semibold">{stock > 0 ? "In stock" : "Made to order"}</p><p className="mt-1 text-xs text-smoke">{stock > 0 ? `${stock} pieces available` : "Ships when restocked"}</p></div>
        <QuantitySelector value={quantity} onChange={setQuantity} max={Math.max(stock, 1)} />
      </div>
      <Button type="button" onClick={handleAdd} disabled={stock <= 0} className="w-full"><ShoppingBag className="h-4 w-4" />{added ? "Added to cart" : "Add to cart"}</Button>
    </div>
  );
}
