/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { getOpenAI } from "@root/api/lib/ai";
import { createTRPCHandler } from "@root/api/lib/hono";
import type { CloudflareEnv, CloudflareVariables } from "@root/core/types";
import { streamText } from "ai";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { createAuth } from "./lib/auth";

const app = new Hono<{
  Bindings: CloudflareEnv;
  Variables: CloudflareVariables;
}>();

// Better Auth handlers
// https://www.better-auth.com/docs/integrations/hono
// https://hono.dev/examples/better-auth-on-cloudflare
app.on(["GET", "POST"], "/api/auth/*", (c) => {
  return createAuth(c.env).handler(c.req.raw);
});

// CORS and authentication middleware for API routes
app.use(
  "/api/trpc/*",
  cors({
    origin: ["http://localhost:5173", "https://example.com"],
    credentials: true,
  }),
  async function authenticate(c, next) {
    const authHeader = c.req.header("Authorization");
    if (authHeader?.startsWith("Bearer ")) {
      // TODO
    }

    await next();
  },
);

// Mount tRPC handler
app.all("/api/trpc/*", (c) => {
  return createTRPCHandler(c, {
    endpoint: "/api/trpc",
    onError({ error, path }) {
      console.error("tRPC error on path", path, ":", error);
    },
    batching: { enabled: true },
  });
});

// Chat API endpoint for Vercel AI SDK
app.post("/api/chat", async (c) => {
  try {
    const { messages } = await c.req.json();

    const openAI = getOpenAI(c.env);
    const result = streamText({
      model: openAI("gpt-4.1-mini"),
      messages,
    });

    return result.toDataStreamResponse({
      getErrorMessage(err) {
        console.error(err);
        return (err as Error).message ?? "Unknown error";
      },
    });
  } catch (err) {
    console.error("Chat API error:", err);
    return c.json(
      {
        error: "Failed to process chat request",
        message: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 },
    );
  }
});

app.get("*", async (c) => {
  try {
    // First try to serve the exact requested path
    const requestUrl = new URL(c.req.url);
    let response = await c.env.ASSETS.fetch(requestUrl, c.req.raw);

    // If not found, fall back to index.html for SPA routing
    if (response.status === 404) {
      const indexUrl = new URL("/index.html", c.req.url);
      response = await c.env.ASSETS.fetch(indexUrl, c.req.raw);
    }

    return response;
  } catch (error) {
    console.error("Error serving static content:", error);
    return c.text("Error serving content", 500);
  }
});

export default app;
