import { Link } from "react-router";

import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";

export function TopNavigation() {
  const isAuthenticated = false;
  return (
    <header className="flex items-center justify-between border-b p-4">
      <div className="flex-1" />
      <div className="flex items-center gap-2">
        <ThemeToggle />
        {isAuthenticated
          ? (
              <div>User Profile</div>
            )
          : (
              <Button variant="outline" size="sm" asChild>
                <Link to="/sign-in">Sign In</Link>
              </Button>
            )}
      </div>
    </header>
  );
}
