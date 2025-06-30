/**
 * Environment-aware CORS middleware for Cloudflare Workers.
 * Development allows localhost, production uses ALLOWED_ORIGINS only.
 *
 * SPDX-FileCopyrightText: 2014-present Kriasoft
 * SPDX-License-Identifier: MIT
 */

import type { CloudflareEnv } from "@root/core/types";
import type { Context, MiddlewareHandler } from "hono";
import { cors } from "hono/cors";
import { isDevelopment, isLocalDevelopment } from "./environment";

function parseAllowedOrigins(env: CloudflareEnv): string[] {
  return env.ALLOWED_ORIGINS
    ? env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
    : [];
}

function createOriginValidator() {
  return function validateOrigin(
    origin: string,
    c: Context,
  ): string | undefined | null {
    if (!origin) return null;

    const env = c.env as CloudflareEnv;
    if (isDevelopment(env) && isLocalDevelopment(origin)) {
      return origin;
    }

    const allowedOrigins = parseAllowedOrigins(env);
    return allowedOrigins.includes(origin) ? origin : null;
  };
}

export function createCorsConfig(
  env: CloudflareEnv,
  options: {
    additionalHeaders?: string[];
    additionalMethods?: string[];
  } = {},
) {
  const { additionalHeaders = [], additionalMethods = [] } = options;

  return {
    origin: createOriginValidator(),
    credentials: true,
    allowHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
      ...additionalHeaders,
    ],
    allowMethods: ["GET", "POST", "OPTIONS", ...additionalMethods],
    exposeHeaders: ["Content-Type", "Set-Cookie"],
  };
}

const corsCache = new Map<string, MiddlewareHandler>();

function getCachedCors(
  cacheKey: string,
  configFactory: () => MiddlewareHandler,
): MiddlewareHandler {
  if (!corsCache.has(cacheKey)) {
    corsCache.set(cacheKey, configFactory());
  }
  return corsCache.get(cacheKey)!;
}

function createCorsMiddleware(
  type: string,
  config?: { additionalHeaders?: string[] },
): MiddlewareHandler {
  return (c: Context, next) => {
    const env = c.env as CloudflareEnv;
    const envKey = (env.ENVIRONMENT ?? "dev").replace(/[^a-zA-Z0-9]/g, "_");
    const originsKey = (env.ALLOWED_ORIGINS ?? "none").replace(
      /[^a-zA-Z0-9,]/g,
      "_",
    );
    const cacheKey = `${type}-${envKey}-${originsKey}`;
    const corsMiddleware = getCachedCors(cacheKey, () =>
      cors(createCorsConfig(env, config)),
    );
    return corsMiddleware(c, next);
  };
}

export function authCors(): MiddlewareHandler {
  return createCorsMiddleware("auth");
}

export function trpcCors(): MiddlewareHandler {
  return createCorsMiddleware("trpc", {
    additionalHeaders: ["trpc-batch-mode"],
  });
}

export function chatCors(): MiddlewareHandler {
  return createCorsMiddleware("chat");
}
