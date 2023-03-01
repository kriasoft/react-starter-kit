/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { app } from "../core/app.js";

// Rewrite HTTP requests starting with "/api/"
// to the Star Wars API as an example
export const handler = app.use("/api/*", ({ req }) => {
  const { pathname, search } = new URL(req.url);
  return fetch(
    `https://swapi.dev${pathname}${search}`,
    req.raw as RequestInit<RequestInitCfProperties>,
  );
});

export type SwapiHandler = typeof handler;
