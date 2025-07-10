import { useLiveQuery } from "dexie-react-hooks";

import { localDb } from "@/db/dexie";

/**
 * A hook that provides access to messages from the local IndexedDB.
 * Uses Dexie's reactive queries to automatically update when data changes.
 */
export function useLocalMessages(options?: {
  threadId?: string;
  limit?: number;
}) {
  const { threadId, limit } = options || {};

  return useLiveQuery(async () => {
    let query = localDb.messages.toCollection();

    if (threadId) {
      // Filter messages where either threadId or userProvidedThreadId matches the provided ID
      query = query.filter(message =>
        message.threadId === threadId
        || message.userProvidedThreadId === threadId,
      );
    }

    // Sort by createdAt in ascending order (oldest first)
    const messages = await query.sortBy("createdAt");

    if (typeof limit === "number" && messages.length > limit) {
      return messages.slice(0, limit);
    }

    return messages;
  }, [threadId, limit]);
}
