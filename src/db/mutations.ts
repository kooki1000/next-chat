import type { Id } from "@/convex/_generated/dataModel";

import { localDb } from "@/db/dexie";
import { DEFAULT_THREAD_TITLE } from "@/lib/constants";

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
}: LocalThreadParams) {
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
}: LocalMessageParams) {
  await localDb.messages.add({
    _id: crypto.randomUUID() as Id<"messages">,
    _creationTime: createdAt.getTime(),
    role: "user",
    content,
    userId: undefined,
    userProvidedId: crypto.randomUUID() as Id<"messages">,
    threadId: threadId as Id<"threads">,
    userProvidedThreadId: threadId,
    version,
    createdAt: createdAt.toISOString(),
  });
};
