/**
 * Local development server for the API with Cloudflare D1 database support.
 *
 * @remarks
 * This file bootstraps a local Cloudflare Workers environment using Wrangler's
 * getPlatformProxy, allowing you to develop against a real D1 database instance
 * locally without deploying to Cloudflare.
 *
 * Features:
 * - Emulates Cloudflare Workers runtime environment
 * - Provides access to D1 database bindings
 * - Persists database state between restarts
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

import type { CloudflareEnv } from "@root/core/types/index.js";
import { Hono } from "hono";
import { getPlatformProxy } from "wrangler";
import api from "./index.js";
import { createAuth } from "./lib/auth.js";
import type { AppContext } from "./lib/context.js";
import { createD1Db } from "./lib/d1.js";

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
 * For local development, this uses a direct PostgreSQL connection.
 * In production, the edge deployment uses Hyperdrive for acceleration.
 */
app.use("*", async (c, next) => {
  const db = createD1Db(cf.env.DB);
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
