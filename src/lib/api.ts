import type { AppType } from "@/app/api/[[...route]]/route";

import { hc } from "hono/client";
import { env } from "./env";

export const api = hc<AppType>(env.NEXT_PUBLIC_BASE_URL).api;
