import type { Result } from "neverthrow";
import type { AuthError } from "@/lib/errors";

import { auth } from "@clerk/nextjs/server";
import { err, ok } from "neverthrow";

interface AuthStatus {
  isAuthenticated: boolean;
  userId: string | null;
}

export async function checkAuthStatus(): Promise<Result<AuthStatus, AuthError>> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return ok({
        isAuthenticated: false,
        userId: null,
      });
    }

    return ok({ isAuthenticated: true, userId });
  }
  catch (error) {
    return err({
      type: "authentication",
      message: "Failed to authenticate user",
      originalError: error,
    });
  }
}
