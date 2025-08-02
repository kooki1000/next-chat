import type { Result } from "neverthrow";
import type { Id } from "@/convex/_generated/dataModel";
import type { IndexedDBError } from "@/types";

import { err, ok } from "neverthrow";

import { localDb } from "@/db";
import { DEFAULT_THREAD_TITLE } from "@/lib/constants";

import "client-only";

interface MutationSuccess {
  success: true;
}

interface LocalThreadParams {
  title?: string;
  threadId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export async function createLocalThread({
  title = DEFAULT_THREAD_TITLE,
  threadId,
  createdAt = new Date(),
  updatedAt = new Date(),
}: LocalThreadParams): Promise<Result<MutationSuccess, IndexedDBError>> {
  try {
    await localDb.threads.add({
      _id: crypto.randomUUID() as Id<"threads">,
      _creationTime: createdAt.getTime(),
      title,
      userId: undefined,
      userProvidedId: threadId,
      isPending: true,
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
    });

    return ok({ success: true });
  }
  catch (error) {
    return err({
      type: "indexeddb",
      message: "Failed to create local thread",
      originalError: error,
    });
  }
}

interface LocalMessageParams {
  content: string;
  threadId: string;
  version?: number;
  createdAt?: Date;
}

export async function createLocalMessage({
  content,
  threadId,
  version = 1,
  createdAt = new Date(),
}: LocalMessageParams): Promise<Result<MutationSuccess, IndexedDBError>> {
  try {
    await localDb.messages.add({
      _id: crypto.randomUUID() as Id<"messages">,
      _creationTime: createdAt.getTime(),
      role: "user",
      parts: [{ type: "text", text: content }],
      userId: undefined,
      userProvidedId: crypto.randomUUID() as Id<"messages">,
      threadId: threadId as Id<"threads">,
      userProvidedThreadId: threadId,
      version,
      createdAt: createdAt.toISOString(),
    });

    return ok({ success: true });
  }
  catch (error) {
    return err({
      type: "indexeddb",
      message: "Failed to create local message",
      originalError: error,
    });
  }
};
