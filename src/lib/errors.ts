export interface BaseError {
  type: string;
  message: string;
  originalError?: unknown;
  code?: string;
  statusCode?: number;
  context?: Record<string, unknown>;
}

export interface AuthError extends BaseError {
  type: "authentication";
}

export interface DatabaseError extends BaseError {
  type: "database";
}

export interface AIError extends BaseError {
  type: "ai";
}

export interface ValidationError extends BaseError {
  type: "validation";
  fields?: Record<string, string>;
}

export interface NetworkError extends BaseError {
  type: "network";
  url?: string;
}
