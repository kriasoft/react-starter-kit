/**
 * Cloudflare Workers entry point for the API.
 *
 * This module configures the core API app with Cloudflare Workers-specific
 * context initialization, including Hyperdrive database bindings and
 * authentication setup.
 *
 * SPDX-FileCopyrightText: 2014-present Kriasoft
 * SPDX-License-Identifier: MIT
 */

import { Hono } from "hono";
import app from "./lib/app.js";
import { createAuth } from "./lib/auth.js";
import type { AppContext } from "./lib/context.js";
import { createDb } from "./lib/db.js";
import type { Env } from "./lib/env.js";

type CloudflareEnv = {
  HYPERDRIVE_CACHED: Hyperdrive;
  HYPERDRIVE_DIRECT: Hyperdrive;
} & Env;

// Create a Hono app with Cloudflare Workers context
const worker = new Hono<{
  Bindings: CloudflareEnv;
  Variables: AppContext["Variables"];
}>();

// Initialize shared context for all requests
worker.use("*", async (c, next) => {
  // Initialize database using Neon via Hyperdrive
  const db = createDb(c.env.HYPERDRIVE_CACHED);
  const dbDirect = createDb(c.env.HYPERDRIVE_DIRECT);

  // Initialize auth
  const auth = createAuth(db, c.env);

  // Set context variables
  c.set("db", db);
  c.set("dbDirect", dbDirect);
  c.set("auth", auth);

  await next();
});

// Mount the core API app
worker.route("/", app);

export default worker;
