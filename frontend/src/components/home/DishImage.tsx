import Image from "next/image";
import { Icon } from "@/components/ui/Icon";
import { clsx } from "@/lib/clsx";

interface DishImageProps {
  src: string | null;
  alt: string;
  /** Extra classes for the outer frame. */
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** Hover zoom on the dish photo (catalog cards). */
  zoomOnHover?: boolean;
}

const DISH_BG = "/dish-bg.png";

/**
 * Dish photo framed on the branded orange splash.
 * Every dish is rendered inside the same relative box so sizes look uniform
 * regardless of the source image dimensions.
 */
export function DishImage({
  src,
  alt,
  className,
  sizes = "(max-width: 768px) 50vw, 320px",
  priority = false,
  zoomOnHover = false,
}: DishImageProps) {
  return (
    <div
      className={clsx(
        "relative aspect-square overflow-hidden bg-white",
        className,
      )}
    >
      {/* Orange splash — shared frame size for all dishes */}
      <div className="absolute inset-[2%]" aria-hidden>
        <Image
          src={DISH_BG}
          alt=""
          fill
          sizes={sizes}
          className="object-contain object-center"
          priority={priority}
        />
      </div>

      {src ? (
        <div
          className={clsx(
            "absolute inset-[14%]",
            zoomOnHover &&
              "transition-transform duration-500 group-hover:scale-105",
          )}
        >
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            priority={priority}
            className="object-contain object-center"
          />
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon name="ramen_dining" className="text-4xl text-secondary md:text-6xl" />
        </div>
      )}
    </div>
  );
}
