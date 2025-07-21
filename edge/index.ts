/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import api, {
  createAuth,
  createD1Db,
  getOpenAI,
  type AppContext,
} from "@root/api/edge";
import type { CloudflareEnv } from "@root/core/types";
import { streamText } from "ai";
import { Hono } from "hono";
import { authCors, chatCors } from "./lib/cors";
import { getEnvironment } from "./lib/environment";

const app = new Hono<{
  Bindings: CloudflareEnv;
  Variables: AppContext["Variables"];
}>();

// Initialize shared context for all /api routes
app.use("/api/*", async (c, next) => {
  // Initialize database using Cloudflare D1
  const db = createD1Db(c.env.DB);

  // Initialize auth
  const auth = createAuth(db, c.env);

  // Get session info
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  // Set context variables
  c.set("db", db);
  c.set("auth", auth);
  c.set("session", session?.session ?? null);
  c.set("user", session?.user ?? null);

  await next();
});

// Better Auth handlers with CORS
// https://www.better-auth.com/docs/integrations/hono
// https://hono.dev/examples/better-auth-on-cloudflare
app.use("/api/auth/*", authCors());

// tRPC API and authentication
app.route("/", api);

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
