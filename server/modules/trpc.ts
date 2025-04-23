/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { Firestore } from "@google-cloud/firestore";
import { TRPCError, initTRPC } from "@trpc/server";
import { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { Logger } from "pino";
import { SetNonNullable } from "type-fest";
import { ZodError } from "zod";
import { DecodedIdToken } from "./auth";
import { env } from "./env";
import { getFirestore } from "./firestore";
import { logger } from "./logging";

/**
 * tRPC instance.
 *
 * @see https://trpc.io/docs/quickstart
 */
export const t = initTRPC.context<typeof createContext>().create({
  isDev: env.isDev,

  // https://trpc.io/docs/server/error-formatting
  errorFormatter(opts) {
    const { shape, error } = opts;
    return {
      ...shape,
      data: {
        ...shape.data,
        ...(error.code === "BAD_REQUEST" &&
          error.cause instanceof ZodError && {
            zodError: error.cause.flatten(),
          }),
      },
    };
  },
});

/**
 * Creates a tRPC context for an incoming HTTP request.
 */
export async function createContext(
  ctx: CreateExpressContextOptions,
): Promise<Context> {
  return new HttpContext(getFirestore(), ctx.req.log, ctx.req.token);
}

/**
 * Creates a tRPC context for an incoming WebSocket request.
 */
export async function createWsContext(): Promise<Context> {
  return new WsContext(getFirestore(), logger);
}

class HttpContext {
  constructor(
    readonly db: Firestore,
    readonly log: Logger,
    readonly token: DecodedIdToken | null,
  ) {}
}

class WsContext {
  constructor(
    readonly db: Firestore,
    readonly log: Logger,
  ) {}

  get token(): DecodedIdToken | null {
    throw new Error("ID token is not available in WebSocket context.");
  }
}

/**
 * Ensures that the user is authenticated.
 */
export const authorize = t.middleware((opts) => {
  if (!opts.ctx.token) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return opts.next({
    ...opts,
    ctx: opts.ctx as SetNonNullable<Context, "token">,
  });
});

/**
 * Ensures that the user is an admin.
 */
export const authorizeAdmin = authorize.unstable_pipe((opts) => {
  if (!opts.ctx.token.admin) {
    throw new TRPCError({ code: "FORBIDDEN" });
  }

  return opts.next(opts);
});

/**
 * tRPC context.
 */
export type Context = HttpContext;
