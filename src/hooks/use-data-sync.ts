import type { DataSyncContextType } from "@/providers/DataSyncProvider";

import { use } from "react";
import { DataSyncContext } from "@/providers/DataSyncProvider";

/**
 * A convenience hook to access the entire DataSyncContext.
 * This is useful for components that need to access both threads and messages sync status.
 */
export function useDataSync(): DataSyncContextType {
  const context = use(DataSyncContext);
  if (!context) {
    throw new Error("useDataSync must be used within a DataSyncProvider");
  }

  return context;
}
