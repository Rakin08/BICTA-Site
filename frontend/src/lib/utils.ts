import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind classes without conflicts.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a Date into a readable string.
 * e.g. "June 20, 2026"
 */
export function formatDate(date: Date | string | null): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Format an event date range.
 * e.g. "Jun 20 – Jul 12, 2026"
 */
export function formatEventDateRange(
  start: Date | string | null,
  end: Date | string | null
): string {
  if (!start) return "";
  const s = typeof start === "string" ? new Date(start) : start;
  const startStr = s.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  if (!end) return startStr;

  const e = typeof end === "string" ? new Date(end) : end;
  const endStr =
    s.getFullYear() === e.getFullYear()
      ? e.toLocaleDateString("en-US", { month: "short", day: "numeric" })
      : e.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });

  const yearStr =
    s.getFullYear() === e.getFullYear()
      ? `, ${s.getFullYear()}`
      : "";

  return `${startStr} – ${endStr}${yearStr}`;
}
