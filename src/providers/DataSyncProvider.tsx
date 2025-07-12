"use client";

import { createContext, useEffect, useMemo } from "react";

import { useMessagesSync } from "@/hooks/use-messages-sync";
import { useThreadsSync } from "@/hooks/use-threads-sync";

export interface DataSyncContextType {
  threads: {
    isInitialSyncComplete: boolean;
    isSyncing: boolean;
    downloadError: Error | null;
    isUploadingSyncThreads: boolean;
    uploadError: Error | null;
  };
  messages: {
    isInitialSyncComplete: boolean;
    isSyncing: boolean;
    downloadError: Error | null;
    isUploadingSyncMessages: boolean;
    uploadError: Error | null;
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
      downloadError: threadsSync.downloadError,
      isUploadingSyncThreads: threadsSync.isUploadingSyncThreads,
      uploadError: threadsSync.uploadError,
    },
    messages: {
      isInitialSyncComplete: messagesSync.isInitialSyncComplete,
      isSyncing: messagesSync.isSyncing,
      downloadError: messagesSync.downloadError,
      isUploadingSyncMessages: messagesSync.isUploadingSyncMessages,
      uploadError: messagesSync.uploadError,
    },
  }), [threadsSync, messagesSync]);

  // Handle error logging in useEffect to avoid side effects during render
  useEffect(() => {
    if (threadsSync.downloadError) {
      console.error("Failed to download threads from server:", threadsSync.downloadError);
    }
    if (threadsSync.uploadError) {
      console.error("Failed to upload threads to server:", threadsSync.uploadError);
    }
  }, [threadsSync.downloadError, threadsSync.uploadError]);

  useEffect(() => {
    if (messagesSync.downloadError) {
      console.error("Failed to download messages from server:", messagesSync.downloadError);
    }
    if (messagesSync.uploadError) {
      console.error("Failed to upload messages to server:", messagesSync.uploadError);
    }
  }, [messagesSync.downloadError, messagesSync.uploadError]);

  return (
    <DataSyncContext value={contextValue}>
      {children}
    </DataSyncContext>
  );
}
