import type { InputAreaRef } from "@/frontend/routes/main/chat/components/InputArea";

import { Loader } from "lucide-react";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning";
import { Response } from "@/components/ai-elements/response";
import { routes } from "@/frontend/routes";

import { useChat } from "@/hooks/use-chat";
import { isLocalMessage } from "@/utils/validation";

import { InputArea } from "./components/InputArea";

export function ChatPage() {
  const navigate = useNavigate();

  const {
    threadId,
    messages: aiMessages,
    status,
    error,
    localMessages,
  } = useChat();

  const inputAreaRef = useRef<InputAreaRef | null>(null);

  // AI messages take priority when available (real-time streaming)
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
            <Conversation className="flex-1">
              <ConversationContent>
                {displayMessages?.map((message, index) => {
                  // Handle both local messages and AI messages
                  const messageKey = isLocalMessage(message) ? message.userProvidedId : index;
                  return (
                    <Message
                      key={messageKey}
                      from={message.role as "user" | "assistant" | "system"}
                      className="w-full [&>div]:w-full [&>div]:max-w-none"
                    >
                      <MessageContent>
                        {message.parts.map((part, partIndex) => {
                          const partKey = `${messageKey}-${part.type}-${partIndex}`;
                          switch (part.type) {
                            case "text":
                              return (
                                <Response key={partKey}>
                                  {part.text}
                                </Response>
                              );

                            case "reasoning":
                              return (
                                <Reasoning
                                  key={partKey}
                                  className="w-full"
                                  isStreaming={status === "streaming"}
                                >
                                  <ReasoningTrigger />
                                  <ReasoningContent>
                                    {part.text}
                                  </ReasoningContent>
                                </Reasoning>
                              );

                            default:
                              return null;
                          }
                        })}
                      </MessageContent>
                    </Message>
                  );
                })}

                {isLoading && (
                  <Message from="assistant" className="w-full [&>div]:w-full [&>div]:max-w-none">
                    <MessageContent>
                      <div className="flex items-center gap-2">
                        <Loader className="h-4 w-4 animate-spin" />
                        <span className="text-sm text-muted-foreground">AI is thinking...</span>
                      </div>
                    </MessageContent>
                  </Message>
                )}

                {error && (
                  <Message from="assistant" className="w-full [&>div]:w-full [&>div]:max-w-none">
                    <MessageContent>
                      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
                        <p className="text-sm">
                          Failed to get AI response:
                          {" "}
                          {error.message}
                        </p>
                      </div>
                    </MessageContent>
                  </Message>
                )}
              </ConversationContent>
              <ConversationScrollButton />
            </Conversation>
          )}

      {/* Input Area */}
      <InputArea ref={inputAreaRef} />
    </div>
  );
}
