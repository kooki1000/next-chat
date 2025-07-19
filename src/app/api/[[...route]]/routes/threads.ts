import type { Doc } from "@/convex/_generated/dataModel";
import type { SuccessResponse } from "@/types";

import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";

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

      const getUserResult = await checkAuthStatus();
      if (getUserResult.isErr()) {
        const error = getUserResult.error;
        console.error(`${error.type} error: ${error.message}`, error.originalError);
        throw new HTTPException(500, { message: error.message });
      }

      const { userId } = getUserResult.value;
      let user: Doc<"users"> | null = null;

      if (userId) {
        const userDetailsResult = await getUserByExternalId(userId);

        if (userDetailsResult.isErr()) {
          const error = userDetailsResult.error;
          console.error(`${error.type} error: ${error.message}`, error.originalError);
          throw new HTTPException(500, { message: error.message });
        }

        user = userDetailsResult.value.user;
      }

      const titleResult = await generateThreadTitle(prompt);
      if (titleResult.isErr()) {
        const error = titleResult.error;
        console.error(`${error.type} Error: ${error.message}`, error.originalError);
        throw new HTTPException(500, { message: error.message });
      }

      const title = titleResult.value.title;

      const updateResult = await updateThreadTitle({
        userId: user?._id ?? undefined,
        title,
        userProvidedId: userProvidedThreadId,
      });

      if (updateResult.isErr()) {
        const error = updateResult.error;
        console.error(`${error.type} Error: ${error.message}`, error.originalError);
        throw new HTTPException(500, { message: error.message });
      }

      return c.json<SuccessResponse>({
        success: true,
        message: "Thread created successfully",
      }, 201);
    },
  );
