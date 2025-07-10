import { UserButton } from "@clerk/nextjs";
import { useConvexAuth } from "convex/react";
import { Link } from "react-router";

import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";

import { routes } from "@/frontend/routes";

export function TopNavigation() {
  const { isAuthenticated } = useConvexAuth();
  return (
    <header className="flex items-center justify-between border-b p-4">
      <div className="flex-1" />
      <div className="flex items-center gap-2">
        <ThemeToggle />
        {isAuthenticated
          ? (
              <UserButton />
            )
          : (
              <Button variant="outline" size="sm" asChild>
                <Link to={routes.signIn.$path()}>Sign In</Link>
              </Button>
            )}
      </div>
    </header>
  );
}
