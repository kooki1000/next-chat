"use client";

import type { ComponentProps } from "react";

import { BookIcon, ChevronDownIcon } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { cn } from "@/lib/utils";

export type SourcesProps = ComponentProps<"div">;

export function Sources({ className, ...props }: SourcesProps) {
  return (
    <Collapsible
      // eslint-disable-next-line better-tailwindcss/no-unregistered-classes
      className={cn("not-prose mb-4 text-xs text-primary", className)}
      {...props}
    />
  );
}

export type SourcesTriggerProps = ComponentProps<typeof CollapsibleTrigger> & {
  count: number;
};

export function SourcesTrigger({
  className,
  count,
  children,
  ...props
}: SourcesTriggerProps) {
  return (
    <CollapsibleTrigger className={cn("flex items-center gap-2", className)} {...props}>
      {children ?? (
        <>
          <p className="font-medium">
            Used
            {count}
            {" "}
            sources
          </p>
          <ChevronDownIcon className="h-4 w-4" />
        </>
      )}
    </CollapsibleTrigger>
  );
}

export type SourcesContentProps = ComponentProps<typeof CollapsibleContent>;

export function SourcesContent({
  className,
  ...props
}: SourcesContentProps) {
  return (
    <CollapsibleContent
      className={cn(
        "mt-3 flex w-fit flex-col gap-2",
        "outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-2 data-[state=open]:animate-in data-[state=open]:slide-in-from-top-2",
        className,
      )}
      {...props}
    />
  );
}

export type SourceProps = ComponentProps<"a">;

export function Source({ href, title, children, ...props }: SourceProps) {
  return (
    <a
      className="flex items-center gap-2"
      href={href}
      rel="noreferrer"
      target="_blank"
      {...props}
    >
      {children ?? (
        <>
          <BookIcon className="h-4 w-4" />
          <span className="block font-medium">{title}</span>
        </>
      )}
    </a>
  );
}
