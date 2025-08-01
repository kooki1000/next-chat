/* eslint-disable react/no-array-index-key */
import type { UIMessagePart } from "@/types";

import {
  Copy,
  RotateCcw,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { MarkdownRenderer } from "./MarkdownRenderer";
import { ReasoningDisplay } from "./ReasoningDisplay";

export function AssistantMessage({ parts }: { parts: Array<UIMessagePart> }) {
  return (
    <div>
      {/* Message Content */}
      <div className="flex-1 space-y-4">
        <div className="prose prose-sm max-w-none dark:prose-invert">
          {parts.map((part, index) => {
            // Handle different part types
            switch (part.type) {
              case "text":
                return <MarkdownRenderer key={index} content={part.text} />;

              case "reasoning":
                return <ReasoningDisplay key={index} index={index} part={part} />;

              default:
                return null;
            }
          })}
        </div>

        {/* Message Actions */}
        <div className="flex items-center gap-2 pt-2">
          <Button variant="ghost" size="sm" className="h-8 px-2">
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 px-2">
            <ThumbsUp className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 px-2">
            <ThumbsDown className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 px-2">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
