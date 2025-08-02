import type { ClassValue } from "clsx";
import type { Result } from "neverthrow";
import type { Message } from "@/types";

import { clsx } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function logError(type: string, message: string, originalError?: unknown): void {
  console.error(`${type} error: ${message}`, originalError);
}

/**
 * Utility function to handle Result errors on the client side.
 * Logs the error, shows a toast notification, and returns null if error.
 */
export function handleClientResult<T, E extends { type: string; message: string; originalError?: unknown }>(
  result: Result<T, E>,
  options: {
    title: string;
    description?: string;
    onRetry?: () => void;
    showRetry?: boolean;
  },
): T | null {
  return result.match(
    value => value,
    (error) => {
      logError(error.type, error.message, error.originalError);

      toast.error(options.title, {
        description: options.description || error.message,
        action: (options.onRetry && (options.showRetry !== false))
          ? {
              label: "Try again",
              onClick: options.onRetry,
            }
          : undefined,
      });

      return null;
    },
  );
}

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

export function getFileExtension(lang: string): string {
  // First, map common language names directly to their extensions
  const directLanguageExtensions: Record<string, string> = {
    javascript: "js",
    jsx: "jsx",
    typescript: "ts",
    tsx: "tsx",
    python: "py",
    java: "java",
    php: "php",
    ruby: "rb",
    go: "go",
    rust: "rs",
    html: "html",
    css: "css",
    json: "json",
    xml: "xml",
    sql: "sql",
    shell: "sh",
    bash: "sh",
  };

  const lowerLang = lang.toLowerCase();
  if (directLanguageExtensions[lowerLang]) {
    return directLanguageExtensions[lowerLang];
  }

  // For languages that need mapping
  const extensionMap: Record<string, string> = {
    javascript: "js",
    typescript: "ts",
    python: "py",
    csharp: "cs",
    cpp: "cpp",
    c: "c",
    ruby: "rb",
    rust: "rs",
    swift: "swift",
    kotlin: "kt",
    scala: "scala",
    scss: "scss",
    sass: "sass",
    less: "less",
    yaml: "yaml",
    yml: "yml",
    markdown: "md",
    bash: "sh",
    shell: "sh",
    powershell: "ps1",
    dockerfile: "dockerfile",
    r: "r",
    matlab: "m",
    perl: "pl",
    lua: "lua",
    dart: "dart",
    vue: "vue",
    svelte: "svelte",
    solidity: "sol",
    haskell: "hs",
    clojure: "clj",
    erlang: "erl",
    elixir: "ex",
    fsharp: "fs",
    ocaml: "ml",
    nim: "nim",
    zig: "zig",
  };

  return extensionMap[lang.toLowerCase()] || "txt";
}
