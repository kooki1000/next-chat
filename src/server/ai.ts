import type { Result } from "neverthrow";
import type { AIError } from "@/types";

import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { err, ok } from "neverthrow";

import { THREAD_TITLE_PROMPT } from "@/lib/prompts";

import "server-only";

interface ThreadTitle {
  title: string;
}

export async function generateThreadTitle(prompt: string): Promise<Result<ThreadTitle, AIError>> {
  try {
    const { text: title } = await generateText({
      model: openai("gpt-3.5-turbo"),
      temperature: 0.3,
      prompt: THREAD_TITLE_PROMPT(prompt),
    });

    return ok({ title });
  }
  catch (error) {
    return err({
      type: "ai",
      message: "Failed to generate thread title",
      originalError: error,
    });
  }
}
