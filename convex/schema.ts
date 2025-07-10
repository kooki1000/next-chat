import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    externalId: v.string(),
    imageUrl: v.optional(v.string()),
    isBanned: v.boolean(),
    isLocked: v.boolean(),
    lastActive: v.optional(v.number()),
    lastSignIn: v.optional(v.number()),
  }).index("by_externalId", ["externalId"]),
});
