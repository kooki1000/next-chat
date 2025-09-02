"use client";

import type { ComponentProps } from "react";

import { ChevronDownIcon, SearchIcon } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { cn } from "@/lib/utils";

export type TaskItemFileProps = ComponentProps<"div">;

export function TaskItemFile({
  children,
  className,
  ...props
}: TaskItemFileProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-md border bg-secondary px-1.5 py-0.5 text-xs text-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export type TaskItemProps = ComponentProps<"div">;

export function TaskItem({ children, className, ...props }: TaskItemProps) {
  return (
    <div className={cn("text-sm text-muted-foreground", className)} {...props}>
      {children}
    </div>
  );
}

export type TaskProps = ComponentProps<typeof Collapsible>;

export function Task({
  defaultOpen = true,
  className,
  ...props
}: TaskProps) {
  return (
    <Collapsible
      className={cn(
        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-2 data-[state=open]:animate-in data-[state=open]:slide-in-from-top-2",
        className,
      )}
      defaultOpen={defaultOpen}
      {...props}
    />
  );
}

export type TaskTriggerProps = ComponentProps<typeof CollapsibleTrigger> & {
  title: string;
};

export function TaskTrigger({
  children,
  className,
  title,
  ...props
}: TaskTriggerProps) {
  return (
    <CollapsibleTrigger asChild className={cn("group", className)} {...props}>
      {children ?? (
        <div className="flex cursor-pointer items-center gap-2 text-muted-foreground hover:text-foreground">
          <SearchIcon className="size-4" />
          <p className="text-sm">{title}</p>
          <ChevronDownIcon className="size-4 transition-transform group-data-[state=open]:rotate-180" />
        </div>
      )}
    </CollapsibleTrigger>
  );
}

export type TaskContentProps = ComponentProps<typeof CollapsibleContent>;

export function TaskContent({
  children,
  className,
  ...props
}: TaskContentProps) {
  return (
    <CollapsibleContent
      className={cn(
        "text-popover-foreground outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-2 data-[state=open]:animate-in data-[state=open]:slide-in-from-top-2",
        className,
      )}
      {...props}
    >
      <div className="mt-4 space-y-2 border-l-2 border-muted pl-4">
        {children}
      </div>
    </CollapsibleContent>
  );
}
