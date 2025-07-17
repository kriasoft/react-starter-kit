/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { createTRPCHandler } from "@root/api/lib/hono";
import type { CloudflareEnv, CloudflareVariables } from "@root/core/types";
import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono<{
  Bindings: CloudflareEnv;
  Variables: CloudflareVariables;
}>();

// CORS middleware
app.use(
  "*",
  cors({
    origin: (origin) => origin,
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  }),
);

// Health check endpoint
app.get("/health", (c) => {
  return c.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "tRPC API Server",
  });
});

// Mount tRPC handler
app.all("/trpc/*", (c) => {
  return createTRPCHandler(c, {
    endpoint: "/trpc",
    onError({ error, path }) {
      console.error("tRPC error on path", path, ":", error);
    },
    batching: { enabled: true },
  });
});

// Start server
const port = parseInt(process.env.PORT || "8080", 10);
console.log(`🚀 Server starting on port ${port}`);

// Graceful shutdown handling for Cloud Run
let server: { stop(): void } | undefined;

const shutdown = () => {
  console.log("📡 Received shutdown signal, gracefully shutting down...");
  if (server) {
    server.stop();
  }
  process.exit(0);
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

export default {
  port,
  fetch: app.fetch,
};
