import { SignOutButton } from "@clerk/nextjs";
import { useConvexAuth } from "convex/react";
import {
  Loader,
  LogIn,
  LogOut,
  Plus,
  Search,
  Sparkles,
} from "lucide-react";
import { Link, useNavigate } from "react-router";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarSeparator,
} from "@/components/ui/sidebar";

import { routes } from "@/frontend/routes";

import { ThreadList } from "./ThreadList";

export function AppSidebar() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useConvexAuth();

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="p-4">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
            <Sparkles className="h-4 w-4 text-white" aria-hidden="true" />
          </div>
          <Link to={routes.$path()} className="text-lg font-semibold">Next Chat</Link>
        </div>

        <Button
          type="button"
          onClick={() => navigate({
            pathname: routes.chat.$buildPath({
              params: { threadId: crypto.randomUUID() },
            }),
          })}
          className="w-full justify-start gap-2 bg-primary/80 hover:bg-primary"
        >
          <Plus className="h-4 w-4" />
          <span>New Chat</span>
        </Button>
      </SidebarHeader>

      <SidebarContent className="px-4">
        <div className="relative mb-4">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
          <Input placeholder="Search your threads..." className="bg-muted/50 pl-10" />
        </div>
        <SidebarSeparator />
        <ThreadList />
      </SidebarContent>

      <SidebarFooter className="p-4">
        {isLoading
          ? (
              <Button
                type="button"
                variant="ghost"
                className="w-full justify-start gap-2"
                disabled
              >
                <Loader className="h-4 w-4 animate-spin" />
                <span>Loading...</span>
              </Button>
            )
          : isAuthenticated
            ? (
                <SignOutButton>
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full justify-start gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </Button>
                </SignOutButton>
              )
            : (
                <Button variant="ghost" className="w-full justify-start gap-2" asChild>
                  <Link to={routes.signIn.$path()}>
                    <LogIn className="h-4 w-4" />
                    <span>Sign In</span>
                  </Link>
                </Button>
              )}
      </SidebarFooter>
    </Sidebar>
  );
}
