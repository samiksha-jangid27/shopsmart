import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "focus-ring h-12 w-full rounded-none border border-oat bg-white px-4 text-sm text-ink placeholder:text-stone-400",
        className
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "focus-ring min-h-32 w-full rounded-none border border-oat bg-white px-4 py-3 text-sm text-ink placeholder:text-stone-400",
        className
      )}
      {...props}
    />
  );
}
