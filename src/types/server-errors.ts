import type { BaseError } from "./shared-errors";

export interface AuthError extends BaseError {
  type: "authentication";
}

export interface ConvexError extends BaseError {
  type: "convex";
}

export interface AIError extends BaseError {
  type: "ai";
}

export interface ValidationError extends BaseError {
  type: "validation";
  fields?: Record<string, string>;
}
