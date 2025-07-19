import type { Result } from "neverthrow";
import type { Id } from "@/convex/_generated/dataModel";
import type { ConvexError, ConvexServerError } from "@/types";

import { fetchMutation } from "convex/nextjs";
import { ConvexError as ConvexErrorType } from "convex/values";
import { err, ok } from "neverthrow";

import { api } from "@/convex/_generated/api";

import "server-only";

interface UpdateThreadTitleParams {
  userId?: Id<"users">;
  title: string;
  userProvidedId: string;
}

interface UpdateThreadTitleResponse {
  success: true;
  code: number;
}

export async function updateThreadTitle({
  userId,
  title,
  userProvidedId,
}: UpdateThreadTitleParams): Promise<Result<UpdateThreadTitleResponse, ConvexError>> {
  try {
    await fetchMutation(api.threads.updateThreadOnServer, {
      userId,
      title,
      userProvidedId,
    });

    return ok({ success: true, code: 201 });
  }
  catch (error) {
    if (error instanceof ConvexErrorType) {
      return err({
        type: "convex",
        message: (error.data as ConvexServerError).message,
        code: (error.data as ConvexServerError).code,
        originalError: error,
      });
    }

    return err({
      type: "convex",
      message: "Unexpected error occurred while updating thread title",
      originalError: error,
    });
  }
};
