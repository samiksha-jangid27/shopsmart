import Link from "next/link";

const links = [
  ["/admin", "Overview"],
  ["/admin/products", "Products"],
  ["/admin/products/new", "New product"],
  ["/admin/orders", "Orders"],
  ["/admin/categories", "Categories"],
  ["/admin/collections", "Collections"]
];

export function AdminNav() {
  return (
    <nav className="mb-8 flex gap-2 overflow-x-auto border-b border-oat pb-3">
      {links.map(([href, label]) => (
        <Link key={href} href={href} className="shrink-0 border border-oat bg-white px-4 py-2 text-sm font-semibold hover:border-ink">
          {label}
        </Link>
      ))}
    </nav>
  );
}
