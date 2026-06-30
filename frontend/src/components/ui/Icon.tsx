import { clsx } from "@/lib/clsx";

interface IconProps {
  name: string;
  className?: string;
  filled?: boolean;
  ariaHidden?: boolean;
}

/** Renders a Material Symbols Outlined glyph. */
export function Icon({ name, className, filled = false, ariaHidden = true }: IconProps) {
  return (
    <span
      aria-hidden={ariaHidden}
      className={clsx("material-symbols-outlined select-none leading-none", className)}
      style={filled ? { fontVariationSettings: "'FILL' 1" } : undefined}
    >
      {name}
    </span>
  );
}
