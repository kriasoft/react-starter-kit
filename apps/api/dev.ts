/**
 * @file Local development server emulating Cloudflare Workers runtime.
 *
 * Requires wrangler.jsonc with HYPERDRIVE_CACHED and HYPERDRIVE_DIRECT bindings.
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
import type { Env } from "./lib/env.js";
import { errorHandler, notFoundHandler } from "./lib/middleware.js";

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

type PlatformProxy = {
  env: CloudflareEnv;
};

type ProcessReport = {
  header?: {
    glibcVersionRuntime?: string;
  };
};

const WORKERD_MIN_GLIBC_VERSION = "2.35";

const requiredLocalEnvKeys = [
  "APP_ORIGIN",
  "DATABASE_URL",
  "BETTER_AUTH_SECRET",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "OPENAI_API_KEY",
  "RESEND_API_KEY",
  "RESEND_EMAIL_FROM",
] as const;

function getRequiredProcessEnv(key: string) {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required local environment variable: ${key}`);
  }
  return value;
}

function getEnvironment(): Env["ENVIRONMENT"] {
  const value = process.env.ENVIRONMENT ?? "development";
  if (
    value !== "production" &&
    value !== "staging" &&
    value !== "preview" &&
    value !== "development"
  ) {
    throw new Error(`Invalid ENVIRONMENT value: ${value}`);
  }
  return value;
}

function getActiveSoftBearerMode(): Env["ACTIVESOFT_USE_BEARER"] {
  return process.env.ACTIVESOFT_USE_BEARER === "false" ? "false" : "true";
}

function getLocalHyperdrive(binding: string, fallbackConnectionString: string) {
  const connectionString =
    process.env[`CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_${binding}`] ||
    fallbackConnectionString;

  return { connectionString } as Hyperdrive;
}

function compareVersions(left: string, right: string) {
  const leftParts = left.split(".").map(Number);
  const rightParts = right.split(".").map(Number);
  const length = Math.max(leftParts.length, rightParts.length);

  for (let index = 0; index < length; index += 1) {
    const leftPart = leftParts[index] ?? 0;
    const rightPart = rightParts[index] ?? 0;

    if (leftPart > rightPart) return 1;
    if (leftPart < rightPart) return -1;
  }

  return 0;
}

function getUnsupportedGlibcError() {
  const report = process.report?.getReport?.() as ProcessReport | undefined;
  const glibcVersion = report?.header?.glibcVersionRuntime;

  if (
    glibcVersion &&
    compareVersions(glibcVersion, WORKERD_MIN_GLIBC_VERSION) < 0
  ) {
    return new Error(
      `local glibc ${glibcVersion} is older than workerd requirement ${WORKERD_MIN_GLIBC_VERSION}`,
    );
  }

  return null;
}

function createLocalPlatformProxy(error: unknown): PlatformProxy {
  const databaseUrl = getRequiredProcessEnv("DATABASE_URL");
  const requiredEnv = Object.fromEntries(
    requiredLocalEnvKeys.map((key) => [key, getRequiredProcessEnv(key)]),
  ) as Pick<Env, (typeof requiredLocalEnvKeys)[number]>;

  const reason = error instanceof Error ? error.message : String(error);
  console.warn(
    [
      "Wrangler platform proxy is unavailable; using direct local Hyperdrive connection strings.",
      `Reason: ${reason}`,
      "Cloudflare-only runtime behavior is not emulated in this fallback.",
    ].join("\n"),
  );

  return {
    env: {
      ...requiredEnv,
      ENVIRONMENT: getEnvironment(),
      APP_NAME: process.env.APP_NAME || "Clara",
      HYPERDRIVE_CACHED: getLocalHyperdrive("HYPERDRIVE_CACHED", databaseUrl),
      HYPERDRIVE_DIRECT: getLocalHyperdrive("HYPERDRIVE_DIRECT", databaseUrl),
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
      STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
      STRIPE_STARTER_PRICE_ID: process.env.STRIPE_STARTER_PRICE_ID,
      STRIPE_PRO_PRICE_ID: process.env.STRIPE_PRO_PRICE_ID,
      STRIPE_PRO_ANNUAL_PRICE_ID: process.env.STRIPE_PRO_ANNUAL_PRICE_ID,
      ACTIVESOFT_API_URL: process.env.ACTIVESOFT_API_URL,
      ACTIVESOFT_API_KEY: process.env.ACTIVESOFT_API_KEY,
      ACTIVESOFT_USE_BEARER: getActiveSoftBearerMode(),
    },
  };
}

async function createPlatformProxy(): Promise<PlatformProxy> {
  const unsupportedGlibcError = getUnsupportedGlibcError();
  if (unsupportedGlibcError) {
    return createLocalPlatformProxy(unsupportedGlibcError);
  }

  try {
    // persist:true maintains state across restarts in .wrangler directory
    return await getPlatformProxy<CloudflareEnv>({
      configPath: "./wrangler.jsonc",
      environment: args.env ?? "dev",
      persist: true,
    });
  } catch (error) {
    return createLocalPlatformProxy(error);
  }
}

const app = new Hono<AppContext>();

// Error and 404 handlers (must be on top-level app)
app.onError(errorHandler);
app.notFound(notFoundHandler);

// Standard middleware
app.use(secureHeaders());
app.use(requestId());
app.use(logger());

const cf = await createPlatformProxy();

// Inject context with two database connections:
// - db: Hyperdrive caching for read-heavy queries
// - dbDirect: No cache for writes and transactions
app.use(async (c, next) => {
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
    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET",
    "STRIPE_STARTER_PRICE_ID",
    "STRIPE_PRO_PRICE_ID",
    "STRIPE_PRO_ANNUAL_PRICE_ID",
    "ACTIVESOFT_API_URL",
    "ACTIVESOFT_API_KEY",
    "ACTIVESOFT_USE_BEARER",
  ] as const;

  const env = {
    ...cf.env,
    ...Object.fromEntries(
      secretKeys.map((key) => [key, process.env[key] || cf.env[key]]),
    ),
    APP_NAME: process.env.APP_NAME || cf.env.APP_NAME || "Clara",
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
