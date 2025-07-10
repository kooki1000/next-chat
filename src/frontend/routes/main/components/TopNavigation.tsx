import { UserButton } from "@clerk/nextjs";
import { useConvexAuth } from "convex/react";
import { Loader } from "lucide-react";
import { Link } from "react-router";

import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";

import { routes } from "@/frontend/routes";

export function TopNavigation() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  return (
    <header className="flex items-center justify-between border-b p-4">
      <div className="flex-1" />
      <div className="flex items-center gap-2">
        <ThemeToggle />
        {isLoading
          ? (
              <Loader className="h-6 w-6 animate-spin text-foreground/80" />
            )
          : isAuthenticated
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
