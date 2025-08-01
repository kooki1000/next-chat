import type { UIMessagePart } from "@/types";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function UserMessage({ parts }: { parts: Array<UIMessagePart> }) {
  const isInvalid = parts.length === 0 || parts[0].type !== "text";
  return (
    <div className="flex justify-end">
      <div className="flex max-w-[80%] items-start gap-3">
        {isInvalid
          ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
                Invalid user message: No text content available
              </div>
            )
          : (
              <div className="rounded-2xl bg-muted px-4 py-3 text-sm">
                {parts[0].type === "text" ? parts[0].text : ""}
              </div>
            )}
        <Avatar className="h-8 w-8">
          <AvatarImage src="/placeholder.svg?height=32&width=32" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}
