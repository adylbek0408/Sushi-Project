"use client";

import { Icon } from "./Icon";
import { clsx } from "@/lib/clsx";

interface QuantityStepperProps {
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  className?: string;
}

export function QuantityStepper({
  value,
  onIncrement,
  onDecrement,
  className,
}: QuantityStepperProps) {
  return (
    <div
      className={clsx(
        "flex items-center gap-3 rounded-full border border-surface-variant bg-surface p-1",
        className,
      )}
    >
      <button
        type="button"
        aria-label="Уменьшить количество"
        onClick={onDecrement}
        className="flex h-8 w-8 items-center justify-center rounded-full transition-transform active:scale-90"
      >
        <Icon name="remove" className="text-[18px]" />
      </button>
      <span className="min-w-[1ch] text-center font-label-md text-label-md">{value}</span>
      <button
        type="button"
        aria-label="Увеличить количество"
        onClick={onIncrement}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-on-primary transition-transform active:scale-90"
      >
        <Icon name="add" className="text-[18px]" />
      </button>
    </div>
  );
}
