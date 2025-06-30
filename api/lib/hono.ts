/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import type { CloudflareEnv, CloudflareVariables } from "@root/core/types";
import * as schema from "@root/db/schema";
import type { FetchHandlerOptions } from "@trpc/server/adapters/fetch";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { drizzle } from "drizzle-orm/d1";
import type { Context } from "hono";
import { appRouter, type AppRouter } from "../router.js";
import type { TRPCContext } from "./context.js";

/**
 * Creates a tRPC request handler for Hono.
 *
 * @example
 *   app.all("/api/trpc/*", (c) => {
 *     return createTRPCHandler(c, {
 *     endpoint: "/api/trpc",
 *       onError({ error, path }) {
 *         console.error("tRPC error on path", path, ":", error);
 *       },
 *       batching: { enabled: true },
 *     });
 *   })
 *
 * @see https://trpc.io/docs/server/adapters/fetch
 */
export function createTRPCHandler(
  c: Context<{ Bindings: CloudflareEnv; Variables: CloudflareVariables }>,
  options: Omit<
    FetchHandlerOptions<AppRouter>,
    "createContext" | "req" | "router"
  >,
) {
  return fetchRequestHandler({
    req: c.req.raw,
    router: appRouter,
    createContext({ req, resHeaders, info }): TRPCContext {
      return {
        req,
        res: c.res,
        resHeaders,
        env: c.env,
        info,
        db: drizzle(c.env.db, { schema }),
        session: c.get("session") ?? null,
        cache: new Map<string | symbol, unknown>(),
      };
    },
    batching: { enabled: true },
    onError({ error, path }) {
      console.error("tRPC error on path", path, ":", error);
    },
    ...options,
  });
}
