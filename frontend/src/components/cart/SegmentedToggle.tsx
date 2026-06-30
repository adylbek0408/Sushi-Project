"use client";

import { clsx } from "@/lib/clsx";
import type { DeliveryType } from "@/types";

interface SegmentedToggleProps {
  value: DeliveryType;
  onChange: (value: DeliveryType) => void;
}

const OPTIONS: { value: DeliveryType; label: string }[] = [
  { value: "delivery", label: "Доставка" },
  { value: "pickup", label: "Самовывоз" },
];

export function SegmentedToggle({ value, onChange }: SegmentedToggleProps) {
  return (
    <div className="relative flex h-12 rounded-full bg-surface-container-high p-1">
      <span
        aria-hidden
        className={clsx(
          "absolute top-1 h-10 w-[calc(50%-4px)] rounded-full bg-surface shadow-sm transition-all duration-300 ease-out",
          value === "delivery" ? "left-1" : "left-[calc(50%)]",
        )}
      />
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={clsx(
            "z-10 flex flex-1 items-center justify-center font-label-md text-label-md transition-colors",
            value === option.value ? "text-primary" : "text-secondary",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
