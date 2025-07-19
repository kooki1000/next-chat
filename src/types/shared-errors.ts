export interface BaseError {
  type: string;
  message: string;
  originalError?: unknown;
  statusCode?: string;
  context?: Record<string, unknown>;
}

export interface NetworkError extends BaseError {
  type: "network";
  url?: string;
}
