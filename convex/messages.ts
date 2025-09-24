import type { WithoutSystemFields } from "convex/server";
import type { Doc, Id } from "./_generated/dataModel";
import type { MutationCtx, QueryCtx } from "./_generated/server";

import { zid } from "convex-helpers/server/zod";
import z from "zod";

import { query } from "./_generated/server";
import { getThreadByUserProvidedId } from "./threads";
import { getCurrentUser } from "./users";
import { partsSchema, zodMutation } from "./utils";

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

export const createClientMessage = zodMutation({
  args: {
    parts: partsSchema,
    userProvidedId: z.string().uuid(),
    userProvidedThreadId: z.string().uuid(),
    version: z.number().optional(),
    createdAt: z.string().datetime(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);

    const thread = await getThreadByUserProvidedId(ctx, args.userProvidedThreadId);
    if (!thread || thread.userProvidedId !== args.userProvidedThreadId) {
      throw new Error("Thread not found");
    }

    if (user !== null && thread.userId !== user._id) {
      throw new Error("Not authorized to create message in this thread");
    }

    return await insertMessage(ctx, {
      role: "user",
      parts: args.parts,
      userId: user?._id,
      userProvidedId: args.userProvidedId,
      threadId: thread._id,
      userProvidedThreadId: thread.userProvidedId,
      version: args.version ?? 1,
      createdAt: args.createdAt,
    });
  },
});

export const createServerMessage = zodMutation({
  args: {
    parts: partsSchema,
    userId: zid("users").optional(),
    threadId: zid("threads"),
    userProvidedThreadId: z.string().uuid(),
    createdAt: z.string().datetime(),
  },
  handler: async (ctx, args) => {
    return insertMessage(ctx, {
      role: "assistant",
      parts: args.parts,
      userId: args.userId,
      userProvidedId: crypto.randomUUID(),
      threadId: args.threadId,
      userProvidedThreadId: args.userProvidedThreadId,
      version: 1,
      createdAt: args.createdAt,
    });
  },
});

export const syncLocalMessages = zodMutation({
  args: {
    messages: z.array(z.object({
      role: z.enum(["user", "assistant", "system", "tool"]),
      parts: partsSchema,
      userProvidedId: z.string().uuid(),
      userProvidedThreadId: z.string().uuid(),
      version: z.number().optional(),
      createdAt: z.string().datetime(),
    })),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    const results = [];

    for (const message of args.messages) {
      try {
        const thread = await getThreadByUserProvidedId(ctx, message.userProvidedThreadId);
        if (!thread || thread.userProvidedId !== message.userProvidedThreadId) {
          console.warn(`Thread not found for message ${message.userProvidedId}`);
          continue;
        }

        if (user && thread.userId !== user._id) {
          console.warn(`Not authorized to sync message ${message.userProvidedId} to thread ${message.userProvidedThreadId}`);
          continue;
        }

        // Check if message already exists
        const existingMessage = await ctx.db
          .query("messages")
          .filter(q => q.eq(q.field("userProvidedId"), message.userProvidedId))
          .first();

        if (existingMessage) {
          results.push({ userProvidedId: message.userProvidedId, status: "exists", id: existingMessage._id });
          continue;
        }

        const syncedMessage = await insertMessage(ctx, {
          role: message.role,
          parts: message.parts,
          userId: user?._id,
          userProvidedId: message.userProvidedId,
          threadId: thread._id,
          userProvidedThreadId: thread.userProvidedId,
          version: message.version ?? 1,
          createdAt: message.createdAt,
        });

        results.push({ userProvidedId: message.userProvidedId, status: "synced", id: syncedMessage });
      }
      catch (error) {
        console.error(`Failed to sync message ${message.userProvidedId}:`, error);
        results.push({ userProvidedId: message.userProvidedId, status: "error", error: String(error) });
      }
    }

    return results;
  },
});

async function messagesByUserId(ctx: QueryCtx, userId: Id<"users">) {
  return await ctx.db
    .query("messages")
    .withIndex("by_userId", q => q.eq("userId", userId))
    .order("desc")
    .collect();
}

export const updateServerMessage = zodMutation({
  args: {
    messageId: zid("messages"),
    parts: partsSchema,
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.messageId, {
      parts: args.parts,
    });
    return args.messageId;
  },
});

async function insertMessage(
  ctx: MutationCtx,
  message: WithoutSystemFields<Doc<"messages">>,
) {
  return await ctx.db.insert("messages", message);
};
