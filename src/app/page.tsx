"use client";

import dynamic from "next/dynamic";
import { Loader } from "@/components/Loader";

const FrontendApp = dynamic(() => import("@/frontend"), {
  ssr: false,
  loading: Loader,
});

export default function App() {
  return <FrontendApp />;
}
