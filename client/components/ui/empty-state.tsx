import { PackageSearch } from "lucide-react";
import { LinkButton } from "@/components/ui/button";

export function EmptyState({
  title,
  message,
  actionHref,
  actionLabel
}: {
  title: string;
  message: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="flex min-h-80 flex-col items-center justify-center border border-dashed border-oat bg-bone/40 px-6 text-center">
      <PackageSearch className="mb-5 h-10 w-10 text-smoke" aria-hidden />
      <h2 className="font-serif text-3xl text-ink">{title}</h2>
      <p className="mt-3 max-w-md text-sm leading-6 text-smoke">{message}</p>
      {actionHref && actionLabel ? (
        <LinkButton href={actionHref} className="mt-7">
          {actionLabel}
        </LinkButton>
      ) : null}
    </div>
  );
}
