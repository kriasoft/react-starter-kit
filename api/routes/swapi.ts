/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { app } from "../core/app.js";

// An example of forwarding HTTP requests to a 3rd party API
export const handler = app.use("/api/*", async ({ req }) => {
  const { pathname, search } = new URL(req.url);
  const targetUrl = `https://swapi.dev${pathname}${search}`;
  const targetReq = new Request(targetUrl, req);
  targetReq.headers.set("Accept", "application/json");
  return await fetch(targetReq);
});
