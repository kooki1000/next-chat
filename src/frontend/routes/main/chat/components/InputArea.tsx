import { useLocalStorage } from "@uidotdev/usehooks";
import { useRef } from "react";
import { useTypedParams } from "react-router-typesafe-routes";

import { InputBox } from "@/components/InputBox";
import { ModelSelector } from "@/components/ModelSelector";

import { routes } from "@/frontend/routes";

export interface InputAreaHandle {
  focus: () => void;
}

interface InputAreaProps {
  ref?: React.RefObject<InputAreaHandle | null>;
}

export function InputArea({ ref }: InputAreaProps) {
  const { threadId } = useTypedParams(routes.chat);
  const [input, setInput] = useLocalStorage(`thread-${threadId || "default"}`, "");

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleSendMessage = () => {
    if (!input.trim())
      return;

    // TODO: Implement actual message sending logic here
    console.warn("Message sent:", input);
    setInput("");
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
        <InputBox
          ref={textareaRef}
          value={input}
          onChange={setInput}
          onSend={handleSendMessage}
        />

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
