import { useRef } from "react";

import { InputBox } from "@/components/InputBox";
import { ModelSelector } from "@/components/ModelSelector";

export interface InputAreaHandle {
  focus: () => void;
}

interface InputAreaProps {
  ref?: React.RefObject<InputAreaHandle | null>;
  input: string;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}

export function InputArea({ ref, input, onInputChange, onSubmit, isLoading }: InputAreaProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleSendMessage = () => {
    if (!input.trim() || isLoading)
      return;

    // Create a synthetic form event and submit
    const syntheticEvent = {
      preventDefault: () => {},
      currentTarget: {} as HTMLFormElement,
    } as React.FormEvent<HTMLFormElement>;

    onSubmit(syntheticEvent);
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
        <form onSubmit={onSubmit}>
          <InputBox
            ref={textareaRef}
            value={input}
            onChange={(value) => {
              // Convert string to ChangeEvent for compatibility
              const syntheticEvent = {
                target: { value },
                currentTarget: { value },
              } as React.ChangeEvent<HTMLTextAreaElement>;
              onInputChange(syntheticEvent);
            }}
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
