"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { clientFetch } from "@/lib/client-api";
import type { Category, Product } from "@/types/catalog";

export function ProductForm({ categories, product }: { categories: Category[]; product?: Product }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: product?.name ?? "",
    slug: product?.slug ?? "",
    brand: product?.brand ?? "",
    subtitle: product?.subtitle ?? "",
    description: product?.description ?? "",
    materials: product?.materials ?? "",
    care: product?.care ?? "",
    categoryId: product?.categoryId ?? categories[0]?.id ?? "",
    price: String(product?.price ?? ""),
    compareAtPrice: String(product?.compareAtPrice ?? ""),
    inventoryQuantity: String(product?.inventoryQuantity ?? 0),
    status: product?.status ?? "ACTIVE",
    isFeatured: product?.isFeatured ?? false,
    isNewArrival: product?.isNewArrival ?? false,
    isBestSeller: product?.isBestSeller ?? false
  });
  const [message, setMessage] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const body = {
      ...form,
      price: Number(form.price),
      compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : null,
      inventoryQuantity: Number(form.inventoryQuantity),
      images: product?.images.map((image) => ({ publicId: image.publicId, secureUrl: image.secureUrl, alt: image.alt ?? form.name })) ?? [],
      variants: product?.variants ?? [
        { sku: `${form.slug}-S-BLACK`, size: "S", color: "Black", colorHex: "#171412", stock: Number(form.inventoryQuantity) },
        { sku: `${form.slug}-M-BLACK`, size: "M", color: "Black", colorHex: "#171412", stock: Number(form.inventoryQuantity) }
      ]
    };

    try {
      await clientFetch(product ? `/admin/products/${product.id}` : "/admin/products", {
        method: product ? "PUT" : "POST",
        body: JSON.stringify(body)
      });
      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not save product.");
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-5 lg:grid-cols-2">
      {message ? <p className="lg:col-span-2 text-sm text-wine">{message}</p> : null}
      {(["name", "slug", "brand", "subtitle", "price", "compareAtPrice", "inventoryQuantity"] as const).map((field) => (
        <Input key={field} placeholder={field} value={String(form[field])} onChange={(event) => setForm({ ...form, [field]: event.target.value })} />
      ))}
      <select value={form.categoryId} onChange={(event) => setForm({ ...form, categoryId: event.target.value })} className="focus-ring h-12 border border-oat bg-white px-4 text-sm">
        {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
      </select>
      <div className="flex flex-wrap gap-4 text-sm">
        {(["isFeatured", "isNewArrival", "isBestSeller"] as const).map((field) => (
          <label key={field} className="flex items-center gap-2"><input type="checkbox" checked={Boolean(form[field])} onChange={(event) => setForm({ ...form, [field]: event.target.checked })} />{field}</label>
        ))}
      </div>
      <Textarea className="lg:col-span-2" placeholder="Description" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
      <Textarea placeholder="Materials" value={form.materials} onChange={(event) => setForm({ ...form, materials: event.target.value })} />
      <Textarea placeholder="Care" value={form.care} onChange={(event) => setForm({ ...form, care: event.target.value })} />
      <Button className="lg:col-span-2">{product ? "Update product" : "Create product"}</Button>
    </form>
  );
}
