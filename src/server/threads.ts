import type { Result } from "neverthrow";
import type { Id } from "@/convex/_generated/dataModel";
import type { ConvexError } from "@/types";

import { fetchMutation } from "convex/nextjs";
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

    return ok({ success: true });
  }
  catch (error) {
    return err({
      type: "convex",
      message: "Failed to update thread title",
      originalError: error,
    });
  }
};
