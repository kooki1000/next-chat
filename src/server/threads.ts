import type { Result } from "neverthrow";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import type { ConvexError, ConvexServerError, SuccessResponse } from "@/types";

import { fetchMutation, fetchQuery } from "convex/nextjs";
import { ConvexError as ConvexErrorType } from "convex/values";
import { err, ok } from "neverthrow";

import { api } from "@/convex/_generated/api";

import "server-only";

interface ThreadData {
  thread: Doc<"threads">;
}

interface getThreadByIdParams {
  userId: Id<"users"> | undefined;
  threadId: string;
}

export async function getThreadById({ userId, threadId }: getThreadByIdParams): Promise<Result<ThreadData, ConvexError>> {
  try {
    const thread = await fetchQuery(api.threads.getThreadById, { userId, threadId });
    return ok({ thread });
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
      message: "Unexpected error occurred while fetching thread",
      originalError: error,
    });
  }
}

interface UpdateThreadTitleParams {
  userId?: Id<"users"> | undefined;
  title: string;
  userProvidedId: string;
}

export async function updateThreadTitle({
  userId,
  title,
  userProvidedId,
}: UpdateThreadTitleParams): Promise<Result<SuccessResponse, ConvexError>> {
  try {
    await fetchMutation(api.threads.updateThreadOnServer, {
      userId,
      title,
      userProvidedId,
    });

    return ok({
      success: true,
      message: "Thread title updated successfully",
      code: 201,
    });
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
