import type { WithoutSystemFields } from "convex/server";
import type { Doc, Id } from "./_generated/dataModel";
import type { MutationCtx, QueryCtx } from "./_generated/server";

import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { getThreadByUserProvidedId } from "./threads";
import { getCurrentUser } from "./users";

export const getUserMessages = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      return [];
    }

    return await messagesByUserId(ctx, user._id);
  },
});

export const createInitialMessage = mutation({
  args: {
    content: v.string(),
    userProvidedId: v.string(),
    userProvidedThreadId: v.string(),
    createdAt: v.string(),
  },
  handler: async (ctx, args) => {
    const [user, thread] = await Promise.all([
      getCurrentUser(ctx),
      getThreadByUserProvidedId(ctx, args.userProvidedThreadId),
    ]);

    if (!thread || thread.userProvidedId !== args.userProvidedThreadId) {
      throw new Error("Thread not found");
    }

    if (user !== null && thread.userId !== user._id) {
      throw new Error("Not authorized to create message in this thread");
    }

    return await insertMessage(ctx, {
      role: "user",
      content: args.content,
      userId: user?._id ?? undefined,
      userProvidedId: args.userProvidedId,
      threadId: thread._id,
      userProvidedThreadId: thread.userProvidedId,
      version: 1,
      createdAt: args.createdAt,
    });
  },
});

async function messagesByUserId(ctx: QueryCtx, userId: Id<"users">) {
  return await ctx.db
    .query("messages")
    .withIndex("by_userId", q => q.eq("userId", userId))
    .order("desc")
    .collect();
}

async function insertMessage(
  ctx: MutationCtx,
  message: WithoutSystemFields<Doc<"messages">>,
) {
  return await ctx.db.insert("messages", message);
};
