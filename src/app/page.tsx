"use client";

import dynamic from "next/dynamic";

const FrontendApp = dynamic(() => import("@/frontend/main"), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});

export default function App() {
  return <FrontendApp />;
}
