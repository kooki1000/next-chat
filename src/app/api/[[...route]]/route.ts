import type { ErrorResponse } from "@/types";

import { Hono } from "hono";
import { cors } from "hono/cors";
import { csrf } from "hono/csrf";
import { HTTPException } from "hono/http-exception";
import { handle } from "hono/vercel";

import { env } from "@/lib/env";
import { chatsRouter } from "./routes/chats";
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
  .route("/chats", chatsRouter)
  .route("/threads", threadsRouter);

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    const errResponse
      = err.res
        ?? c.json<ErrorResponse>(
          {
            success: false,
            error: err.message,
          },
          err.status,
        );

    return errResponse;
  }

  return c.json<ErrorResponse>(
    {
      success: false,
      error:
        env.NODE_ENV === "production"
          ? "Internal Server Error"
          : (err.stack ?? err.message),
    },
    500,
  );
});

export const GET = handle(app);
export const POST = handle(app);

export type AppType = typeof routes;
