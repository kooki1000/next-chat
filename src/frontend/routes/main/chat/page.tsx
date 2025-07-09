import type { InputAreaHandle } from "./components";

import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { useTypedParams } from "react-router-typesafe-routes";

import { staticMessages } from "@/data";
import { routes } from "@/frontend/routes";

import {
  AssistantMessage,
  InputArea,
  UserMessage,
} from "./components";

export function ChatPage() {
  const navigate = useNavigate();
  const { threadId } = useTypedParams(routes.chat);

  const inputAreaRef = useRef<InputAreaHandle>(null);

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
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-6 pb-2">
          {/* TODO: Handle loading state */}
          {staticMessages?.map(message => (
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

      {/* Input Area */}
      <InputArea ref={inputAreaRef} />
    </div>
  );
}
