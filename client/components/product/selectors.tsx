"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function SizeSelector({ sizes, value, onChange }: { sizes: string[]; value?: string; onChange: (value: string) => void }) {
  return (
    <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
      {sizes.map((size) => (
        <button key={size} type="button" onClick={() => onChange(size)} className={cn("focus-ring h-11 border border-oat bg-white text-sm transition hover:border-ink", value === size && "border-ink bg-ink text-bone")}>
          {size}
        </button>
      ))}
    </div>
  );
}

export function ColorSelector({ colors, value, onChange }: { colors: { name: string; hex?: string | null }[]; value?: string; onChange: (value: string) => void }) {
  return (
    <div className="flex flex-wrap gap-3">
      {colors.map((color) => (
        <button key={color.name} type="button" onClick={() => onChange(color.name)} className={cn("focus-ring flex items-center gap-2 border border-oat bg-white px-3 py-2 text-sm transition hover:border-ink", value === color.name && "border-ink")}>
          <span className="h-4 w-4 rounded-full border border-black/10" style={{ backgroundColor: color.hex ?? "#ddd" }} />
          {color.name}
        </button>
      ))}
    </div>
  );
}

export function QuantitySelector({ value, onChange, max }: { value: number; onChange: (value: number) => void; max: number }) {
  return (
    <div className="inline-flex h-12 items-center border border-oat bg-white">
      <button type="button" onClick={() => onChange(Math.max(1, value - 1))} className="focus-ring inline-flex h-full w-12 items-center justify-center" aria-label="Decrease quantity">
        <Minus className="h-4 w-4" />
      </button>
      <span className="min-w-10 text-center text-sm font-semibold">{value}</span>
      <button type="button" onClick={() => onChange(Math.min(max, value + 1))} className="focus-ring inline-flex h-full w-12 items-center justify-center" aria-label="Increase quantity">
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
