import { useQuery } from "convex/react";
import { useEffect, useState } from "react";

import { api } from "@/convex/_generated/api";
import { localDb } from "@/db/dexie";

/**
 * A hook that syncs threads from Convex to the local IndexedDB.
 * On initial load, it fetches all threads and stores them locally.
 */
export function useThreadsSync() {
  const [isInitialSyncComplete, setIsInitialSyncComplete] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Get threads from Convex (live updates)
  const convexThreads = useQuery(api.threads.getUserThreads);

  // Initial sync effect
  useEffect(() => {
    const syncThreadsToIndexDB = async () => {
      if (convexThreads === undefined)
        return;
      if (isInitialSyncComplete)
        return;

      setIsSyncing(true);

      try {
        // Check if we need to do the initial sync
        const localThreadCount = await localDb.threads.count();

        if (localThreadCount === 0 || localThreadCount !== convexThreads.length) {
          await localDb.threads.clear();
          await localDb.threads.bulkAdd(convexThreads);
        }

        setIsInitialSyncComplete(true);
      }
      catch (err) {
        console.error("Failed to sync threads to IndexedDB:", err);
        setError(err instanceof Error ? err : new Error("Unknown error during sync"));
      }
      finally {
        setIsSyncing(false);
      }
    };

    syncThreadsToIndexDB();
  }, [convexThreads, isInitialSyncComplete]);

  // Live update effect - keep IndexedDB in sync with Convex
  useEffect(() => {
    if (!isInitialSyncComplete || !convexThreads)
      return;

    const updateLocalThreads = async () => {
      try {
        // Get current local threads
        const localThreads = await localDb.threads.toArray();
        const localThreadMap = new Map(localThreads.map(t => [t.userProvidedId, t]));

        // Find threads to add or update
        const threadsToUpsert = convexThreads.filter((thread) => {
          const localThread = localThreadMap.get(thread.userProvidedId);
          return !localThread || localThread.updatedAt !== thread.updatedAt;
        });

        // Find threads to delete (in local but not in convex)
        const convexThreadIds = new Set(convexThreads.map(t => t.userProvidedId));
        const threadsToDelete = localThreads
          .filter(thread => !convexThreadIds.has(thread.userProvidedId))
          .map(thread => thread.userProvidedId);

        // Perform updates if needed
        if (threadsToUpsert.length > 0) {
          await localDb.threads.bulkPut(threadsToUpsert);
        }

        if (threadsToDelete.length > 0) {
          await localDb.threads.bulkDelete(threadsToDelete);
        }
      }
      catch (err) {
        console.error("Failed to update threads in IndexedDB:", err);
      }
    };

    updateLocalThreads();
  }, [convexThreads, isInitialSyncComplete]);

  return {
    isInitialSyncComplete,
    isSyncing,
    error,
    convexThreads,
  };
}
