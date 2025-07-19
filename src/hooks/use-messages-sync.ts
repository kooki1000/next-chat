import { useNetworkState } from "@uidotdev/usehooks";
import { useMutation, useQuery } from "convex/react";
import { useEffect, useRef, useState } from "react";

import { api } from "@/convex/_generated/api";
import { localDb } from "@/db";

/**
 * A hook that syncs messages between Convex and the local IndexedDB.
 * On initial load, it fetches all messages and stores them locally.
 * When coming back online after being offline, it syncs local changes to Convex.
 */
export function useMessagesSync() {
  // State to track download sync status
  const [isInitialSyncComplete, setIsInitialSyncComplete] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [downloadError, setDownloadError] = useState<Error | null>(null);

  // State for uploading local messages to Convex
  const [isUploadingSyncMessages, setIsUploadingSyncMessages] = useState(false);
  const [uploadError, setUploadError] = useState<Error | null>(null);

  // Track previous online state to detect transitions
  const previousOnlineState = useRef<boolean>(true);
  const { online: isOnline } = useNetworkState();

  // Get messages and mutation from Convex (live updates)
  const convexMessages = useQuery(api.messages.getUserMessages);
  const syncLocalMessages = useMutation(api.messages.syncLocalMessages);

  // Initial sync effect - sync from Convex to local
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
        setDownloadError(err instanceof Error ? err : new Error("Unknown error during download"));
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

  // Handle network state changes - sync local to remote when coming back online
  useEffect(() => {
    const handleOnlineStateChange = async () => {
      // Only sync when transitioning from offline to online
      if (!previousOnlineState.current && isOnline && isInitialSyncComplete) {
        setIsUploadingSyncMessages(true);
        setUploadError(null);

        try {
          // Get all local messages that might need syncing
          const localMessages = await localDb.messages.toArray();

          // Filter messages that might not exist on the server yet and ensure correct types
          const messagesToSync = localMessages
            .filter(message =>
              message.userProvidedThreadId && (message.role === "user"),
            )
            .map(message => ({
              content: message.content,
              userProvidedId: message.userProvidedId,
              userProvidedThreadId: message.userProvidedThreadId as string,
              role: message.role as "user",
              createdAt: message.createdAt,
              version: message.version,
            }));

          if (messagesToSync.length > 0) {
            const results = await syncLocalMessages({ messages: messagesToSync });
            const errorCount = results.filter(r => r.status === "error").length;

            if (errorCount > 0) {
              const errorMessages = results
                .filter(r => r.status === "error")
                .map(r => `${r.userProvidedId}: ${r.error}`)
                .join(", ");

              console.warn("Some messages failed to sync:", errorMessages);
            }
          }
        }
        catch (err) {
          console.error("Failed to sync local messages to Convex:", err);
          setUploadError(err instanceof Error ? err : new Error("Unknown error during upload"));
        }
        finally {
          setIsUploadingSyncMessages(false);
        }
      }

      previousOnlineState.current = isOnline;
    };

    handleOnlineStateChange();
  }, [isOnline, isInitialSyncComplete, syncLocalMessages]);

  return {
    isInitialSyncComplete,
    isSyncing,
    downloadError,
    isUploadingSyncMessages,
    uploadError,
  };
}
