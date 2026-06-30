type ClassValue = string | number | null | false | undefined;

/** Minimal className combiner — joins truthy values with a space. */
export function clsx(...values: ClassValue[]): string {
  return values.filter(Boolean).join(" ");
}
