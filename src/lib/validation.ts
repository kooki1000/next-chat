import type { Message } from "@/types";

export function isLocalMessage(message: any): message is Message {
  return (
    typeof message === "object"
    && message !== null
    && "_id" in message
    && "_creationTime" in message
    && "userProvidedId" in message
    && "version" in message
  );
}

export function isValidMessagePart(part: any): part is { text: string; type: "text" | "reasoning" } {
  return (
    typeof part === "object"
    && part !== null
    && typeof part.text === "string"
    && (part.type === "text" || part.type === "reasoning")
  );
}
