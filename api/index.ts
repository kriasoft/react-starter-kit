/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { Hono } from "hono";

/**
 * Application router for Cloudflare Workers
 * @see https://honojs.dev/
 */
const app = new Hono<Env>();

// An example of forwarding HTTP requests to a 3rd party API
app.use("*", async ({ req }) => {
  const { pathname, search } = new URL(req.url);
  const targetUrl = `https://swapi.dev${pathname}${search}`;
  const targetReq = new Request(targetUrl, req);
  targetReq.headers.set("Accept", "application/json");
  return await fetch(targetReq);
});

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

export default app;
