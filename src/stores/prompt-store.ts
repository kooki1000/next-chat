import type { ReactMutation } from "convex/react";
import type { FunctionReference } from "convex/server";

import { toast } from "sonner";
import { create } from "zustand";

import { createLocalMessage, createLocalThread } from "@/db/mutations";
import { routes } from "@/frontend/routes";
import { api } from "@/lib/api";
import { DEFAULT_THREAD_TITLE } from "@/lib/constants";
import { createMessageSchema } from "@/lib/schemas";

interface PromptState {
  prompt: string;
  setPrompt: (prompt: string) => void;
  clearPrompt: () => void;
}

interface PromptActions {
  handleSendMessage: (
    isOnline: boolean,
    isAuthenticated: boolean,
    createThread: ReactMutation<FunctionReference<"mutation">>,
    navigate: (options: { pathname: string }) => void,
    isRetry?: boolean
  ) => Promise<void>;
}

type PromptStore = PromptState & PromptActions;

/**
 * Zustand store for managing the prompt input state and sending messages.
 * This store handles both online and offline scenarios, creating threads
 * and navigating to the chat page.
 */
export const usePromptStore = create<PromptStore>((set, get) => ({
  prompt: "",
  setPrompt: (prompt: string) => set({ prompt }),
  clearPrompt: () => set({ prompt: "" }),
  handleSendMessage: async (isOnline, isAuthenticated, createThread, navigate, isRetry = false) => {
    const { prompt, clearPrompt } = get();

    if (prompt.trim()) {
      const messageValidation = createMessageSchema.safeParse({ content: prompt });
      if (!messageValidation.success) {
        toast.error("Error sending message", {
          description: messageValidation.error.issues[0].message,
        });

        return;
      }

      const threadId = crypto.randomUUID();
      const createdAt = new Date();

      if (isOnline) {
        try {
          await createThread({
            title: DEFAULT_THREAD_TITLE,
            userProvidedId: threadId,
            createdAt: createdAt.toISOString(),
          });

          if (!isAuthenticated) {
            await createLocalThread({
              threadId,
              createdAt,
              updatedAt: createdAt,
            });
          }

          await createLocalMessage({
            content: prompt,
            threadId,
            createdAt,
          });

          // TODO: Send prompt to backend for processing
          await api.threads.create.$post({
            json: {
              prompt,
              userProvidedThreadId: threadId,
            },
          });

          clearPrompt();

          navigate({
            pathname: routes.chat.$buildPath({
              params: { threadId },
            }),
          });
        }
        catch (error) {
          toast.error("Failed to create thread", {
            description: error instanceof Error ? error.message : "Please check your connection and try again",
            action: isRetry
              ? undefined
              : {
                  label: "Try again",
                  onClick: () => get().handleSendMessage(isOnline, isAuthenticated, createThread, navigate, true),
                },
          });
        }
      }
      else {
        try {
          await createLocalThread({
            threadId,
            createdAt,
            updatedAt: createdAt,
          });

          toast.success("Thread saved locally", {
            description: "AI response will be available when you are back online.",
          });

          await createLocalMessage({
            content: prompt,
            threadId,
            createdAt,
          });

          clearPrompt();

          navigate({
            pathname: routes.chat.$buildPath({
              params: { threadId },
            }),
          });
        }
        catch {
          toast.error("Failed to save locally", {
            description: "Unable to create thread offline. Please try again.",
          });
        }
      }
    }
  },
}));
