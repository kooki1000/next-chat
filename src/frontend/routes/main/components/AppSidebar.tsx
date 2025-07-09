import {
  LogIn,
  LogOut,
  Plus,
  Search,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarSeparator,
} from "@/components/ui/sidebar";

import { ThreadList } from "./ThreadList";

export function AppSidebar() {
  const isAuthenticated = false;

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="p-4">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <Link to="/" className="text-lg font-semibold">AI Chat App</Link>
        </div>

        <Button
          onClick={() => {
            console.error("New chat not implemented yet");
          }}
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
        {!isAuthenticated
          ? (
              <Button variant="ghost" className="w-full justify-start gap-2" asChild>
                <Link to="/sign-in">
                  <LogIn className="h-4 w-4" />
                  <span>Sign In</span>
                </Link>
              </Button>
            )
          : (
              <Button
                onClick={() => {
                  console.error("Sign out not implemented yet");
                }}
                variant="ghost"
                className="w-full justify-start gap-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </Button>
            )}
      </SidebarFooter>
    </Sidebar>
  );
}
