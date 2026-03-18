import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(
  iso: string,
  options?: { month?: "long" | "short" }
): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: options?.month ?? "short",
    day: "numeric",
    year: "numeric",
  });
}
