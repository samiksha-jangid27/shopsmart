import { Star } from "lucide-react";
import type { Review } from "@/types/catalog";

export function ReviewSection({ reviews }: { reviews: Review[] }) {
  return (
    <section className="bg-bone py-20">
      <div className="container-padded">
        <div className="mb-10 max-w-2xl"><p className="text-xs font-semibold uppercase tracking-[0.24em] text-smoke">Customer notes</p><h2 className="mt-3 font-serif text-4xl lg:text-5xl">Loved for the details</h2></div>
        <div className="grid gap-4 md:grid-cols-3">
          {reviews.map((review) => (
            <article key={review.id} className="bg-[#fbfaf7] p-6">
              <div className="mb-5 flex gap-1 text-clay">{Array.from({ length: review.rating }).map((_, index) => <Star key={index} className="h-4 w-4 fill-current" />)}</div>
              <h3 className="font-serif text-2xl">{review.title ?? review.product?.name}</h3>
              <p className="mt-4 text-sm leading-7 text-smoke">{review.body}</p>
              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-ink">{review.user.name}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
