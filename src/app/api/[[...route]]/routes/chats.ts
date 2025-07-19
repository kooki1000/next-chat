import type { Doc } from "@/convex/_generated/dataModel";

import { openai } from "@ai-sdk/openai";
import { zValidator } from "@hono/zod-validator";
import { streamText } from "ai";
import { Hono } from "hono";
import { stream } from "hono/streaming";

import { handleServerResult } from "@/lib/logger";
import { createMessageSchema } from "@/lib/schemas";
import { checkAuthStatus } from "@/server/auth";
import { getUserByExternalId } from "@/server/users";

import "server-only";

export const chatsRouter = new Hono()
  .post(
    "/",
    zValidator("json", createMessageSchema),
    async (c) => {
      const { content } = c.req.valid("json");

      const { userId } = handleServerResult(await checkAuthStatus());
      let _user: Doc<"users"> | null = null;

      if (userId) {
        const userDetailsResult = await getUserByExternalId(userId);
        _user = handleServerResult(userDetailsResult).user;
      }

      try {
        const result = streamText({
          model: openai("gpt-3.5-turbo"),
          messages: [
            {
              role: "system",
              content: "You are a helpful assistant. Provide clear and concise responses to user questions.",
            },
            {
              role: "user",
              content,
            },
          ],
          temperature: 0.7,
          maxTokens: 2048,
        });

        return stream(c, async (stream) => {
          for await (const delta of result.textStream) {
            await stream.write(delta);
          }
        });
      }
      catch (error) {
        console.error("AI streaming error:", error);
        return c.json(
          {
            success: false,
            error: "Failed to generate AI response",
          },
          500,
        );
      }
    },
  );
