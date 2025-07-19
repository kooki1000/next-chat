export interface BaseError {
  type: string;
  message: string;
  code?: number;
  originalError?: unknown;
  context?: Record<string, unknown>;
}

export interface NetworkError extends BaseError {
  type: "network";
  url?: string;
}

export interface ConvexServerError {
  code: number;
  message: string;
}
