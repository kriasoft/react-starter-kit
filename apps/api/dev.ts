/**
 * Local development server that emulates Cloudflare Workers runtime with Neon database.
 *
 * WARNING: This file uses getPlatformProxy which requires wrangler.jsonc configuration.
 * Hyperdrive bindings must be configured for both HYPERDRIVE_CACHED and HYPERDRIVE_DIRECT.
 *
 * @example
 * ```bash
 * bun --filter @repo/api dev
 * bun --filter @repo/api dev --env=staging  # Use staging environment config
 * ```
 *
 * SPDX-FileCopyrightText: 2014-present Kriasoft
 * SPDX-License-Identifier: MIT
 */

import { Hono } from "hono";
import { parseArgs } from "node:util";
import { getPlatformProxy } from "wrangler";
import api from "./index.js";
import { createAuth } from "./lib/auth.js";
import type { AppContext } from "./lib/context.js";
import { createDb } from "./lib/db.js";
import type { Env } from "./lib/env.js";

const { values: args } = parseArgs({
  args: Bun.argv.slice(2),
  options: {
    env: { type: "string" },
  },
});

type CloudflareEnv = {
  HYPERDRIVE_CACHED: Hyperdrive;
  HYPERDRIVE_DIRECT: Hyperdrive;
} & Env;

// [INITIALIZATION]
const app = new Hono<AppContext>();

// NOTE: persist:true maintains D1 state across restarts (.wrangler directory)
// Environment defaults to 'dev' unless --env flag is provided
const cf = await getPlatformProxy<CloudflareEnv>({
  configPath: "./wrangler.jsonc",
  environment: args.env ?? "dev",
  persist: true,
});

// [CONTEXT INJECTION]
// Creates two database connections per request:
// - db: Uses Hyperdrive caching (read-heavy queries)
// - dbDirect: Bypasses cache (write operations, transactions)
app.use("*", async (c, next) => {
  const db = createDb(cf.env.HYPERDRIVE_CACHED);
  const dbDirect = createDb(cf.env.HYPERDRIVE_DIRECT);

  // Priority: Cloudflare bindings > process.env > empty string
  // Required for local dev where secrets aren't in wrangler.jsonc
  const secretKeys = [
    "BETTER_AUTH_SECRET",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "OPENAI_API_KEY",
    "RESEND_API_KEY",
    "RESEND_EMAIL_FROM",
  ] as const;

  const env = {
    ...cf.env,
    ...Object.fromEntries(
      secretKeys.map((key) => [key, (process.env[key] || cf.env[key]) ?? ""]),
    ),
    APP_NAME: process.env.APP_NAME || cf.env.APP_NAME || "Example",
    APP_ORIGIN:
      // Prefer origin set by `apps/app` at runtime
      c.req.header("x-forwarded-origin") ||
      process.env.APP_ORIGIN ||
      c.env.APP_ORIGIN ||
      "http://localhost:5173",
  };

  c.set("db", db);
  c.set("dbDirect", dbDirect);
  c.set("auth", createAuth(db, env));
  await next();
});

// Routes from ./index.js mounted at root
app.route("/", api);

export default app;
