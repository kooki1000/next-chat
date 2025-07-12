import { useEffect } from "react";
import { useNavigate } from "react-router";

import { Loader } from "@/components/Loader";

import { routes } from "@/frontend/routes";

export function NotFound() {
  const navigate = useNavigate();

  useEffect(() => {
    console.warn("Not Found: Redirecting to home page");
    navigate(
      { pathname: routes.$path() },
      { replace: true },
    );
  }, [navigate]);

  return <Loader />;
}
