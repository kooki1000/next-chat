/* eslint-disable react/no-array-index-key */
import {
  Copy,
  RotateCcw,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function AssistantMessage({ content }: { content: string }) {
  return (
    <div className="flex items-start gap-3">
      <Avatar className="h-8 w-8">
        <AvatarImage src="/placeholder.svg?height=32&width=32" />
        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">AI</AvatarFallback>
      </Avatar>

      {/* Message Content */}
      <div className="flex-1 space-y-4">
        <div className="prose prose-sm max-w-none dark:prose-invert">
          {content.split("\n").map((paragraph, index) => {
            if (paragraph.trim() === "")
              return null;

            // Handle bold text
            if (paragraph.startsWith("**") && paragraph.endsWith("**")) {
              return (
                <h3 key={index} className="mt-4 mb-2 text-base font-semibold">
                  {paragraph.slice(2, -2)}
                </h3>
              );
            }

            // Handle bullet points
            if (paragraph.startsWith("• ")) {
              return (
                <div key={index} className="mb-2 ml-4">
                  <span className="font-medium">
                    {paragraph.slice(2).split(":")[0]}
                    :
                  </span>
                  {paragraph.slice(2).includes(":") && (
                    <span className="ml-1">{paragraph.slice(2).split(":").slice(1).join(":")}</span>
                  )}
                </div>
              );
            }

            return (
              <p key={index} className="mb-3 leading-relaxed">
                {paragraph}
              </p>
            );
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
