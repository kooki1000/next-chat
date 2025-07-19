import type { Result } from "neverthrow";
import type { Doc } from "@/convex/_generated/dataModel";
import type { ConvexError } from "@/types";

import { fetchQuery } from "convex/nextjs";
import { err, ok } from "neverthrow";

import { api } from "@/convex/_generated/api";

import "server-only";

interface UserData {
  user: Doc<"users"> | null;
}

export async function getUserByExternalId(externalId: string): Promise<Result<UserData, ConvexError>> {
  try {
    const user = await fetchQuery(api.users.getUserByExternalId, { externalId });
    return ok({ user });
  }
  catch (error) {
    return err({
      type: "convex",
      message: "Failed to fetch user by external ID",
      originalError: error,
    });
  }
}
