import { useChat as useBaseChat } from "@ai-sdk/react";
import { useTypedParams } from "react-router-typesafe-routes";

import { routes } from "@/frontend/routes";

const API_ENDPOINT = "/api/chats";

export function useChat() {
  const { threadId } = useTypedParams(routes.chat);
  if (!threadId) {
    throw new Error("Thread ID is required to use the chat hook");
  }

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    status,
    error,
  } = useBaseChat({
    id: threadId,
    api: API_ENDPOINT,
  });

  return {
    threadId,
    messages,
    input,
    handleInputChange,
    handleSubmit,
    status,
    error,
  };
}
