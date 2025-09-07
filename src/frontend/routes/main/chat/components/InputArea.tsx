import { useImperativeHandle, useRef } from "react";

import {
  PromptInput,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import { ModelSelector } from "@/components/ModelSelector";

import { useChat } from "@/hooks/use-chat";

export interface InputAreaRef {
  focus: () => void;
}

interface InputAreaProps {
  ref?: React.RefObject<InputAreaRef | null>;
}

export function InputArea({ ref }: InputAreaProps) {
  const inputAreaRef = useRef<HTMLTextAreaElement | null>(null);

  const {
    input,
    setInput,
    handleSubmit,
    status,
  } = useChat();

  const isLoading = status === "submitted";

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading)
      return;
    handleSubmit();
  };

  // Expose the focus method through the ref
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputAreaRef.current?.focus();
    },
  }));

  return (
    <div className="flex-shrink-0 border-t p-4">
      <div className="mx-auto w-full max-w-3xl">
        <PromptInput onSubmit={handleFormSubmit}>
          <PromptInputTextarea
            ref={inputAreaRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
          />
          <PromptInputToolbar>
            <PromptInputTools>
              <ModelSelector />
            </PromptInputTools>
            <PromptInputSubmit
              status={isLoading ? "submitted" : "ready"}
              disabled={!input.trim() || isLoading}
            />
          </PromptInputToolbar>
        </PromptInput>

        <div className="mt-3 flex items-center justify-center">
          <div className="text-xs text-muted-foreground">
            AI can make mistakes. Check important info.
          </div>
        </div>
      </div>
    </div>
  );
}
