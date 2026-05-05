"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";
import type { CartLine } from "@/types/catalog";

const CART_KEY = "shopsmart_cart";

type CartContextValue = {
  items: CartLine[];
  count: number;
  subtotal: number;
  addItem: (item: CartLine) => void;
  updateQuantity: (productId: string, variantId: string | null | undefined, quantity: number) => void;
  removeItem: (productId: string, variantId?: string | null) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

function lineKey(item: Pick<CartLine, "productId" | "variantId">) {
  return `${item.productId}:${item.variantId ?? "default"}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const raw = window.localStorage.getItem(CART_KEY);
    if (raw) setItems(JSON.parse(raw) as CartLine[]);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) window.localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items, mounted]);

  const addItem = useCallback((item: CartLine) => {
    setItems((current) => {
      const existing = current.find((line) => lineKey(line) === lineKey(item));
      if (!existing) return [...current, item];
      return current.map((line) =>
        lineKey(line) === lineKey(item)
          ? { ...line, quantity: Math.min(line.quantity + item.quantity, line.stock) }
          : line
      );
    });
  }, []);

  const updateQuantity = useCallback(
    (productId: string, variantId: string | null | undefined, quantity: number) => {
      setItems((current) =>
        current.map((line) =>
          line.productId === productId && (line.variantId ?? null) === (variantId ?? null)
            ? { ...line, quantity: Math.min(Math.max(quantity, 1), line.stock) }
            : line
        )
      );
    },
    []
  );

  const removeItem = useCallback((productId: string, variantId?: string | null) => {
    setItems((current) =>
      current.filter(
        (line) => !(line.productId === productId && (line.variantId ?? null) === (variantId ?? null))
      )
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const value = useMemo(() => {
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return { items, count, subtotal, addItem, updateQuantity, removeItem, clearCart };
  }, [addItem, clearCart, items, removeItem, updateQuantity]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("useCart must be used within CartProvider");
  return value;
}
