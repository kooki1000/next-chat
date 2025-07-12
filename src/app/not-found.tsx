"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    console.warn("Not Found: Redirecting to home page");
    router.replace("/");
  }, [router]);

  return null;
}
