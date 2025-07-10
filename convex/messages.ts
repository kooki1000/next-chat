import type { Id } from "./_generated/dataModel";
import type { QueryCtx } from "./_generated/server";

import { query } from "./_generated/server";
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

async function messagesByUserId(ctx: QueryCtx, userId: Id<"users">) {
  return await ctx.db
    .query("messages")
    .withIndex("by_userId", q => q.eq("userId", userId))
    .order("desc")
    .collect();
}
