/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { app } from "../core/app";

export const handler = app.use("/__/*", async ({ req, env }) => {
  const url = new URL(req.url);
  const origin = `https://${env.GOOGLE_CLOUD_PROJECT}.web.app`;
  const res = await fetch(`${origin}${url.pathname}${url.search}`, req.raw);
  return res as unknown as Response;
});

export type FirebaseHandler = typeof handler;
