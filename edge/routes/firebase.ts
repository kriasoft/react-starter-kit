/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { app } from "../core/app.js";

export const handler = app.all("/__/*", ({ req, env }) => {
  const url = new URL(req.url);
  const origin = `https://${env.GOOGLE_CLOUD_PROJECT}.web.app`;
  return fetch(`${origin}${url.pathname}${url.search}`, req);
});

export type FirebaseHandler = typeof handler;
