import Image from "next/image";
import { Icon } from "@/components/ui/Icon";
import { clsx } from "@/lib/clsx";

type DishImageSize = "card" | "detail";

interface DishImageProps {
  src: string | null;
  alt: string;
  /** Extra classes for the outer frame. */
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** Hover zoom on the dish photo (catalog cards). */
  zoomOnHover?: boolean;
  /** card = catalog grid; detail = product page (larger dish). */
  size?: DishImageSize;
}

const DISH_BG = "/dish-bg.png";

const FRAME: Record<
  DishImageSize,
  { splash: string; dish: string; splashScale: string }
> = {
  card: {
    splash: "absolute inset-0",
    dish: "absolute inset-[4%] md:inset-[7%]",
    splashScale: "scale-[1.12]",
  },
  detail: {
    splash: "absolute inset-0",
    dish: "absolute inset-[1%] sm:inset-[3%] md:inset-[6%]",
    splashScale: "scale-[1.18] md:scale-[1.12]",
  },
};

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
  size = "card",
}: DishImageProps) {
  const frame = FRAME[size];

  return (
    <div
      className={clsx(
        "relative aspect-square overflow-hidden bg-white",
        className,
      )}
    >
      {/* Orange splash — temporarily disabled
      <div className={frame.splash} aria-hidden>
        <Image
          src={DISH_BG}
          alt=""
          fill
          sizes={sizes}
          className={clsx("object-contain object-center", frame.splashScale)}
          priority={priority}
        />
      </div>
      */}

      {src ? (
        <div
          className={clsx(
            frame.dish,
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
