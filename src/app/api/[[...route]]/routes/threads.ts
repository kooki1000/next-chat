import type { Doc } from "@/convex/_generated/dataModel";

import { openai } from "@ai-sdk/openai";
import { auth } from "@clerk/nextjs/server";
import { zValidator } from "@hono/zod-validator";
import { generateText } from "ai";
import { fetchMutation, fetchQuery } from "convex/nextjs";
import { Hono } from "hono";

import { api } from "@/convex/_generated/api";
import { createThreadSchema } from "@/lib/schemas";

export const threadsRouter = new Hono()
  .post(
    "/create",
    zValidator("json", createThreadSchema),
    async (c) => {
      const { prompt, userProvidedThreadId } = c.req.valid("json");

      let user: Doc<"users"> | null = null;

      const { userId } = await auth();
      if (userId) {
        user = await fetchQuery(api.users.getUserByExternalId, {
          externalId: userId,
        });
      }

      const { text: title } = await generateText({
        model: openai("gpt-3.5-turbo"),
        temperature: 0.3,
        prompt: `
          Summarize the following text into a concise title of 7 to 10 words. Ensure the title captures the main idea effectively and is suitable for use as a thread title. 
          Examples:
            Input: 'A detailed guide on how to bake a cake.' Output: 'Guide to Baking a Cake'
            Input: 'Exploring the wonders of the Amazon rainforest.' Output: 'Amazon Rainforest Wonders'
            Input: 'Tips for improving productivity while working remotely.' Output: 'Remote Work Productivity Tips' 
          Now, summarize: ${prompt}.`,
      });

      try {
        await fetchMutation(api.threads.updateThreadOnServer, {
          userId: user?._id ?? undefined,
          title,
          userProvidedId: userProvidedThreadId,
        });
      }
      catch (error) {
        console.error("Error updating thread on server:", error);
        return c.json({ error: "Failed to update thread" }, 500);
      }

      return c.json({ message: "Chat created successfully" });
    },
  );
