"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { ProductImage } from "@/types/catalog";

export function ProductGallery({ images, name }: { images: ProductImage[]; name: string }) {
  const [active, setActive] = useState(images[0]?.secureUrl ?? "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=85");

  return (
    <div className="grid gap-3 lg:grid-cols-[88px_1fr]">
      <div className="order-2 flex gap-3 overflow-x-auto lg:order-1 lg:flex-col lg:overflow-visible">
        {images.map((image) => (
          <button key={image.id} type="button" onClick={() => setActive(image.secureUrl)} className={cn("focus-ring relative h-24 w-20 shrink-0 overflow-hidden border bg-bone", active === image.secureUrl ? "border-ink" : "border-transparent")} aria-label={`View ${image.alt ?? name}`}>
            <Image src={image.secureUrl} alt="" fill sizes="80px" className="object-cover" />
          </button>
        ))}
      </div>
      <div className="order-1 relative aspect-[4/5] overflow-hidden bg-bone lg:order-2">
        <Image src={active} alt={name} fill priority sizes="(min-width: 1024px) 58vw, 100vw" className="object-cover transition duration-700 hover:scale-105" />
      </div>
    </div>
  );
}
