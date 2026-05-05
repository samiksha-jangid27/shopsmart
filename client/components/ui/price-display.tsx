import { formatMoney } from "@/lib/utils";

export function PriceDisplay({
  price,
  compareAtPrice
}: {
  price: number | string;
  compareAtPrice?: number | string | null;
}) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="text-sm font-semibold text-ink">{formatMoney(price)}</span>
      {compareAtPrice ? (
        <span className="text-xs text-smoke line-through">{formatMoney(compareAtPrice)}</span>
      ) : null}
    </div>
  );
}
