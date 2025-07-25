import type { Doc } from "@/convex/_generated/dataModel";

import { openai } from "@ai-sdk/openai";
import { zValidator } from "@hono/zod-validator";
import { coreMessageSchema, streamText } from "ai";
import { fetchMutation } from "convex/nextjs";
import { Hono } from "hono";
import { stream } from "hono/streaming";
import z from "zod";

import { api } from "@/convex/_generated/api";
import { handleServerResult } from "@/lib/logger";

import { checkAuthStatus } from "@/server/auth";
import { getThreadById } from "@/server/threads";
import { getUserByExternalId } from "@/server/users";

const createChatSchema = z.object({
  threadId: z.string(),
  messages: z.array(coreMessageSchema).nonempty("At least one message is required"),
});

export const chatsRouter = new Hono()
  .post(
    "/",
    zValidator("json", createChatSchema),
    async (c) => {
      const { threadId, messages } = c.req.valid("json");

      const { userId } = handleServerResult(await checkAuthStatus());
      let user: Doc<"users"> | null = null;

      if (userId) {
        const userDetailsResult = await getUserByExternalId(userId);
        user = handleServerResult(userDetailsResult).user;
      }

      const fetchThreadResult = await getThreadById({ userId: user?._id, threadId });
      const thread = handleServerResult(fetchThreadResult).thread;

      try {
        const result = streamText({
          model: openai("gpt-3.5-turbo"),
          messages,
          temperature: 0.7,
          onFinish: async (result) => {
            await fetchMutation(api.messages.createServerMessage, {
              content: result.text,
              userId: user?._id,
              threadId: thread._id,
              userProvidedThreadId: thread.userProvidedId,
              createdAt: new Date().toISOString(),
            });
          },
        });

        // Mark the response as a v1 data stream:
        c.header("X-Vercel-AI-Data-Stream", "v1");
        c.header("Content-Type", "text/plain; charset=utf-8");

        return stream(c, stream => stream.pipe(result.toDataStream()));
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
