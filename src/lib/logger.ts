import type { Result } from "neverthrow";

import { HTTPException } from "hono/http-exception";
import { logError } from "./utils";

import "server-only";

/**
 * Utility function to handle Result errors in a consistent way.
 * Logs the error and throws an HTTPException.
 *
 * @param result - The Result object to handle
 * @param statusCode - HTTP status code to use when throwing (default: 500)
 * @returns The value if the result is Ok
 * @throws HTTPException if the result is Err
 */
export function handleServerResult<T, E extends { type: string; message: string; originalError?: unknown }>(
  result: Result<T, E>,
  statusCode = 500,
): T {
  return result.match(
    value => value,
    (error) => {
      logError(error.type, error.message, error.originalError);
      throw new HTTPException(statusCode as any, { message: error.message });
    },
  );
}
