"use client";

import Image from "next/image";
import { Icon } from "@/components/ui/Icon";
import { mediaUrl } from "@/lib/config";
import { clsx } from "@/lib/clsx";

interface CartThumbProps {
  src: string | null;
  alt: string;
  /** Tailwind size classes, default h-20 w-20. */
  className?: string;
}

const DISH_BG = "/dish-bg.png";

/** Cart thumbnail — full dish visible (object-contain, no crop). */
export function CartThumb({ src, alt, className }: CartThumbProps) {
  const image = mediaUrl(src);

  return (
    <div
      className={clsx(
        "relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-white",
        className,
      )}
    >
      {/* Orange splash — temporarily disabled
      <div className="absolute inset-[4%]" aria-hidden>
        <Image
          src={DISH_BG}
          alt=""
          fill
          sizes="80px"
          className="object-contain object-center"
        />
      </div>
      */}
      {image ? (
        <div className="absolute inset-[10%]">
          <Image
            src={image}
            alt={alt}
            fill
            sizes="80px"
            className="object-contain object-center"
          />
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon name="ramen_dining" className="text-secondary" />
        </div>
      )}
    </div>
  );
}
