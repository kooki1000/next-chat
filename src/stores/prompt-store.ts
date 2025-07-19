import type { ReactMutation } from "convex/react";
import type { api } from "@/convex/_generated/api";

import { toast } from "sonner";
import { create } from "zustand";

import { createThreadTitle } from "@/client/api";
import { convexMutation } from "@/client/convex";
import { createLocalMessage, createLocalThread } from "@/client/dexie";
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
    createThread: ReactMutation<typeof api.threads.createThread>,
    createClientMessage: ReactMutation<typeof api.messages.createClientMessage>,
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
  handleSendMessage: async (
    isOnline,
    isAuthenticated,
    createThread,
    createClientMessage,
    navigate,
    isRetry = false,
  ) => {
    const { prompt, clearPrompt } = get();

    if (!prompt.trim())
      return;

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
      const createThreadResult = await convexMutation({
        mutation: createThread,
        errorMessage: "Something went wrong while creating the thread",
        args: {
          title: DEFAULT_THREAD_TITLE,
          userProvidedId: threadId,
          createdAt: createdAt.toISOString(),
        },
      });

      if (createThreadResult.isErr()) {
        const error = createThreadResult.error;

        console.error(`${error.type} error: ${error.message}`, error.originalError);
        toast.error("Failed to create thread", {
          description: error.message,
          action: isRetry
            ? undefined
            : {
                label: "Try again",
                onClick: () => get().handleSendMessage(isOnline, isAuthenticated, createThread, createClientMessage, navigate, true),
              },
        });

        return;
      }

      // Create local thread if not authenticated
      if (!isAuthenticated) {
        const createLocalThreadResult = await createLocalThread({
          title: DEFAULT_THREAD_TITLE,
          threadId,
          createdAt,
          updatedAt: createdAt,
        });

        if (createLocalThreadResult.isErr()) {
          const error = createLocalThreadResult.error;

          console.error(`${error.type} error: ${error.message}`, error.originalError);
          toast.error("Failed to save thread locally", {
            description: "Your message was sent but the thread could not be saved locally.",
          });

          return;
        }
      }

      const createMessageResult = await convexMutation({
        mutation: createClientMessage,
        errorMessage: "Something went wrong while creating the message",
        args: {
          content: prompt,
          userProvidedId: crypto.randomUUID(),
          userProvidedThreadId: threadId,
          createdAt: createdAt.toISOString(),
        },
      });

      if (createMessageResult.isErr()) {
        const error = createMessageResult.error;

        console.error(`${error.type} error: ${error.message}`, error.originalError);
        toast.error("Failed to create message", {
          description: error.message,
          action: isRetry
            ? undefined
            : {
                label: "Try again",
                onClick: () => get().handleSendMessage(isOnline, isAuthenticated, createThread, createClientMessage, navigate, true),
              },
        });

        return;
      }

      const createLocalMessageResult = await createLocalMessage({
        content: prompt,
        threadId,
        createdAt,
      });

      if (createLocalMessageResult.isErr()) {
        const error = createLocalMessageResult.error;

        console.error(`${error.type} error: ${error.message}`, error.originalError);
        toast.error("Failed to save message locally", {
          description: "Your message was sent but could not be saved locally.",
        });

        return;
      }

      // Capture the current prompt value before clearing it, to avoid race conditions or stale values
      // when making the background API call for thread title generation.
      const promptForApi = prompt;
      clearPrompt();

      navigate({
        pathname: routes.chat.$buildPath({
          params: { threadId },
        }),
      });

      const apiRequestResult = await createThreadTitle({
        prompt: promptForApi,
        threadId,
      });

      if (apiRequestResult.isErr()) {
        const error = apiRequestResult.error;

        console.error(`${error.type} error: ${error.message}`, error.originalError);
        toast.error("Failed to create thread title", {
          description: error.message,
          action: isRetry
            ? undefined
            : {
                label: "Try again",
                onClick: () => get().handleSendMessage(isOnline, isAuthenticated, createThread, createClientMessage, navigate, true),
              },
        });

        return;
      }

      return;
    }

    const createLocalThreadResult = await createLocalThread({
      title: DEFAULT_THREAD_TITLE,
      threadId,
      createdAt,
      updatedAt: createdAt,
    });

    if (createLocalThreadResult.isErr()) {
      const error = createLocalThreadResult.error;

      console.error(`${error.type} error: ${error.message}`, error.originalError);
      toast.error("Failed to save thread locally", {
        description: "Your message was sent but the thread could not be saved locally.",
      });

      return;
    }

    const createLocalMessageResult = await createLocalMessage({
      content: prompt,
      threadId,
      createdAt,
    });

    if (createLocalMessageResult.isErr()) {
      const error = createLocalMessageResult.error;

      console.error(`${error.type} error: ${error.message}`, error.originalError);
      toast.error("Failed to save message locally", {
        description: "Your message was sent but could not be saved locally.",
      });

      return;
    }

    toast.success("Message saved offline", {
      description: "Your message has been saved. The AI will respond automatically when you're back online.",
    });

    navigate({
      pathname: routes.chat.$buildPath({
        params: { threadId },
      }),
    });
  },
}));
