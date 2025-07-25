import { useRef } from "react";

import { InputBox } from "@/components/InputBox";
import { ModelSelector } from "@/components/ModelSelector";

import { useChat } from "@/hooks/use-chat";

export interface InputAreaHandle {
  focus: () => void;
}

interface InputAreaProps {
  ref?: React.RefObject<InputAreaHandle | null>;
  input: string;
}

export function InputArea({ ref, input }: InputAreaProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const {
    threadId,
    handleSubmit,
    handleInputChange,
    status,
  } = useChat();

  const isLoading = status === "submitted";

  const handleSendMessage = () => {
    if (!input.trim() || isLoading)
      return;

    handleSubmit(undefined, {
      body: { threadId },
    });
  };

  // Adapter function to convert string to event for handleInputChange
  const handleStringChange = (value: string) => {
    const syntheticEvent = {
      target: { value },
    } as React.ChangeEvent<HTMLTextAreaElement>;

    handleInputChange(syntheticEvent);
  };

  // Expose the focus method through the ref
  if (ref) {
    ref.current = {
      focus: () => {
        textareaRef.current?.focus();
      },
    };
  }

  return (
    <div className="flex-shrink-0 border-t p-4">
      <div className="mx-auto w-full max-w-3xl">
        <form>
          <InputBox
            ref={textareaRef}
            value={input}
            onChange={handleStringChange}
            onSend={handleSendMessage}
            disabled={isLoading}
          />
        </form>

        <div className="mt-3 flex items-center justify-between">
          <ModelSelector />
          <div className="text-xs text-muted-foreground">
            AI can make mistakes. Check important info.
          </div>
        </div>
      </div>
    </div>
  );
}
