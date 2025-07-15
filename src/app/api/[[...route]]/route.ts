import { Hono } from "hono";
import { cors } from "hono/cors";
import { csrf } from "hono/csrf";
import { handle } from "hono/vercel";

import { env } from "@/lib/env";
import { threadsRouter } from "./routes/threads";

export const maxDuration = 30;

const app = new Hono();

app.use("*", cors({
  origin: env.NEXT_PUBLIC_BASE_URL,
  allowMethods: ["GET", "POST"],
  allowHeaders: ["Authorization", "Content-Type"],
  maxAge: 600,
  credentials: true,
}));

app.use(csrf({ origin: env.NEXT_PUBLIC_BASE_URL }));

// eslint-disable-next-line unused-imports/no-unused-vars
const routes = app
  .basePath("/api")
  .route("/threads", threadsRouter);

export const GET = handle(app);
export const POST = handle(app);

export type AppType = typeof routes;
