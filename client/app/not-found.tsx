import { EmptyState } from "@/components/ui/empty-state";

export default function NotFound() {
  return (
    <div className="container-padded py-20">
      <EmptyState
        title="This edit is unavailable"
        message="The page may have moved, or the collection is no longer being shown."
        actionHref="/shop"
        actionLabel="Return to shop"
      />
    </div>
  );
}
