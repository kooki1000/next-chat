import type { Doc } from "@/convex/_generated/dataModel";

import { openai } from "@ai-sdk/openai";
import { zValidator } from "@hono/zod-validator";
import { modelMessageSchema, streamText } from "ai";
import { fetchMutation } from "convex/nextjs";
import { Hono } from "hono";
import * as z from "zod/v4";

import { api } from "@/convex/_generated/api";
import { checkAuthStatus } from "@/server/auth";
import { getThreadById } from "@/server/threads";
import { getUserByExternalId } from "@/server/users";
import { handleServerResult } from "@/utils/results";
import { isValidMessagePart } from "@/utils/validation";

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

      // Create initial empty message for periodic updates
      const initialMessageId = await fetchMutation(api.messages.createServerMessage, {
        parts: [{ type: "text", text: "" }],
        userId: user?._id,
        threadId: thread._id,
        userProvidedThreadId: thread.userProvidedId,
        createdAt: new Date().toISOString(),
      });

      // Track accumulated content and periodic save
      let accumulatedContent = "";
      let lastSaveTime = Date.now();
      const SAVE_INTERVAL_MS = 10000; // 10 seconds

      const result = streamText({
        model: openai("gpt-3.5-turbo"),
        messages,
        temperature: 0.7,
        onChunk: async ({ chunk }) => {
          if (chunk.type === "text-delta") {
            // Use the 'text' property which contains the delta content
            accumulatedContent += chunk.text;

            // Check if it's time for a periodic save
            const currentTime = Date.now();
            if (currentTime - lastSaveTime >= SAVE_INTERVAL_MS) {
              try {
                await fetchMutation(api.messages.updateServerMessage, {
                  messageId: initialMessageId,
                  parts: [{ type: "text", text: accumulatedContent }],
                });
                lastSaveTime = currentTime;
              }
              catch (error) {
                console.error("Failed to save partial AI response:", error);
              }
            }
          }
        },
        onFinish: async (result) => {
          try {
            // Final update with complete content
            await fetchMutation(api.messages.updateServerMessage, {
              messageId: initialMessageId,
              parts: result.content
                .filter(isValidMessagePart)
                .map(part => ({
                  text: part.text,
                  type: part.type,
                })),
            });
          }
          catch (error) {
            console.error("Failed to save final AI response:", error);
          }
        },
      });

      return result.toUIMessageStreamResponse();
    },
  );
