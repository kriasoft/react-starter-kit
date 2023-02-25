/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { app } from "../core/app.js";

export const handler = app.get("/echo", ({ json, req }) => {
  return json({
    headers: Object.fromEntries(req.headers.entries()),
    cf: req.raw.cf,
  });
});

export type EchoHandler = typeof handler;
