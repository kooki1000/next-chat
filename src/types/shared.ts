import type { Doc } from "@/convex/_generated/dataModel";

export type User = Doc<"users">;
export type Thread = Doc<"threads">;
export type Message = Doc<"messages">;

export type SuccessResponse<T = void> = {
  success: true;
  message: string;
} & (T extends void ? object : { data: T });

export interface ErrorResponse {
  success: false;
  error: string;
}

export interface NetworkSuccess {
  success: true;
  data?: unknown;
}
