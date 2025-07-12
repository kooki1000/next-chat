import type { ReactMutation } from "convex/react";
import type { FunctionReference } from "convex/server";
import type { Id } from "@/convex/_generated/dataModel";

import { toast } from "sonner";
import { create } from "zustand";

import { localDb } from "@/db/dexie";
import { routes } from "@/frontend/routes";
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
            await localDb.threads.add({
              _id: crypto.randomUUID() as Id<"threads">,
              _creationTime: createdAt.getTime(),
              title: DEFAULT_THREAD_TITLE,
              userId: undefined,
              userProvidedId: threadId,
              createdAt: createdAt.toISOString(),
              updatedAt: createdAt.toISOString(),
            });
          }

          // TODO: Send prompt to backend for processing
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
          await localDb.threads.add({
            _id: crypto.randomUUID() as Id<"threads">,
            _creationTime: createdAt.getTime(),
            title: DEFAULT_THREAD_TITLE,
            userId: undefined,
            userProvidedId: threadId,
            createdAt: createdAt.toISOString(),
            updatedAt: createdAt.toISOString(),
          });

          toast.success("Thread saved locally", {
            description: "AI response will be available when you are back online.",
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
