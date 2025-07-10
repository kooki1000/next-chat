import type { InputAreaHandle } from "./components";

import { Loader } from "lucide-react";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { useTypedParams } from "react-router-typesafe-routes";

import { routes } from "@/frontend/routes";
import { useLocalMessages } from "@/hooks/use-local-messages";

import {
  AssistantMessage,
  InputArea,
  UserMessage,
} from "./components";

export function ChatPage() {
  const navigate = useNavigate();
  const { threadId } = useTypedParams(routes.chat);
  const messages = useLocalMessages({ threadId });

  const inputAreaRef = useRef<InputAreaHandle>(null);

  useEffect(() => {
    if (!threadId || messages?.length === 0) {
      navigate(
        { pathname: routes.$path() },
        { replace: true },
      );
    }
  }, [threadId, messages?.length, navigate]);

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
      {messages === undefined
        ? (
            <div className="flex flex-1 items-center justify-center">
              <Loader className="h-8 w-8 animate-spin" />
              <span className="sr-only">Loading...</span>
            </div>
          )
        : (
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-6 pb-2">
                {messages?.map(message => (
                  <div key={message._id} className="space-y-4">
                    {message.role === "user"
                      ? (
                          <UserMessage content={message.content} />
                        )
                      : (
                          <AssistantMessage content={message.content} />
                        )}
                  </div>
                ))}
              </div>
            </div>
          )}

      {/* Input Area */}
      <InputArea ref={inputAreaRef} />
    </div>
  );
}
