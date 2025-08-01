/* eslint-disable react/no-array-index-key */
import type { ReasoningUIPart, UIMessagePart } from "@/types";

import {
  Copy,
  RotateCcw,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { Reasoning } from "./Reasoning";

export function AssistantMessage({ parts }: { parts: Array<UIMessagePart> }) {
  return (
    <>
      {/* Message Content */}
      <div className="flex-1 space-y-4">
        <div className="prose prose-sm max-w-none dark:prose-invert">
          {parts.map((part, index) => {
            // Handle different part types
            switch (part.type) {
              case "text":
                return (
                  <div key={index}>
                    {part.text.split("\n").map((paragraph, pIndex) => {
                      if (paragraph.trim() === "")
                        return null;

                      return <p key={pIndex} className="my-0 gap-0">{paragraph}</p>;
                    })}
                  </div>
                );

              case "reasoning":
                return <Reasoning key={index} index={index} part={part as ReasoningUIPart} />;

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
    </>
  );
}
