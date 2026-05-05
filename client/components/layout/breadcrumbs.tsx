import Link from "next/link";

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="container-padded py-5 text-xs text-smoke">
      <ol className="flex flex-wrap items-center gap-2">
        <li><Link href="/" className="hover:text-ink">Home</Link></li>
        {items.map((item) => (
          <li key={item.label} className="flex items-center gap-2">
            <span>/</span>
            {item.href ? <Link href={item.href} className="hover:text-ink">{item.label}</Link> : <span className="text-ink">{item.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
