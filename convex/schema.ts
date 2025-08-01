import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    externalId: v.string(),
    imageUrl: v.optional(v.string()),
    lastActive: v.optional(v.number()),
  }).index("by_externalId", ["externalId"]),

  threads: defineTable({
    title: v.string(),
    userId: v.optional(v.id("users")),
    userProvidedId: v.string(),
    isPending: v.optional(v.boolean()),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index("by_userId", ["userId"])
    .index("by_userProvidedId", ["userProvidedId"]),

  messages: defineTable({
    role: v.union(
      v.literal("user"),
      v.literal("assistant"),
      v.literal("system"),
      v.literal("tool"),
    ),
    parts: v.array(
      v.object({
        type: v.union(
          v.literal("text"),
          v.literal("reasoning"),
        ),
        text: v.string(),
      }),
    ),
    userId: v.optional(v.id("users")),
    userProvidedId: v.string(),
    threadId: v.id("threads"),
    userProvidedThreadId: v.optional(v.string()),
    version: v.number(),
    createdAt: v.string(),
  })
    .index("by_userId", ["userId"])
    .index("by_threadId", ["threadId"])
    .index("by_userProvidedThreadId", ["userProvidedThreadId"]),
});
