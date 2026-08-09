/**
 * @file Cloudflare Workers entrypoint.
 *
 * Initializes database and auth context, then mounts the core Hono app.
 */

import { Hono } from "hono";
import { logger } from "hono/logger";
import { requestId } from "hono/request-id";
import { secureHeaders } from "hono/secure-headers";
import app from "./lib/app.js";
import { createAuth } from "./lib/auth.js";
import type { AppContext } from "./lib/context.js";
import { createDb } from "./lib/db.js";
import type { Env } from "./lib/env.js";
import {
  errorHandler,
  notFoundHandler,
  requestIdGenerator,
} from "./lib/middleware.js";

type CloudflareEnv = {
  HYPERDRIVE_CACHED: Hyperdrive;
  HYPERDRIVE_UNCACHED: Hyperdrive;
} & Env;

const worker = new Hono<{
  Bindings: CloudflareEnv;
  Variables: AppContext["Variables"];
}>();

// Error and 404 handlers (must be on top-level app)
worker.onError(errorHandler);
worker.notFound(notFoundHandler);

// Standard middleware
worker.use(secureHeaders());
worker.use(requestId({ generator: requestIdGenerator }));
worker.use(logger());

// Initialize shared context for all requests
worker.use(async (c, next) => {
  const db = createDb(c.env.HYPERDRIVE_UNCACHED);
  const dbCached = createDb(c.env.HYPERDRIVE_CACHED);
  // Better Auth owns its own SQL, so it gets the default client: a session or
  // permission row read from cache could be seconds behind a sign-out or a
  // role change.
  const auth = createAuth(db, c.env);

  c.set("db", db);
  c.set("dbCached", dbCached);
  c.set("auth", auth);

  await next();
});

// Mount the core API app
worker.route("/", app);

export default worker;
