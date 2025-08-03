/**
 * This file exports a Hono application that serves as the main API router.
 * It integrates tRPC for type-safe API endpoints and includes authentication routes.
 * The design allows for flexible deployment, either as a standalone service or
 * as part of an edge environment like Cloudflare Workers.
 *
 * SPDX-FileCopyrightText: 2014-present Kriasoft
 * SPDX-License-Identifier: MIT
 */

import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { Hono } from "hono";
import type { AppContext } from "./lib/context.js";
import { router } from "./lib/trpc.js";
import { organizationRouter } from "./routers/organization.js";
import { userRouter } from "./routers/user.js";

// tRPC API router
const appRouter = router({
  user: userRouter,
  organization: organizationRouter,
});

// HTTP router
const app = new Hono<AppContext>();

/*
 * Middleware for initializing database and authentication services.
 *
 * This section is commented out by default. It should be enabled when
 * deploying the `api` package as a standalone service (e.g., to Google Cloud Run).
 *
 * When this API is deployed as part of the `edge` package (Cloudflare Workers),
 * the `db` and `auth` context variables are initialized upstream.
 */
// app.use("*", async (c, next) => {
//   c.set("db", drizzle(...));
//   c.set("auth", createAuth(c.get("db"), c.env));
//   await next();
// });

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
      const auth = c.get("auth");

      if (!db) {
        throw new Error("Database not available in context");
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

export { getOpenAI } from "./lib/ai.js";
export { createAuth } from "./lib/auth.js";
export { createDb } from "./lib/db.js";
export { appRouter };

export type { AppContext } from "./lib/context.js";
export type AppRouter = typeof appRouter;

export default app;
