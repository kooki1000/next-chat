import type { WithoutSystemFields } from "convex/server";
import type { Doc, Id } from "./_generated/dataModel";
import type { MutationCtx, QueryCtx } from "./_generated/server";

import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

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

export const createThread = mutation({
  args: {
    title: v.string(),
    userProvidedId: v.string(),
    createdAt: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    return await insertThread(ctx, {
      title: args.title,
      userId: user?._id,
      userProvidedId: args.userProvidedId,
      createdAt: args.createdAt,
      updatedAt: args.createdAt,
    });
  },
});

export const syncLocalThreads = mutation({
  args: {
    threads: v.array(v.object({
      title: v.string(),
      userProvidedId: v.string(),
      createdAt: v.string(),
      updatedAt: v.string(),
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
