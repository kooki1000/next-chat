import type { Result } from "neverthrow";
import type { Doc } from "@/convex/_generated/dataModel";

import type { DatabaseError } from "@/lib/errors";
import { fetchQuery } from "convex/nextjs";
import { err, ok } from "neverthrow";
import { api } from "@/convex/_generated/api";

interface UserData {
  user: Doc<"users"> | null;
}

export async function getUserByExternalId(externalId: string): Promise<Result<UserData, DatabaseError>> {
  try {
    const user = await fetchQuery(api.users.getUserByExternalId, { externalId });
    return ok({ user });
  }
  catch (error) {
    return err({
      type: "database",
      message: "Failed to fetch user by external ID",
      originalError: error,
    });
  }
}
