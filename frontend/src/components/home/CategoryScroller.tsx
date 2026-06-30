"use client";

import Image from "next/image";
import { clsx } from "@/lib/clsx";
import { mediaUrl } from "@/lib/config";
import { Icon } from "@/components/ui/Icon";
import type { Category } from "@/types";

interface CategoryScrollerProps {
  categories: Category[];
  selectedSlug: string | null;
  onSelect: (slug: string | null) => void;
}

export function CategoryScroller({
  categories,
  selectedSlug,
  onSelect,
}: CategoryScrollerProps) {
  return (
    <section className="mt-stack-lg">
      <div className="mb-4 flex items-center justify-between px-margin-mobile md:px-0">
        <h2 className="font-headline-md text-headline-md text-on-surface">Категории</h2>
      </div>
      <div className="no-scrollbar flex gap-4 overflow-x-auto px-margin-mobile pb-2 md:gap-6 md:px-0">
        <CategoryChip
          label="Все"
          active={selectedSlug === null}
          onClick={() => onSelect(null)}
        />
        {categories.map((category) => (
          <CategoryChip
            key={category.id}
            label={category.name}
            image={category.image}
            active={selectedSlug === category.slug}
            onClick={() => onSelect(category.slug)}
          />
        ))}
      </div>
    </section>
  );
}

interface CategoryChipProps {
  label: string;
  image?: string | null;
  active: boolean;
  onClick: () => void;
}

function CategoryChip({ label, image, active, onClick }: CategoryChipProps) {
  const resolvedImage = mediaUrl(image);
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex flex-shrink-0 flex-col items-center space-y-2 md:space-y-3"
    >
      <span
        className={clsx(
          "flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl transition-transform active:scale-90 md:h-24 md:w-24 md:rounded-3xl",
          active
            ? "bg-primary-fixed shadow-elevation-2 ring-2 ring-primary/20"
            : "border border-transparent bg-surface-container-high shadow-sm group-hover:border-primary/20",
        )}
      >
        {resolvedImage ? (
          <Image
            src={resolvedImage}
            alt={label}
            width={96}
            height={96}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <Icon name="restaurant" className="text-primary" />
        )}
      </span>
      <span
        className={clsx(
          "font-label-md text-label-md transition-colors",
          active ? "font-bold text-primary" : "text-on-surface group-hover:text-primary",
        )}
      >
        {label}
      </span>
    </button>
  );
}
