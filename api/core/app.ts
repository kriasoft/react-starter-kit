/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { Hono } from "hono";

/**
 * Application router for Cloudflare Workers
 * @see https://honojs.dev/
 */
export const app = new Hono<Env>();

app.onError((err, ctx) => {
  return ctx.json(
    {
      message: (err as Error).message ?? "Application Error",
      stack: ctx.env.APP_ENV === "prod" ? undefined : (err as Error).stack,
    },
    500,
    {
      "Content-Type": "application/json",
    },
  );
});
