import { apiFetch } from "@/lib/api";
import { formatMoney } from "@/lib/utils";

type Order = { id: string; orderNumber: string; status: string; total: string; customerEmail: string; createdAt: string; items: { id: string; productName: string; quantity: number }[] };

export default async function AdminOrdersPage() {
  const { orders } = await apiFetch<{ orders: Order[] }>("/admin/orders", { auth: true });
  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <article key={order.id} className="border border-oat bg-white p-6">
          <div className="flex flex-col justify-between gap-3 sm:flex-row">
            <div><p className="text-xs uppercase tracking-[0.2em] text-smoke">{order.status}</p><h2 className="mt-2 font-serif text-3xl">{order.orderNumber}</h2><p className="text-sm text-smoke">{order.customerEmail}</p></div>
            <p className="font-semibold">{formatMoney(order.total)}</p>
          </div>
          <p className="mt-4 text-sm text-smoke">{order.items.map((item) => `${item.productName} × ${item.quantity}`).join(", ")}</p>
        </article>
      ))}
    </div>
  );
}
