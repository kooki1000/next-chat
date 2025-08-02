import type { ClassValue } from "clsx";

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function logError(type: string, message: string, originalError?: unknown): void {
  console.error(`${type} error: ${message}`, originalError);
}
