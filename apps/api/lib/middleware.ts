/**
 * @file Shared Hono middleware for both production and development entrypoints.
 */

import type { Context, ErrorHandler, NotFoundHandler } from "hono";
import { HTTPException } from "hono/http-exception";

/**
 * Global error handler for top-level Hono apps.
 *
 * Handles HTTPException specially (returns its response),
 * logs unexpected errors and returns a generic 500.
 */
export const errorHandler: ErrorHandler = (err, c) => {
  if (err instanceof HTTPException) {
    // getResponse() is not context-aware; merge headers from middleware
    const res = err.getResponse();
    const headers = new Headers(res.headers);
    c.res.headers.forEach((v, k) => headers.set(k, v));
    return new Response(res.body, {
      status: res.status,
      statusText: res.statusText,
      headers,
    });
  }
  console.error(`[${c.req.method}] ${c.req.path}:`, err);
  return c.json({ error: "Internal Server Error" }, 500);
};

/**
 * 404 handler for unmatched routes.
 *
 * Must be registered on top-level app (notFound on mounted sub-apps is ignored).
 */
export const notFoundHandler: NotFoundHandler = (c) => {
  return c.json({ error: "Not Found", path: c.req.path }, 404);
};

/**
 * Request ID generator using Cloudflare Ray ID when available.
 */
export function requestIdGenerator(c: Context): string {
  return c.req.header("cf-ray") ?? crypto.randomUUID();
}
