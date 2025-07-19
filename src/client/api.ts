import type { Result } from "neverthrow";
import type { ApiError, NetworkError, NetworkSuccess } from "@/types";

import { err, ok } from "neverthrow";
import { api } from "@/lib/api";

interface CreateThreadTitleParams {
  prompt: string;
  threadId: string;
}

export async function createThreadTitle({ prompt, threadId }: CreateThreadTitleParams): Promise<Result<NetworkSuccess, ApiError | NetworkError>> {
  try {
    const response = await api.threads.create.$post({
      json: {
        prompt,
        userProvidedThreadId: threadId,
      },
    });

    if (response.status !== 201) {
      return err({
        type: "api",
        message: `Failed to create thread title: ${response.statusText}`,
        code: response.status,
      });
    }

    const data = await response.json();
    if (!data || !data.success) {
      return err({
        type: "api",
        message: "Invalid response from server",
        code: response.status,
      });
    }

    return ok({
      success: true,
      message: data.message,
      code: response.status,
    });
  }
  catch (error) {
    return err({
      type: "network",
      message: "Network error occurred while creating thread title",
      code: 500,
      originalError: error,
    });
  }
}
