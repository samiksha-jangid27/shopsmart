import { ProductForm } from "@/components/admin/product-form";
import { apiFetch } from "@/lib/api";
import type { Category, Product } from "@/types/catalog";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [{ product }, { categories }] = await Promise.all([
    apiFetch<{ product: Product }>(`/admin/products/${id}`, { auth: true }),
    apiFetch<{ categories: Category[] }>("/admin/categories", { auth: true })
  ]);
  return <ProductForm product={product} categories={categories} />;
}
