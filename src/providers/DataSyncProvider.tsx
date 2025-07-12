"use client";

import { createContext, useEffect, useMemo } from "react";

import { useMessagesSync } from "@/hooks/use-messages-sync";
import { useThreadsSync } from "@/hooks/use-threads-sync";

export interface DataSyncContextType {
  threads: {
    isInitialSyncComplete: boolean;
    isSyncing: boolean;
    error: Error | null;
    isUploadingSyncThreads: boolean;
    syncError: Error | null;
  };
  messages: {
    isInitialSyncComplete: boolean;
    isSyncing: boolean;
    error: Error | null;
    isUploadingSyncMessages: boolean;
    syncError: Error | null;
  };
}

// eslint-disable-next-line react-refresh/only-export-components
export const DataSyncContext = createContext<DataSyncContextType | null>(null);

export function DataSyncProvider({ children }: { children: React.ReactNode }) {
  const threadsSync = useThreadsSync();
  const messagesSync = useMessagesSync();

  const contextValue: DataSyncContextType = useMemo(() => ({
    threads: {
      isInitialSyncComplete: threadsSync.isInitialSyncComplete,
      isSyncing: threadsSync.isSyncing,
      error: threadsSync.error,
      isUploadingSyncThreads: threadsSync.isUploadingSyncThreads,
      syncError: threadsSync.syncError,
    },
    messages: {
      isInitialSyncComplete: messagesSync.isInitialSyncComplete,
      isSyncing: messagesSync.isSyncing,
      error: messagesSync.error,
      isUploadingSyncMessages: messagesSync.isUploadingSyncMessages,
      syncError: messagesSync.syncError,
    },
  }), [threadsSync, messagesSync]);

  // Handle error logging in useEffect to avoid side effects during render
  useEffect(() => {
    if (threadsSync.error) {
      console.error("Failed to sync threads:", threadsSync.error);
    }
    if (threadsSync.syncError) {
      console.error("Failed to upload threads:", threadsSync.syncError);
    }
  }, [threadsSync.error, threadsSync.syncError]);

  useEffect(() => {
    if (messagesSync.error) {
      console.error("Failed to sync messages:", messagesSync.error);
    }
    if (messagesSync.syncError) {
      console.error("Failed to upload messages:", messagesSync.syncError);
    }
  }, [messagesSync.error, messagesSync.syncError]);

  return (
    <DataSyncContext value={contextValue}>
      {children}
    </DataSyncContext>
  );
}
