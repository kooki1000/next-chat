import { useCallback, useEffect } from "react";

interface UseGlobalEnterKeyOptions {
  onEnter: () => void;
  enabled?: boolean;
  hasContent?: boolean;
}

/**
 * Custom hook that listens for global Enter key presses
 * and triggers a callback when Enter is pressed outside of input elements.
 */
export function useGlobalEnterKey({
  onEnter,
  enabled = true,
  hasContent = true,
}: UseGlobalEnterKeyOptions) {
  const memoizedOnEnter = useCallback(onEnter, [onEnter]);

  useEffect(() => {
    if (!enabled)
      return;

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Only trigger if Enter is pressed and Shift is not held down
      if (e.key === "Enter" && !e.shiftKey) {
        const activeElement = document.activeElement;
        const isInputFocused = activeElement && (
          activeElement.tagName === "INPUT"
          || activeElement.tagName === "TEXTAREA"
          || activeElement.getAttribute("contenteditable") === "true"
        );

        // If not focused on an input and we have content, trigger the callback
        if (!isInputFocused && hasContent) {
          e.preventDefault();
          memoizedOnEnter();
        }
      }
    };

    document.addEventListener("keydown", handleGlobalKeyDown);

    return () => {
      document.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, [memoizedOnEnter, enabled, hasContent]);
}
