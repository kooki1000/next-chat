import type { BaseError } from "./shared-errors";

export interface IndexedDBError extends BaseError {
  type: "indexeddb";
}

export interface ApiError extends BaseError {
  type: "api";
}
