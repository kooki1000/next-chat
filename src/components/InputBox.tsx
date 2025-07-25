import { Paperclip, Send } from "lucide-react";
import React from "react";

import { DEFAULT_MAX_LENGTH } from "@/lib/constants";
import { cn } from "@/lib/utils";

import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

interface InputBoxProps {
  value: string;
  maxLength?: number;
  placeholder?: string;
  onChange: (value: string) => void;
  onSend?: () => void;
  onAttach?: () => void;
  className?: string;
  disabled?: boolean;
  ref?: React.RefObject<HTMLTextAreaElement | null>;
}

export function InputBox({
  value,
  maxLength = DEFAULT_MAX_LENGTH,
  placeholder = "Type your message here...",
  onChange,
  onSend,
  onAttach,
  className = "",
  disabled = false,
  ref,
}: InputBoxProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (onSend && value.trim() && !disabled) {
        onSend();
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="relative">
      <Textarea
        ref={ref}
        maxLength={maxLength}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className={cn("max-h-[200px] min-h-[100px] resize-none overflow-y-auto pr-24 text-base", className)}
      />

      {/* Input Controls */}
      <div className="absolute right-3 bottom-3 flex items-center gap-2">
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="h-8 w-8"
          onClick={onAttach}
          disabled={disabled}
        >
          <Paperclip className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          size="icon"
          className="h-8 w-8"
          onClick={onSend}
          disabled={!value.trim() || disabled}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
