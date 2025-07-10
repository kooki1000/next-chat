import { useLiveQuery } from "dexie-react-hooks";

import { localDb } from "@/db/dexie";

/**
 * A hook that provides access to messages from the local IndexedDB.
 * Uses Dexie's reactive queries to automatically update when data changes.
 */
export function useLocalMessages(options?: {
  threadId?: string;
  userProvidedThreadId?: string;
  limit?: number;
}) {
  const { threadId, userProvidedThreadId, limit } = options || {};

  return useLiveQuery(async () => {
    let query = localDb.messages.toCollection();

    if (threadId) {
      query = query.filter(message => message.threadId === threadId);
    }

    if (userProvidedThreadId) {
      query = query.filter(message => message.userProvidedThreadId === userProvidedThreadId);
    }

    // Sort by createdAt in ascending order (oldest first)
    const messages = await query.sortBy("createdAt");

    if (typeof limit === "number" && messages.length > limit) {
      return messages.slice(0, limit);
    }

    return messages;
  }, [threadId, userProvidedThreadId, limit]);
}
