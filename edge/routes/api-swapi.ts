/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { app } from "../core/app.js";

// Rewrite HTTP requests starting with "/api/"
// to the Star Wars API as an example
export const handler = app.use("/api/*", async ({ req }) => {
  const { pathname, search } = new URL(req.url);
  const res = await fetch(
    `https://swapi.dev${pathname}${search}`,
    req.raw as RequestInit<RequestInitCfProperties>,
  );
  return res as unknown as Response;
});

export type SwapiHandler = typeof handler;
