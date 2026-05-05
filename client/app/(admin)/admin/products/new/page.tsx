import { ProductForm } from "@/components/admin/product-form";
import { apiFetch } from "@/lib/api";
import type { Category } from "@/types/catalog";

export default async function NewProductPage() {
  const { categories } = await apiFetch<{ categories: Category[] }>("/admin/categories", { auth: true });
  return <ProductForm categories={categories} />;
}
