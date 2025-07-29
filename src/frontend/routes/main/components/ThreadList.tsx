/* eslint-disable react/no-array-index-key */
import type { Thread } from "@/types";

import { Loader, MessageSquare } from "lucide-react";
import { Link } from "react-router";
import { useTypedParams } from "react-router-typesafe-routes";

import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { routes } from "@/frontend/routes";
import { useLocalThreads } from "@/hooks/use-local-threads";
import { cn } from "@/lib/utils";

export function ThreadList() {
  const threads = useLocalThreads();
  return (
    <div className="space-y-1">
      <h3 className="px-2 py-1 text-sm font-medium text-muted-foreground">Threads</h3>
      {threads === undefined
        ? (
            <>
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="flex items-center p-2"
                >
                  <Skeleton className="h-5 w-full" />
                </div>
              ))}
            </>
          )
        : (
            <>
              {threads.map(thread => (
                <ThreadListItem key={thread._id} thread={thread} />
              ))}
            </>
          )}
    </div>
  );
}

function ThreadListItem({ thread }: { thread: Thread }) {
  const { threadId } = useTypedParams(routes.chat);
  return (
    <Link
      to={routes.chat.$buildPath({
        params: { threadId: thread._id || thread.userProvidedId },
      })}
      className={cn(
        buttonVariants({ variant: "ghost" }),
        "h-auto w-full justify-start p-2 text-left text-sm font-normal",
        thread._id === threadId || thread.userProvidedId === threadId
          ? "bg-accent"
          : "hover:bg-accent",
      )}
    >
      <div className="flex w-full items-center justify-between space-x-2">
        <div className="flex min-w-0 items-center space-x-2">
          <MessageSquare className="h-4 w-4 flex-shrink-0" />
          <span className="truncate">{thread.title}</span>
        </div>

        {thread.isPending && (
          <Loader className="h-4 w-4 flex-shrink-0 animate-spin text-muted-foreground" />
        )}
      </div>
    </Link>
  );
}
