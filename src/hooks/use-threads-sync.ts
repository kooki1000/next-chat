import { useNetworkState } from "@uidotdev/usehooks";
import { useMutation, useQuery } from "convex/react";
import { useEffect, useRef, useState } from "react";

import { api } from "@/convex/_generated/api";
import { localDb } from "@/db";

/**
 * A hook that syncs threads between Convex and the local IndexedDB.
 * On initial load, it fetches all threads and stores them locally.
 * When coming back online after being offline, it syncs local changes to Convex.
 */
export function useThreadsSync() {
  // State to track download sync status
  const [isInitialSyncComplete, setIsInitialSyncComplete] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [downloadError, setDownloadError] = useState<Error | null>(null);

  // State for uploading local threads to Convex
  const [isUploadingSyncThreads, setIsUploadingSyncThreads] = useState(false);
  const [uploadError, setUploadError] = useState<Error | null>(null);

  // Track previous online state to detect transitions
  const previousOnlineState = useRef<boolean>(true);
  const { online: isOnline } = useNetworkState();

  // Get threads and mutation from Convex (live updates)
  const convexThreads = useQuery(api.threads.getUserThreads);
  const syncLocalThreads = useMutation(api.threads.syncLocalThreads);

  // Initial sync effect - sync from Convex to local
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
        setDownloadError(err instanceof Error ? err : new Error("Unknown error during download"));
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

  // Handle network state changes - sync local to remote when coming back online
  useEffect(() => {
    const handleOnlineStateChange = async () => {
      // Only sync when transitioning from offline to online
      if (!previousOnlineState.current && isOnline && isInitialSyncComplete) {
        setIsUploadingSyncThreads(true);
        setUploadError(null);

        try {
          // Get all local threads that might need syncing
          const localThreads = await localDb.threads.toArray();

          // Prepare threads for sync
          // TODO: Add logic to handle `isPending`
          const threadsToSync = localThreads.map(thread => ({
            title: thread.title,
            userProvidedId: thread.userProvidedId,
            isPending: thread.isPending,
            createdAt: thread.createdAt,
            updatedAt: thread.updatedAt,
          }));

          if (threadsToSync.length > 0) {
            const results = await syncLocalThreads({ threads: threadsToSync });
            const errorCount = results.filter(r => r.status === "error").length;

            if (errorCount > 0) {
              const errorMessages = results
                .filter(r => r.status === "error")
                .map(r => `${r.userProvidedId}: ${r.error}`)
                .join(", ");

              console.warn("Some threads failed to sync:", errorMessages);
            }
          }
        }
        catch (err) {
          console.error("Failed to sync local threads to Convex:", err);
          setUploadError(err instanceof Error ? err : new Error("Unknown error during upload"));
        }
        finally {
          setIsUploadingSyncThreads(false);
        }
      }

      previousOnlineState.current = isOnline;
    };

    handleOnlineStateChange();
  }, [isOnline, isInitialSyncComplete, syncLocalThreads]);

  return {
    isInitialSyncComplete,
    isSyncing,
    downloadError,
    isUploadingSyncThreads,
    uploadError,
  };
}
