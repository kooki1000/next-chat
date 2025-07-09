"use client";

import { ClerkProvider as ClerkNextProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";
import React from "react";

import { CLERK_AFTER_SIGN_OUT_URL } from "@/lib/constants";

type ClerkNextProviderProps = React.ComponentProps<typeof ClerkNextProvider>;

export function ClerkProvider({ children, ...props }: ClerkNextProviderProps) {
  const { theme } = useTheme();

  const effectiveTheme
    = theme === "system"
      ? (typeof window !== "undefined"
        && window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light")
      : theme;

  return (
    <ClerkNextProvider
      appearance={{
        baseTheme: effectiveTheme === "dark" ? dark : undefined,
      }}
      afterSignOutUrl={CLERK_AFTER_SIGN_OUT_URL}
      {...props}
    >
      {children}
    </ClerkNextProvider>
  );
}
