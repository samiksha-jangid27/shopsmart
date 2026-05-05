import { CartPageClient } from "@/components/cart/cart-page";

export default function CartPage() {
  return (
    <div className="container-padded py-12">
      <div className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-smoke">Cart</p>
        <h1 className="mt-3 font-serif text-5xl lg:text-7xl">Review your edit</h1>
      </div>
      <CartPageClient />
    </div>
  );
}
