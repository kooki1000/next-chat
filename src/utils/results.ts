import type { Result } from "neverthrow";

import { HTTPException } from "hono/http-exception";
import { toast } from "sonner";

import { logError } from "@/lib/utils";

/**
 * Utility function to handle Result errors in a consistent way.
 * Logs the error and throws an HTTPException.
 */
export function handleServerResult<T, E extends { type: string; message: string; code?: number; originalError?: unknown }>(
  result: Result<T, E>,
): T {
  return result.match(
    value => value,
    (error) => {
      logError(error.type, error.message, error.originalError);
      // @ts-expect-error: ConvexError is from Hono and has a different structure
      throw new HTTPException(error.code || 500, { message: error.message });
    },
  );
}

/**
 * Utility function to handle Result errors on the client side.
 * Logs the error, shows a toast notification, and returns null if error.
 */
export function handleClientResult<T, E extends { type: string; message: string; originalError?: unknown }>(
  result: Result<T, E>,
  options: {
    title: string;
    description?: string;
    onRetry?: () => void;
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
