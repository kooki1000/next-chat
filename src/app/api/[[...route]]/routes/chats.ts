import type { Doc } from "@/convex/_generated/dataModel";

import { openai } from "@ai-sdk/openai";
import { zValidator } from "@hono/zod-validator";
import { modelMessageSchema, streamText } from "ai";
import { fetchMutation } from "convex/nextjs";
import { Hono } from "hono";
import * as z from "zod/v4";

import { api } from "@/convex/_generated/api";
import { handleServerResult } from "@/lib/logger";

import { checkAuthStatus } from "@/server/auth";
import { getThreadById } from "@/server/threads";
import { getUserByExternalId } from "@/server/users";

const createChatSchema = z.object({
  threadId: z.string(),
  messages: z.array(modelMessageSchema).nonempty("At least one message is required"),
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

      const result = streamText({
        model: openai("gpt-3.5-turbo"),
        messages,
        temperature: 0.7,
        onFinish: async (result) => {
          try {
            await fetchMutation(api.messages.createServerMessage, {
              parts: result.content
                .filter(
                  (part): part is { text: string; type: "text" | "reasoning" } =>
                    (part.type === "text" || part.type === "reasoning") && typeof (part as any).text === "string",
                )
                .map(part => ({
                  text: (part as any).text,
                  type: part.type,
                })),
              userId: user?._id,
              threadId: thread._id,
              userProvidedThreadId: thread.userProvidedId,
              createdAt: new Date().toISOString(),
            });
          }
          catch (error) {
            console.error("Failed to save AI response:", error);
          }
        },
      });

      return result.toUIMessageStreamResponse();
    },
  );
