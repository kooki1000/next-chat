import type { ReactMutation } from "convex/react";
import type { FunctionReference } from "convex/server";
import type { Result } from "neverthrow";
import type { ConvexError, ConvexServerError } from "@/types";

import { ConvexError as ConvexErrorTypes } from "convex/values";
import { err, ok } from "neverthrow";

import "client-only";

interface MutationSuccess {
  success: true;
}

interface ConvexMutationParams<TMutation extends ReactMutation<FunctionReference<"mutation">>> {
  mutation: TMutation;
  errorMessage?: string;
  args: TMutation extends ReactMutation<FunctionReference<"mutation", any, infer TArgs>> ? TArgs : never;
}

export async function convexMutation<TMutation extends ReactMutation<FunctionReference<"mutation">>>({
  mutation,
  errorMessage = "An error occurred",
  args,
}: ConvexMutationParams<TMutation>): Promise<Result<MutationSuccess, ConvexError>> {
  try {
    await mutation(args);
    return ok({ success: true });
  }
  catch (error) {
    if (error instanceof ConvexErrorTypes) {
      return err({
        type: "convex",
        message: (error.data as ConvexServerError).message,
        status: (error.data as ConvexServerError).code,
        originalError: error,
      });
    }

    return err({
      type: "convex",
      message: errorMessage,
      originalError: error,
    });
  }
}
