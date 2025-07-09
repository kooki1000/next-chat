import { Skeleton } from "@/components/ui/skeleton";

export function ThreadList() {
  return (
    <div className="space-y-1">
      <h3 className="px-2 py-1 text-sm font-medium text-muted-foreground">Threads</h3>
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          className="flex items-center p-2"
        >
          <Skeleton className="h-5 w-full" />
        </div>
      ))}
    </div>
  );
}
