import { Hono } from "hono";
import { handle } from "hono/vercel";

export const runtime = "edge";

const app = new Hono().basePath("/api");

// eslint-disable-next-line unused-imports/no-unused-vars
const routes = app.get("/hello", async (c) => {
  return c.json({
    message: "Hello Next.js!",
  });
});

export const GET = handle(app);
export const POST = handle(app);

export type AppType = typeof routes;
