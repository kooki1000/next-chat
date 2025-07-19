import type { ReactMutation } from "convex/react";
import type { FunctionReference } from "convex/server";
import type { Result } from "neverthrow";
import type { ConvexError } from "@/types";

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

// TODO: Implement proper client-side error handling using ConvexError
// Reference: https://docs.convex.dev/functions/error-handling/application-errors
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
    return err({
      type: "convex",
      message: errorMessage,
      originalError: error,
    });
  }
}
