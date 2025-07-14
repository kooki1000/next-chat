import { Hono } from "hono";
import { cors } from "hono/cors";
import { csrf } from "hono/csrf";
import { handle } from "hono/vercel";

import { env } from "@/lib/env";

export const runtime = "edge";

const app = new Hono().basePath("/api");

app.use("*", cors({
  origin: env.NEXT_PUBLIC_BASE_URL,
  allowMethods: ["GET", "POST"],
  allowHeaders: ["Authorization", "Content-Type"],
  maxAge: 600,
  credentials: true,
}));

app.use(csrf({ origin: env.NEXT_PUBLIC_BASE_URL }));

// eslint-disable-next-line unused-imports/no-unused-vars
const routes = app.get("/hello", async (c) => {
  return c.json({
    message: "Hello Next.js!",
  });
});

export const GET = handle(app);
export const POST = handle(app);

export type AppType = typeof routes;
