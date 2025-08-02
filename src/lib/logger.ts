import type { Result } from "neverthrow";

import { HTTPException } from "hono/http-exception";
import { logError } from "./utils";

import "server-only";

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
