import type { Result } from "neverthrow";
import type { AIError } from "@/lib/errors";

import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { err, ok } from "neverthrow";

interface ThreadTitle {
  title: string;
}

export async function generateThreadTitle(prompt: string): Promise<Result<ThreadTitle, AIError>> {
  try {
    const { text: title } = await generateText({
      model: openai("gpt-3.5-turbo"),
      temperature: 0.3,
      prompt: `
        Summarize the following text into a concise title of 3 to 7 words. Ensure the title captures the main idea effectively and is suitable for use as a thread title. 
        Examples:
          Input: 'A detailed guide on how to bake a cake.' Output: 'Guide to Baking a Cake'
          Input: 'Exploring the wonders of the Amazon rainforest.' Output: 'Amazon Rainforest Wonders'
          Input: 'Tips for improving productivity while working remotely.' Output: 'Remote Work Productivity Tips' 
        Now, summarize: ${prompt}.`.trim(),
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
