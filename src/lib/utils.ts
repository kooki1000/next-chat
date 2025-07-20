import type { ClassValue } from "clsx";
import type { Result } from "neverthrow";
import type { Message } from "@/types";

import { clsx } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function logError(type: string, message: string, originalError?: unknown): void {
  console.error(`${type} error: ${message}`, originalError);
}

/**
 * Utility function to handle Result errors on the client side.
 * Logs the error, shows a toast notification, and returns null if error.
 *
 * @param result - The Result object to handle
 * @param options - Configuration options for error handling
 * @param options.title - Title for the error toast
 * @param options.description - Custom description for the toast (defaults to error.message)
 * @param options.onRetry - Optional retry action
 * @param options.showRetry - Whether to show the retry button (defaults to true if onRetry is provided)
 * @returns The value if Ok, null if Err
 */
export function handleClientResult<T, E extends { type: string; message: string; originalError?: unknown }>(
  result: Result<T, E>,
  options: {
    /** Title for the error toast */
    title: string;
    /** Custom description for the toast (defaults to error.message) */
    description?: string;
    /** Optional retry action */
    onRetry?: () => void;
    /** Whether to show the retry button (defaults to true if onRetry is provided) */
    showRetry?: boolean;
  },
): T | null {
  return result.match(
    value => value,
    (error) => {
      logError(error.type, error.message, error.originalError);

      toast.error(options.title, {
        description: options.description || error.message,
        action: (options.onRetry && (options.showRetry !== false))
          ? {
              label: "Try again",
              onClick: options.onRetry,
            }
          : undefined,
      });

      return null;
    },
  );
}

export function isLocalMessage(message: any): message is Message {
  return (
    typeof message === "object"
    && message !== null
    && "_id" in message
    && "_creationTime" in message
    && "userProvidedId" in message
    && "version" in message
  );
}
