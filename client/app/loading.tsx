import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container-padded grid gap-4 py-16 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index}>
          <Skeleton className="aspect-[3/4]" />
          <Skeleton className="mt-4 h-4 w-2/3" />
          <Skeleton className="mt-2 h-4 w-1/3" />
        </div>
      ))}
    </div>
  );
}
