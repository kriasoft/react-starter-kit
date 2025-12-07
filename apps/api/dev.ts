/**
 * @file Local development server emulating Cloudflare Workers runtime.
 *
 * Requires wrangler.jsonc with HYPERDRIVE_CACHED and HYPERDRIVE_DIRECT bindings.
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

const app = new Hono<AppContext>();

// persist:true maintains state across restarts in .wrangler directory
const cf = await getPlatformProxy<CloudflareEnv>({
  configPath: "./wrangler.jsonc",
  environment: args.env ?? "dev",
  persist: true,
});

// Inject context with two database connections:
// - db: Hyperdrive caching for read-heavy queries
// - dbDirect: No cache for writes and transactions
app.use("*", async (c, next) => {
  const db = createDb(cf.env.HYPERDRIVE_CACHED);
  const dbDirect = createDb(cf.env.HYPERDRIVE_DIRECT);

  // Merge secrets from process.env (local dev) with Cloudflare bindings
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

app.route("/", api);

export default app;
