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
    <main className="flex h-screen w-screen items-center justify-center">
      <Loader className="w-12 h-12 animate-spin text-foreground/80" />
    </main>
  );
}
