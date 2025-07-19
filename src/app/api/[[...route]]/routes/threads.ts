import type { Doc } from "@/convex/_generated/dataModel";
import type { SuccessResponse } from "@/types";

import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

import { handleServerResult } from "@/lib/logger";
import { createThreadSchema } from "@/lib/schemas";
import { generateThreadTitle } from "@/server/ai";
import { checkAuthStatus } from "@/server/auth";
import { updateThreadTitle } from "@/server/threads";
import { getUserByExternalId } from "@/server/users";

export const threadsRouter = new Hono()
  .post(
    "/create",
    zValidator("json", createThreadSchema),
    async (c) => {
      const { prompt, userProvidedThreadId } = c.req.valid("json");

      const { userId } = handleServerResult(await checkAuthStatus());
      let user: Doc<"users"> | null = null;

      if (userId) {
        const userDetailsResult = await getUserByExternalId(userId);
        user = handleServerResult(userDetailsResult).user;
      }

      const titleResult = await generateThreadTitle(prompt);
      const title = handleServerResult(titleResult).title;

      const updateResult = await updateThreadTitle({
        userId: user?._id,
        title,
        userProvidedId: userProvidedThreadId,
      });

      handleServerResult(updateResult);

      return c.json<SuccessResponse>({
        success: true,
        message: "Thread created successfully",
      }, 201);
    },
  );
