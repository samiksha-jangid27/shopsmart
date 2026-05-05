import type { Category } from "@/types/catalog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function FilterSidebar({ categories, selectedCategory }: { categories: Category[]; selectedCategory?: string }) {
  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">
      <form action="/shop" className="space-y-7 border-y border-oat py-6 lg:border-y-0 lg:py-0">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-smoke">Category</p>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm"><input type="radio" name="category" value="" defaultChecked={!selectedCategory} />All</label>
            {categories.map((category) => (
              <label key={category.id} className="flex items-center gap-2 text-sm">
                <input type="radio" name="category" value={category.slug} defaultChecked={selectedCategory === category.slug} />
                {category.name}
              </label>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-smoke">Price</p>
          <div className="grid grid-cols-2 gap-2"><Input name="min" type="number" placeholder="Min" /><Input name="max" type="number" placeholder="Max" /></div>
        </div>
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-smoke">Fit Notes</p>
          <div className="grid grid-cols-2 gap-2"><Input name="size" placeholder="Size" /><Input name="color" placeholder="Color" /></div>
        </div>
        <Input name="brand" placeholder="Brand" />
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="availability" value="in-stock" />In stock only</label>
        <Button type="submit" className="w-full">Refine</Button>
      </form>
    </aside>
  );
}
