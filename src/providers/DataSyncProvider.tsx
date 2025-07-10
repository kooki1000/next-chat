"use client";

import { useMessagesSync } from "@/hooks/use-messages-sync";
import { useThreadsSync } from "@/hooks/use-threads-sync";

export function DataSyncProvider({ children }: { children: React.ReactNode }) {
  const { error: threadsError } = useThreadsSync();
  const { error: messagesError } = useMessagesSync();

  if (threadsError)
    console.error("Failed to sync threads:", threadsError);

  if (messagesError)
    console.error("Failed to sync messages:", messagesError);

  return (
    <>{children}</>
  );
}
