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
