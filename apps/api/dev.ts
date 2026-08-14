/**
 * @file Local development server emulating Cloudflare Workers runtime.
 *
 * Requires wrangler.jsonc with HYPERDRIVE_CACHED and HYPERDRIVE_UNCACHED bindings.
 */

import { Hono } from "hono";
import { logger } from "hono/logger";
import { requestId } from "hono/request-id";
import { secureHeaders } from "hono/secure-headers";
import { parseArgs } from "node:util";
import { getPlatformProxy } from "wrangler";
import api from "./index.js";
import { createAuth } from "./lib/auth.js";
import type { AppContext } from "./lib/context.js";
import { createDb } from "./lib/db.js";
import { envSchema, type Env } from "./lib/env.js";
import { errorHandler, notFoundHandler } from "./lib/middleware.js";

const { values: args } = parseArgs({
  args: Bun.argv.slice(2),
  options: {
    env: { type: "string" },
  },
});

type CloudflareEnv = {
  HYPERDRIVE_CACHED: Hyperdrive;
  HYPERDRIVE_UNCACHED: Hyperdrive;
} & Env;

/**
 * Fields whose precedence is handled separately from the generic local-env
 * overlay below.
 */
const SPECIAL_ENV_KEYS = new Set(["ENVIRONMENT", "APP_ORIGIN"]);

const localEnvKeys = Object.keys(envSchema.shape).filter(
  (key) => !SPECIAL_ENV_KEYS.has(key),
);

const app = new Hono<AppContext>();

// Error and 404 handlers (must be on top-level app)
app.onError(errorHandler);
app.notFound(notFoundHandler);

// Standard middleware
app.use(secureHeaders());
app.use(requestId());
app.use(logger());

// persist:true maintains state across restarts in .wrangler directory
const cf = await getPlatformProxy<CloudflareEnv>({
  configPath: "./wrangler.jsonc",
  environment: args.env ?? "dev",
  persist: true,
});

// Inject context with two database connections:
// - db: always fresh, the default for everything
// - dbCached: Hyperdrive query caching, opt-in for read-heavy queries
app.use(async (c, next) => {
  const db = createDb(cf.env.HYPERDRIVE_UNCACHED);
  const dbCached = createDb(cf.env.HYPERDRIVE_CACHED);

  // Prefer local .env values for the remaining schema fields, falling back to
  // Cloudflare bindings. Deriving the keys keeps new fields in this merge.
  const env = {
    ...cf.env,
    ...Object.fromEntries(
      localEnvKeys.map((key) => [
        key,
        process.env[key] || cf.env[key as keyof typeof cf.env],
      ]),
    ),
    APP_ORIGIN:
      c.req.header("x-forwarded-origin") ||
      process.env.APP_ORIGIN ||
      c.env.APP_ORIGIN ||
      "http://localhost:5173",
  };

  c.set("db", db);
  c.set("dbCached", dbCached);
  c.set("auth", createAuth(db, env)); // Uncached, as in worker.ts
  await next();
});

app.route("/", api);

export default app;
