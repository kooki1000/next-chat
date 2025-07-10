import { useQuery } from "convex/react";
import { useEffect, useState } from "react";

import { api } from "@/convex/_generated/api";
import { localDb } from "@/db/dexie";

/**
 * A hook that syncs messages from Convex to the local IndexedDB.
 * On initial load, it fetches all messages and stores them locally.
 */
export function useMessagesSync() {
  const [isInitialSyncComplete, setIsInitialSyncComplete] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Get messages from Convex (live updates)
  const convexMessages = useQuery(api.messages.getUserMessages);

  // Initial sync effect
  useEffect(() => {
    const syncMessagesToIndexDB = async () => {
      if (convexMessages === undefined)
        return;
      if (isInitialSyncComplete)
        return;

      setIsSyncing(true);

      try {
        // Check if we need to do the initial sync
        const localMessageCount = await localDb.messages.count();

        if (localMessageCount === 0 || localMessageCount !== convexMessages.length) {
          await localDb.messages.clear();
          await localDb.messages.bulkAdd(convexMessages);
        }

        setIsInitialSyncComplete(true);
      }
      catch (err) {
        console.error("Failed to sync messages to IndexedDB:", err);
        setError(err instanceof Error ? err : new Error("Unknown error during sync"));
      }
      finally {
        setIsSyncing(false);
      }
    };

    syncMessagesToIndexDB();
  }, [convexMessages, isInitialSyncComplete]);

  // Live update effect - keep IndexedDB in sync with Convex
  useEffect(() => {
    if (!isInitialSyncComplete || !convexMessages)
      return;

    const updateLocalMessages = async () => {
      try {
        // Get current local messages
        const localMessages = await localDb.messages.toArray();
        const localMessageMap = new Map(localMessages.map(m => [m.userProvidedId, m]));

        // Find messages to add or update
        const messagesToUpsert = convexMessages.filter((message) => {
          const localMessage = localMessageMap.get(message.userProvidedId);
          return !localMessage || localMessage._creationTime !== message._creationTime;
        });

        // Find messages to delete (in local but not in convex)
        const convexMessageIds = new Set(convexMessages.map(m => m.userProvidedId));
        const messagesToDelete = localMessages
          .filter(message => !convexMessageIds.has(message.userProvidedId))
          .map(message => message.userProvidedId);

        // Perform updates if needed
        if (messagesToUpsert.length > 0) {
          await localDb.messages.bulkPut(messagesToUpsert);
        }

        if (messagesToDelete.length > 0) {
          await localDb.messages.bulkDelete(messagesToDelete);
        }
      }
      catch (err) {
        console.error("Failed to update messages in IndexedDB:", err);
      }
    };

    updateLocalMessages();
  }, [convexMessages, isInitialSyncComplete]);

  return {
    isInitialSyncComplete,
    isSyncing,
    error,
    convexMessages,
  };
}
