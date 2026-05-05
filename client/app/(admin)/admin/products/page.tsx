import Image from "next/image";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { formatMoney } from "@/lib/utils";
import type { Product } from "@/types/catalog";

export default async function AdminProductsPage() {
  const { products } = await apiFetch<{ products: Product[] }>("/admin/products", { auth: true });
  return (
    <div className="space-y-4">
      {products.map((product) => (
        <Link key={product.id} href={`/admin/products/${product.id}`} className="grid grid-cols-[72px_1fr_auto] items-center gap-4 border border-oat bg-white p-4 hover:shadow-soft">
          <Image src={product.images[0]?.secureUrl ?? "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=300&q=85"} alt={product.name} width={72} height={96} className="h-24 w-18 object-cover" />
          <div><p className="font-semibold">{product.name}</p><p className="text-sm text-smoke">{product.brand} · {product.inventoryQuantity} in stock</p></div>
          <p className="text-sm font-semibold">{formatMoney(product.price)}</p>
        </Link>
      ))}
    </div>
  );
}
