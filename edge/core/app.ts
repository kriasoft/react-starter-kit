/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { Hono } from "hono";

/**
 * Application router for Cloudflare Workers
 * @see https://honojs.dev/
 */
export const app = new Hono<Env>();

app.onError((err, ctx) => {
  console.error(err.stack);
  return ctx.text(err.stack ?? "Application error", 500, {
    "Content-Type": "text/plain",
  });
});
