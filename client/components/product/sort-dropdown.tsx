"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function SortDropdown({ value }: { value?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  return (
    <select
      value={value ?? "featured"}
      onChange={(event) => {
        const next = new URLSearchParams(searchParams.toString());
        next.set("sort", event.target.value);
        router.push(`${pathname}?${next.toString()}`);
      }}
      className="focus-ring h-11 border border-oat bg-white px-3 text-sm"
      aria-label="Sort products"
    >
      <option value="featured">Curated</option>
      <option value="new">Newest</option>
      <option value="price-asc">Price low to high</option>
      <option value="price-desc">Price high to low</option>
    </select>
  );
}
