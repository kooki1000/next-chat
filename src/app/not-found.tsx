"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { Loader } from "@/components/Loader";
import { routes } from "@/frontend/routes";

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    console.warn("Not Found: Redirecting to home page");
    router.replace(routes.$path());
  }, [router]);

  return <Loader />;
}
