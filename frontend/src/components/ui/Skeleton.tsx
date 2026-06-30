import { clsx } from "@/lib/clsx";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={clsx("animate-pulse rounded-xl bg-surface-container-high", className)}
    />
  );
}
