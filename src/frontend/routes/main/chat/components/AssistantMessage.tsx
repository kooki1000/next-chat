/* eslint-disable react/no-array-index-key */
import type { UIMessagePart } from "@/types";

import { Copy, RotateCcw, ThumbsDown, ThumbsUp } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function AssistantMessage({ parts }: { parts: Array<UIMessagePart> }) {
  return (
    <div className="flex items-start gap-3">
      <Avatar className="h-8 w-8">
        <AvatarImage src="/placeholder.svg?height=32&width=32" />
        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">AI</AvatarFallback>
      </Avatar>

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

                      return <p key={pIndex}>{paragraph}</p>;
                    })}
                  </div>
                );

              case "reasoning":
                return (
                  <div key={index}>
                    AI reasoning:
                    {part.text}
                  </div>
                );

              default:
                // Fallback for unknown parts
                return (
                  <div key={index}>
                    Unsupported message part:
                    {" "}
                    {part.type}
                  </div>
                );
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
