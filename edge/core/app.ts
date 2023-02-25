/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { Hono } from "hono";

/**
 * Application router for Cloudflare Workers
 * @see https://honojs.dev/
 */
export const app = new Hono<Env>();
