import type { Message } from "ai";

import { useChat as useBaseChat } from "@ai-sdk/react";
import { useEffect, useReducer, useRef } from "react";
import { useTypedParams } from "react-router-typesafe-routes";

import { routes } from "@/frontend/routes";
import { useLocalMessages } from "@/hooks/use-local-messages";

const API_ENDPOINT = "/api/chats";

interface ChatAction {
  type: "SET_SHOULD_SUBMIT";
  value: boolean;
}

function chatReducer(state: { shouldTriggerSubmit: boolean }, action: ChatAction) {
  switch (action.type) {
    case "SET_SHOULD_SUBMIT":
      return { ...state, shouldTriggerSubmit: action.value };
    default:
      return state;
  }
}

export function useChat() {
  const { threadId } = useTypedParams(routes.chat);
  if (!threadId) {
    throw new Error("useChat: threadId param is missing. Ensure the route provides a threadId.");
  }

  const localMessages = useLocalMessages({ threadId });

  const initializedThreadRef = useRef<string | null>(null);
  const [state, dispatch] = useReducer(chatReducer, { shouldTriggerSubmit: false });

  const {
    messages,
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    status,
    error,
    setMessages,
  } = useBaseChat({
    id: threadId,
    api: API_ENDPOINT,
    body: { threadId },
  });

  // Initialize messages from local storage when component mounts
  useEffect(() => {
    if (
      localMessages
      && localMessages.length > 0
      && messages.length === 0
      && initializedThreadRef.current !== threadId
    ) {
      // Convert local messages to the format expected by the AI SDK
      const formattedMessages = localMessages.map(msg => ({
        id: msg._id || crypto.randomUUID(),
        role: msg.role as "user" | "assistant",
        content: msg.content,
        createdAt: new Date(msg.createdAt),
      })) satisfies Message[];

      // Set the messages in the AI SDK state
      setMessages(formattedMessages);
      initializedThreadRef.current = threadId;

      // If the last message is from user and we don't have an AI response, trigger it
      const lastMessage = localMessages[localMessages.length - 1];
      if (lastMessage?.role === "user") {
        dispatch({ type: "SET_SHOULD_SUBMIT", value: true });
      }
    }
  }, [localMessages, messages, threadId, setMessages, dispatch]);

  // Trigger handleSubmit when shouldTriggerSubmit is true
  useEffect(() => {
    if (state.shouldTriggerSubmit) {
      handleSubmit();
      dispatch({ type: "SET_SHOULD_SUBMIT", value: false });
    }
  }, [state.shouldTriggerSubmit, handleSubmit, dispatch]);

  return {
    threadId,
    messages,
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    status,
    error,
    localMessages,
  };
}
