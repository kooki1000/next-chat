import { LoaderIcon } from "lucide-react";

export function Loader() {
  return (
    <main className="flex h-screen w-screen items-center justify-center" aria-live="polite">
      <LoaderIcon className="h-12 w-12 animate-spin text-muted-foreground/80" />
      <span className="sr-only">Loading...</span>
    </main>
  );
}
