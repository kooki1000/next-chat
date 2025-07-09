import { useUser } from "@clerk/nextjs";
import { Loader } from "lucide-react";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";

import { routes } from "@/frontend/routes";
import { useSyncRouter } from "@/hooks/use-sync-router";

import { TopNavigation } from "./components/TopNavigation";

export function AuthLayout() {
  useSyncRouter();

  const navigate = useNavigate();
  const { isSignedIn: isAuthenticated, isLoaded } = useUser();

  const isLoading = !isLoaded;

  // Redirect authenticated users
  useEffect(() => {
    if (isAuthenticated) {
      navigate(
        { pathname: routes.$path() },
        { replace: true },
      );
    }
  }, [isAuthenticated, navigate]);

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen flex-col">
      <TopNavigation />
      {isLoading
        ? (
            <main className="flex flex-1 items-center justify-center">
              <Loader className="h-12 w-12 animate-spin text-foreground/80" />
            </main>
          )
        : (
            <Outlet />
          )}
    </div>
  );
}
