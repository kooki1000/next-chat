import { useChat as useBaseChat } from "@ai-sdk/react";
import { useLocalStorage } from "@uidotdev/usehooks";
import { DefaultChatTransport } from "ai";
import { useTypedParams } from "react-router-typesafe-routes";

import { routes } from "@/frontend/routes";
import { useLocalMessages } from "@/hooks/use-local-messages";

const API_ENDPOINT = "/api/chats";

export function useChat() {
  const { threadId } = useTypedParams(routes.chat);
  if (!threadId) {
    throw new Error("useChat: threadId param is missing. Ensure the route provides a threadId.");
  }

  // TODO: Add clear logic when thread is deleted
  const [input, setInput] = useLocalStorage(`thread-${threadId}-input`, "");
  const localMessages = useLocalMessages({ threadId });

  // Convert local messages to UI format for initial context
  const initialMessages = localMessages?.map(msg => ({
    id: msg._id || crypto.randomUUID(),
    role: msg.role as "user" | "assistant",
    createdAt: new Date(msg.createdAt),
    parts: msg.parts,
  })) || [];

  const {
    messages,
    sendMessage,
    status,
    error,
  } = useBaseChat({
    id: threadId,
    messages: initialMessages,
    transport: new DefaultChatTransport({
      api: API_ENDPOINT,
      body: { threadId },
    }),
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = () => {
    if (input.trim()) {
      sendMessage({ text: input });
      setInput("");
    }
  };

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
