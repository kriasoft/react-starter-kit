/**
 * Local development server for the API with Neon database support via Hyperdrive.
 *
 * @remarks
 * This file bootstraps a local Cloudflare Workers environment using Wrangler's
 * getPlatformProxy, allowing you to develop against a Neon database instance
 * locally with Hyperdrive bindings.
 *
 * Features:
 * - Emulates Cloudflare Workers runtime environment
 * - Provides access to Hyperdrive bindings for Neon PostgreSQL
 * - Connection pooling via Hyperdrive
 * - Hot reloading support for rapid development
 *
 * @example
 * Start the development server:
 * ```bash
 * bun --cwd api dev
 * ```
 *
 * SPDX-FileCopyrightText: 2014-present Kriasoft
 * SPDX-License-Identifier: MIT
 */

import { Hono } from "hono";
import { getPlatformProxy } from "wrangler";
import api from "./index.js";
import { createAuth } from "./lib/auth.js";
import type { AppContext } from "./lib/context.js";
import { createDb } from "./lib/db.js";
import type { Env } from "./lib/env.js";

type CloudflareEnv = {
  HYPERDRIVE: Hyperdrive;
  HYPERDRIVE_DIRECT: Hyperdrive;
} & Env;

/**
 * Initialize the local development server with Cloudflare bindings.
 */
const app = new Hono<AppContext>();

/**
 * Create a local Cloudflare environment proxy.
 *
 * @remarks
 * - Reads configuration from wrangler.jsonc in the parent directory
 * - Enables persistence to maintain D1 database state across restarts
 * - Provides access to all Cloudflare bindings defined in wrangler.jsonc
 */
const cf = await getPlatformProxy<CloudflareEnv>({
  configPath: "../wrangler.jsonc",
  persist: true,
});

/**
 * Middleware to inject database binding into request context.
 *
 * @remarks
 * Uses Neon PostgreSQL via Hyperdrive for both local development
 * and production deployment with connection pooling and caching.
 */
app.use("*", async (c, next) => {
  const db = createDb(cf.env.HYPERDRIVE);
  c.set("db", db);
  c.set("auth", createAuth(db, cf.env));
  await next();
});

/**
 * Mount the main API routes.
 * All routes defined in ./index.js will be available at the root path.
 */
app.route("/", api);

export default app;
