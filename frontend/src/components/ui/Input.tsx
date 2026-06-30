import { forwardRef } from "react";
import { clsx } from "@/lib/clsx";

interface FieldProps {
  label: string;
  error?: string;
  icon?: React.ReactNode;
}

type InputProps = FieldProps & React.InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className, id, ...props }, ref) => {
    const fieldId = id ?? props.name;
    return (
      <div className="space-y-1">
        <label htmlFor={fieldId} className="ml-1 font-label-md text-on-secondary-fixed-variant">
          {label}
        </label>
        <div className="relative">
          <input
            id={fieldId}
            ref={ref}
            className={clsx(
              "h-14 w-full rounded-xl border-none bg-surface-container-low px-4 font-body-md text-on-surface",
              "transition-all focus:outline-none focus:ring-2 focus:ring-secondary/30",
              icon ? "pr-12" : undefined,
              error && "ring-2 ring-error/40",
              className,
            )}
            aria-invalid={Boolean(error)}
            {...props}
          />
          {icon && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-primary">
              {icon}
            </span>
          )}
        </div>
        {error && <p className="ml-1 font-label-sm text-label-sm text-error">{error}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";

type TextareaProps = FieldProps & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const fieldId = id ?? props.name;
    return (
      <div className="space-y-1">
        <label htmlFor={fieldId} className="ml-1 font-label-md text-on-secondary-fixed-variant">
          {label}
        </label>
        <textarea
          id={fieldId}
          ref={ref}
          className={clsx(
            "w-full resize-none rounded-xl border-none bg-surface-container-low p-4 font-body-md text-on-surface",
            "transition-all focus:outline-none focus:ring-2 focus:ring-secondary/30",
            error && "ring-2 ring-error/40",
            className,
          )}
          {...props}
        />
        {error && <p className="ml-1 font-label-sm text-label-sm text-error">{error}</p>}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";
