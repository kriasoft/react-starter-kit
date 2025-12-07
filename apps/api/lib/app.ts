/**
 * @file Hono app construction and tRPC router initialization.
 *
 * Combines authentication, tRPC, and health check endpoints into a single HTTP router.
 */

import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { Hono } from "hono";
import type { AppContext } from "./context.js";
import { router } from "./trpc.js";
import { organizationRouter } from "../routers/organization.js";
import { userRouter } from "../routers/user.js";

// tRPC API router
const appRouter = router({
  user: userRouter,
  organization: organizationRouter,
});

// HTTP router
const app = new Hono<AppContext>();

app.get("/", (c) => c.redirect("/api"));

// Root endpoint with API information
app.get("/api", (c) => {
  return c.json({
    name: "@repo/api",
    version: "0.0.0",
    endpoints: {
      trpc: "/api/trpc",
      auth: "/api/auth",
      health: "/health",
    },
    documentation: {
      trpc: "https://trpc.io",
      auth: "https://www.better-auth.com",
    },
  });
});

// Health check endpoint
app.get("/health", (c) => {
  return c.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// Authentication routes
app.on(["GET", "POST"], "/api/auth/*", (c) => {
  const auth = c.get("auth");
  if (!auth) {
    return c.json({ error: "Authentication service not initialized" }, 503);
  }
  return auth.handler(c.req.raw);
});

// tRPC API routes
app.use("/api/trpc/*", (c) => {
  return fetchRequestHandler({
    req: c.req.raw,
    router: appRouter,
    endpoint: "/api/trpc",
    async createContext({ req, resHeaders, info }) {
      const db = c.get("db");
      const dbDirect = c.get("dbDirect");
      const auth = c.get("auth");

      if (!db) {
        throw new Error("Database not available in context");
      }

      if (!dbDirect) {
        throw new Error("Direct database not available in context");
      }

      if (!auth) {
        throw new Error("Authentication service not available in context");
      }

      const sessionData = await auth.api.getSession({
        headers: req.headers,
      });

      return {
        req,
        res: c.res,
        resHeaders,
        info,
        env: c.env,
        db,
        dbDirect,
        session: sessionData?.session ?? null,
        user: sessionData?.user ?? null,
        cache: new Map(),
      };
    },
    batching: {
      enabled: true,
    },
    onError({ error, path }) {
      console.error("tRPC error on path", path, ":", error);
    },
  });
});

export { appRouter };
export type AppRouter = typeof appRouter;
export default app;
