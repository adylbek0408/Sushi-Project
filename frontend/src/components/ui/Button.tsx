import { forwardRef } from "react";
import { clsx } from "@/lib/clsx";

type Variant = "primary" | "secondary" | "whatsapp" | "ghost";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  fullWidth?: boolean;
}

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-primary text-on-primary hover:bg-primary/90 shadow-elevation-1 disabled:opacity-50",
  secondary:
    "bg-surface-container-high text-on-surface hover:bg-surface-variant disabled:opacity-50",
  whatsapp:
    "bg-whatsapp text-white hover:bg-whatsapp-dark shadow-elevation-1 disabled:opacity-50",
  ghost: "bg-transparent text-on-surface hover:bg-surface-variant/50",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", fullWidth, className, children, ...props }, ref) => (
    <button
      ref={ref}
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-full font-label-md text-label-md",
        "px-6 py-3 transition-all duration-200 active:scale-[0.98]",
        "disabled:cursor-not-allowed",
        fullWidth && "w-full",
        VARIANTS[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  ),
);

Button.displayName = "Button";
