import type { UserJSON } from "@clerk/backend";
import type { Validator } from "convex/values";
import type { QueryCtx } from "./_generated/server";

import { v } from "convex/values";

import { internalMutation, query } from "./_generated/server";

export const upsertFromClerk = internalMutation({
  args: { data: v.any() as Validator<UserJSON> },
  handler: async (ctx, { data }) => {
    const userAttributes = {
      name: `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim(),
      email: data.email_addresses[0]?.email_address || "",
      externalId: data.id,
      imageUrl: data.image_url || "",
      lastActive: data.last_active_at ?? undefined,
    };

    const user = await userByExternalId(ctx, userAttributes.externalId);
    if (user !== null) {
      await ctx.db.patch(user._id, userAttributes);
    }
    else {
      await ctx.db.insert("users", userAttributes);
    }
  },
});

export const deleteFromClerk = internalMutation({
  args: { clerkUserId: v.string() },
  handler: async (ctx, { clerkUserId }) => {
    const user = await userByExternalId(ctx, clerkUserId);
    if (user !== null) {
      await ctx.db.delete(user._id);
    }
    else {
      console.error(`User with externalId ${clerkUserId} not found`);
    }
  },
});

export const getUserByExternalId = query({
  args: { externalId: v.string() },
  handler: async (ctx, { externalId }) => {
    return await userByExternalId(ctx, externalId);
  },
});

export async function getCurrentUser(ctx: QueryCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (identity === null) {
    return null;
  }

  return await userByExternalId(ctx, identity.subject);
}

export async function getCurrentUserOrThrow(ctx: QueryCtx) {
  const userRecord = await getCurrentUser(ctx);
  if (!userRecord)
    throw new Error("User not found");
  return userRecord;
}

async function userByExternalId(ctx: QueryCtx, externalId: string) {
  return await ctx.db
    .query("users")
    .withIndex("by_externalId", q => q.eq("externalId", externalId))
    .unique();
}
