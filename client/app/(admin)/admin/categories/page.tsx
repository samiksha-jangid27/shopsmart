import { CategoryForm } from "@/components/admin/category-form";
import { apiFetch } from "@/lib/api";
import type { Category } from "@/types/catalog";

export default async function AdminCategoriesPage() {
  const { categories } = await apiFetch<{ categories: Category[] }>("/admin/categories", { auth: true });
  return (
    <div className="space-y-6">
      <CategoryForm />
      <div className="grid gap-4 md:grid-cols-3">
        {categories.map((category) => (
          <article key={category.id} className="border border-oat bg-white p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-smoke">{category.slug}</p>
            <h2 className="mt-2 font-serif text-3xl">{category.name}</h2>
            <p className="mt-3 text-sm text-smoke">{category.description}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
