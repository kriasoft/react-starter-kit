/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { getOpenAI } from "@root/api/lib/ai";
import { createTRPCHandler } from "@root/api/lib/hono";
import type { CloudflareEnv, CloudflareVariables } from "@root/core/types";
import { streamText } from "ai";
import { Hono } from "hono";
import { createAuth } from "./lib/auth";
import { authCors, chatCors, trpcCors } from "./lib/cors";
import { getEnvironment } from "./lib/environment";

const app = new Hono<{
  Bindings: CloudflareEnv;
  Variables: CloudflareVariables;
}>();

// Better Auth handlers with CORS
// https://www.better-auth.com/docs/integrations/hono
// https://hono.dev/examples/better-auth-on-cloudflare
app.use("/api/auth/*", authCors());

app.on(["GET", "POST"], "/api/auth/*", (c) => {
  return createAuth(c.env).handler(c.req.raw);
});

// CORS and authentication middleware for tRPC routes
app.use("/api/trpc/*", trpcCors(), async function authenticate(c, next) {
  try {
    // Get session using Better Auth API
    const session = await createAuth(c.env).api.getSession({
      headers: c.req.raw.headers,
    });

    // Set user and session context for downstream handlers
    c.set("user", session?.user ?? null);
    c.set("session", session?.session ?? null);
  } catch (error) {
    console.error("Authentication error:", error);
    // Set null values on authentication failure
    c.set("user", null);
    c.set("session", null);
  }

  await next();
});

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

// CORS for chat endpoint
app.use("/api/chat", chatCors());

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

// Health check endpoint showing environment info
app.get("/health", (c) => {
  const environment = getEnvironment(c.env);
  return c.json({
    status: "ok",
    environment,
    timestamp: new Date().toISOString(),
  });
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
