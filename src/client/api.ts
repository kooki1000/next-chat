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
        status: response.status,
      });
    }

    const data = await response.json();
    if (!data || !data.success) {
      return err({
        type: "api",
        message: "Invalid response from server",
        status: response.status,
      });
    }

    return ok({
      success: true,
      message: data.message,
      status: response.status,
    });
  }
  catch (error) {
    return err({
      type: "network",
      message: "Network error occurred while creating thread title",
      originalError: error,
      status: "500",
    });
  }
}
