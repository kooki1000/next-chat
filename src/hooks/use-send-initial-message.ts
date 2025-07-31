import { useNetworkState } from "@uidotdev/usehooks";
import { useConvexAuth, useMutation } from "convex/react";
import { useAtom } from "jotai";
import { useCallback } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import { promptAtom } from "@/atoms";
import { createThreadTitle } from "@/client/api";
import { convexMutation } from "@/client/convex";
import { createLocalMessage, createLocalThread } from "@/client/dexie";
import { api } from "@/convex/_generated/api";
import { routes } from "@/frontend/routes";
import { DEFAULT_THREAD_TITLE } from "@/lib/constants";
import { createMessageSchema } from "@/lib/schemas";
import { handleClientResult } from "@/lib/utils";

/**
 * Custom hook for sending messages in the chat application.
 * Handles both online and offline scenarios, creates threads and messages,
 * and navigates to the chat page after sending.
 */
export function useSendInitialMessage() {
  const navigate = useNavigate();

  // Network and authentication states
  const { isAuthenticated } = useConvexAuth();
  const { online: isOnline } = useNetworkState();

  // Mutations for creating threads and messages
  const createThread = useMutation(api.threads.createThread);
  const createClientMessage = useMutation(api.messages.createClientMessage);

  // Prompt state management with Jotai
  const [prompt, setPrompt] = useAtom(promptAtom);
  const clearPrompt = useCallback(() => setPrompt(""), [setPrompt]);

  const handleSendMessage = useCallback(async (isRetry = false) => {
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

      const threadResult = handleClientResult(createThreadResult, {
        title: "Failed to save thread locally",
      });

      if (!threadResult)
        return;

      // Create local thread if not authenticated
      if (!isAuthenticated) {
        const createLocalThreadResult = await createLocalThread({
          title: DEFAULT_THREAD_TITLE,
          threadId,
          createdAt,
          updatedAt: createdAt,
        });

        const localThreadResult = handleClientResult(createLocalThreadResult, {
          title: "Failed to save thread locally",
          description: "Your message was sent but the thread could not be saved locally.",
        });

        if (!localThreadResult)
          return;
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

      const messageResult = handleClientResult(createMessageResult, {
        title: "Failed to create message",
        showRetry: !isRetry,
        onRetry: () => handleSendMessage(true),
      });

      if (!messageResult)
        return;

      const createLocalMessageResult = await createLocalMessage({
        content: prompt,
        threadId,
        createdAt,
      });

      const localMessageResult = handleClientResult(createLocalMessageResult, {
        title: "Failed to save message locally",
        description: "Your message was sent but could not be saved locally.",
      });

      if (!localMessageResult)
        return;

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

      const threadTitleResult = handleClientResult(apiRequestResult, {
        title: "Failed to create thread title",
        showRetry: !isRetry,
        onRetry: () => handleSendMessage(true),
      });

      if (!threadTitleResult)
        return;

      return;
    }

    // Offline scenario
    const createLocalThreadResult = await createLocalThread({
      title: DEFAULT_THREAD_TITLE,
      threadId,
      createdAt,
      updatedAt: createdAt,
    });

    const localThreadResult = handleClientResult(createLocalThreadResult, {
      title: "Failed to save thread locally",
      description: "Your message was sent but the thread could not be saved locally.",
    });

    if (!localThreadResult)
      return;

    const createLocalMessageResult = await createLocalMessage({
      content: prompt,
      threadId,
      createdAt,
    });

    const localMessageResult = handleClientResult(createLocalMessageResult, {
      title: "Failed to save message locally",
      description: "Your message was sent but could not be saved locally.",
    });

    if (!localMessageResult)
      return;

    clearPrompt();

    toast.success("Thread saved locally", {
      description: "AI response will be available when you are back online.",
    });

    navigate({
      pathname: routes.chat.$buildPath({
        params: { threadId },
      }),
    });
  }, [prompt, isOnline, isAuthenticated, createThread, createClientMessage, clearPrompt, navigate]);

  return {
    prompt,
    setPrompt,
    clearPrompt,
    handleSendMessage,
    hasContent: !!prompt.trim(),
  };
}
