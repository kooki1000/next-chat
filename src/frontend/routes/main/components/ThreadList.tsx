import { MessageSquare } from "lucide-react";
import { Link } from "react-router";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { routes } from "@/frontend/routes";
import { useLocalThreads } from "@/hooks/use-local-threads";

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
                // eslint-disable-next-line react/no-array-index-key
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
                <Button
                  key={thread._id}
                  variant="ghost"
                  className="h-auto w-full justify-start p-2 text-left text-sm font-normal"
                  asChild
                >
                  <Link
                    to={routes.chat.$buildPath({
                      params: { threadId: thread._id || thread.userProvidedId },
                    })}
                  >
                    <MessageSquare className="mr-2 h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{thread.title}</span>
                  </Link>
                </Button>
              ))}
            </>
          )}
    </div>
  );
}
