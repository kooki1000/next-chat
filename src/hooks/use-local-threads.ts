import { useLiveQuery } from "dexie-react-hooks";
import { localDb } from "@/db";

/**
 * A hook that provides access to threads from the local IndexedDB.
 * Uses Dexie's reactive queries to automatically update when data changes.
 */
export function useLocalThreads(options?: {
  limit?: number;
}) {
  const { limit } = options || {};

  return useLiveQuery(async () => {
    let query = localDb.threads.toCollection();

    if (typeof limit === "number") {
      query = query.limit(limit);
    }

    // Sort by updatedAt in descending order (most recent first)
    const threads = await query.reverse().toArray();

    return threads;
  }, [limit]);
}
