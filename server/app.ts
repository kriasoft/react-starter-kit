/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { createExpressMiddleware } from "@trpc/server/adapters/express";
import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { sessionMiddleware } from "./core/auth";
import { env } from "./core/env";
import { loggerMiddleware } from "./core/logging";
import { createContext } from "./core/trpc";
import { router } from "./routes/index";

export const app = express();

app.disable("x-powered-by");
app.set("trust proxy", 1); // Trust first proxy

app.use(loggerMiddleware);
app.use(sessionMiddleware);

/**
 * tRPC HTTP handler for Express.js.
 *
 * @see https://trpc.io/docs/getting-started
 * @see https://trpc.io/docs/server/adapters/express
 */
app.use("/trpc", createExpressMiddleware({ router, createContext }));

/**
 * Proxy auth requests to Google Identity Platform.
 *
 * @see https://firebase.google.com/docs/auth/web/redirect-best-practices
 */
app.use(
  createProxyMiddleware("/__", {
    target: `https://${env.GOOGLE_CLOUD_PROJECT}.firebaseapp.com`,
    changeOrigin: true,
    logLevel: "warn",
  }),
);

/**
 * Proxy static assets to Google Cloud Storage.
 */
app.use(
  createProxyMiddleware("/", {
    target: "https://c.storage.googleapis.com",
    changeOrigin: true,
    logLevel: "warn",
    onProxyReq(proxyReq) {
      proxyReq.setHeader("host", env.APP_STORAGE_BUCKET);
    },
  }),
);
