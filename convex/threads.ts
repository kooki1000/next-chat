import type { WithoutSystemFields } from "convex/server";
import type { Doc, Id } from "./_generated/dataModel";
import type { MutationCtx, QueryCtx } from "./_generated/server";

import { zid } from "convex-helpers/server/zod";
import { z } from "zod";

import { query } from "./_generated/server";
import { getCurrentUser } from "./users";
import { zodMutation } from "./utils";

export const getUserThreads = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      return [];
    }

    return await getThreadsByUserId(ctx, user._id);
  },
});

export const createThread = zodMutation({
  args: {
    title: z.string(),
    userProvidedId: z.string().uuid(),
    createdAt: z.string().datetime(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    return await insertThread(ctx, {
      title: args.title,
      userId: user?._id ?? undefined,
      userProvidedId: args.userProvidedId,
      isPending: true,
      createdAt: args.createdAt,
      updatedAt: args.createdAt,
    });
  },
});

// TODO: Implement proper server-side error handling using ConvexError
// Reference: https://docs.convex.dev/functions/error-handling/application-errors
export const updateThreadOnServer = zodMutation({
  args: {
    title: z.string(),
    userId: zid("users").optional(),
    userProvidedId: z.string().uuid(),
  },
  handler: async (ctx, args) => {
    const thread = await getThreadByUserProvidedId(ctx, args.userProvidedId);
    if (!thread) {
      throw new Error(`Thread with userProvidedId ${args.userProvidedId} not found`);
    }

    return await ctx.db.patch(thread._id, {
      title: args.title,
      userId: args.userId ?? undefined,
      isPending: false,
      updatedAt: new Date().toISOString(),
    });
  },
});

// TODO: Add logic when `isPending` is true
export const syncLocalThreads = zodMutation({
  args: {
    threads: z.array(z.object({
      title: z.string(),
      userProvidedId: z.string().uuid(),
      isPending: z.boolean().optional(),
      createdAt: z.string().datetime(),
      updatedAt: z.string().datetime(),
    })),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    const results = [];

    for (const thread of args.threads) {
      try {
        // Check if thread already exists
        const existingThread = await getThreadByUserProvidedId(ctx, thread.userProvidedId);
        if (existingThread) {
          results.push({ userProvidedId: thread.userProvidedId, status: "exists", id: existingThread._id });
          continue;
        }

        const syncedThread = await insertThread(ctx, {
          title: thread.title,
          userId: user?._id ?? undefined,
          userProvidedId: thread.userProvidedId,
          isPending: thread.isPending ?? undefined,
          createdAt: thread.createdAt,
          updatedAt: thread.updatedAt,
        });

        results.push({ userProvidedId: thread.userProvidedId, status: "synced", id: syncedThread });
      }
      catch (error) {
        console.error(`Failed to sync thread ${thread.userProvidedId}:`, error);
        results.push({ userProvidedId: thread.userProvidedId, status: "error", error: String(error) });
      }
    }

    return results;
  },
});

async function getThreadsByUserId(ctx: QueryCtx, userId: Id<"users">) {
  return await ctx.db
    .query("threads")
    .withIndex("by_userId", q => q.eq("userId", userId))
    .order("desc")
    .collect();
}

export async function getThreadByUserProvidedId(ctx: QueryCtx, userProvidedId: string) {
  return await ctx.db
    .query("threads")
    .withIndex("by_userProvidedId", q => q.eq("userProvidedId", userProvidedId))
    .first();
}

async function insertThread(
  ctx: MutationCtx,
  thread: WithoutSystemFields<Doc<"threads">>,
) {
  return await ctx.db.insert("threads", thread);
}
