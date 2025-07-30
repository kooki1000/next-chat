import type { InputAreaHandle } from "./components";

import { Loader } from "lucide-react";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";

import { routes } from "@/frontend/routes";
import { useChat } from "@/hooks/use-chat";
import { isLocalMessage } from "@/lib/utils";

import { AssistantMessage, InputArea, UserMessage } from "./components";

export function ChatPage() {
  const navigate = useNavigate();

  const {
    threadId,
    messages: aiMessages,
    input,
    status,
    error,
    localMessages,
  } = useChat();

  const inputAreaRef = useRef<InputAreaHandle>(null);

  // Combine local messages and AI messages
  // AI messages take priority when available (real-time streaming)
  // Fall back to local messages for persistence
  const displayMessages = aiMessages.length > 0 ? aiMessages : localMessages;
  const isLoading = status === "submitted";

  // TODO: Redirect to home if threadId is not valid
  useEffect(() => {
    if (!threadId) {
      navigate(
        { pathname: routes.$path() },
        { replace: true },
      );
    }
  }, [threadId, navigate]);

  // Focus the input area when the component mounts
  useEffect(() => {
    inputAreaRef.current?.focus();
  }, []);

  if (!threadId) {
    return null;
  }

  return (
    <div className="flex h-full flex-col">
      {/* Messages Area */}
      {displayMessages === undefined
        ? (
            <div className="flex flex-1 items-center justify-center">
              <Loader className="h-8 w-8 animate-spin" />
              <span className="sr-only">Loading...</span>
            </div>
          )
        : (
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-6 pb-2">
                {displayMessages?.map((message, index) => {
                  // Handle both local messages and AI messages
                  const messageKey = isLocalMessage(message) ? message.userProvidedId : index;
                  return (
                    <div key={messageKey} className="space-y-4">
                      {message.role === "user"
                        ? (
                            <UserMessage content={message.content} />
                          )
                        : (
                            <AssistantMessage content={message.content} />
                          )}
                    </div>
                  );
                })}

                {isLoading && (
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-sm font-medium text-white">
                      AI
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Loader className="h-4 w-4 animate-spin" />
                        <span className="text-sm text-muted-foreground">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
                    <p className="text-sm">
                      Failed to get AI response:
                      {" "}
                      {error.message}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

      {/* Input Area */}
      <InputArea
        ref={inputAreaRef}
        input={input}
      />
    </div>
  );
}
