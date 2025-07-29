import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";

import { ThemeToggle } from "@/components/ThemeToggle";
import { buttonVariants } from "@/components/ui/button";

import { routes } from "@/frontend/routes";

export function TopNavigation() {
  return (
    <header className="flex items-center justify-between border-b p-4">
      <Link to={routes.$path()} className={buttonVariants({ variant: "outline" })}>
        <ArrowLeft className="h-4 w-4" />
        <span>Back to chat</span>
      </Link>
      <ThemeToggle />
    </header>
  );
}
