import { apiFetch } from "@/lib/api";

export default async function AdminPage() {
  const summary = await apiFetch<{ products: number; orders: number; customers: number; lowStock: number }>("/admin/summary", { auth: true });
  return (
    <div className="grid gap-4 md:grid-cols-4">
      {Object.entries(summary).map(([key, value]) => (
        <article key={key} className="border border-oat bg-white p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-smoke">{key}</p>
          <p className="mt-3 font-serif text-5xl">{value}</p>
        </article>
      ))}
    </div>
  );
}
