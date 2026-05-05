"use client";

import { Heart } from "lucide-react";
import { useState } from "react";
import { clientFetch } from "@/lib/client-api";
import { cn } from "@/lib/utils";

export function WishlistButton({ productId, className }: { productId: string; className?: string }) {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    try {
      if (saved) {
        await clientFetch(`/customer/wishlist/${productId}`, { method: "DELETE" });
      } else {
        await clientFetch("/customer/wishlist", {
          method: "POST",
          body: JSON.stringify({ productId })
        });
      }
      setSaved((value) => !value);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={loading}
      className={cn(
        "focus-ring inline-flex h-10 w-10 items-center justify-center bg-white/85 text-ink shadow-sm transition hover:bg-ink hover:text-bone",
        className
      )}
      aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
    >
      <Heart className={cn("h-4 w-4", saved && "fill-current")} />
    </button>
  );
}
