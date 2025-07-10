import type { Id } from "./_generated/dataModel";
import type { QueryCtx } from "./_generated/server";

import { query } from "./_generated/server";
import { getCurrentUser } from "./users";

export const getUserThreads = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      return [];
    }

    return await threadsByUserId(ctx, user._id);
  },
});

async function threadsByUserId(ctx: QueryCtx, userId: Id<"users">) {
  return await ctx.db
    .query("threads")
    .withIndex("by_userId", q => q.eq("userId", userId))
    .collect();
}
