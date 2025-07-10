"use client";

import { Loader } from "lucide-react";
import dynamic from "next/dynamic";

const FrontendApp = dynamic(() => import("@/frontend"), {
  ssr: false,
  loading: LoadingComponent,
});

export default function App() {
  return <FrontendApp />;
}

function LoadingComponent() {
  return (
    <main className="flex h-screen w-screen items-center justify-center" aria-live="polite">
      <Loader className="h-12 w-12 animate-spin text-muted-foreground/80" />
      <span className="sr-only">Loading...</span>
    </main>
  );
}
