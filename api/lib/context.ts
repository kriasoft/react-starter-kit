/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import type { CloudflareEnv } from "@root/core/types";
import type { CreateHTTPContextOptions } from "@trpc/server/adapters/standalone";
import type { Session } from "better-auth/types";
import { drizzle } from "drizzle-orm/d1";

export type TRPCContext = {
  req: Request;
  info: CreateHTTPContextOptions["info"];
  db: ReturnType<typeof drizzle>;
  session: Session | null;
  cache: Map<string | symbol, unknown>;
  res?: Response; // Optional response object for Hono
  resHeaders?: Headers; // Optional headers for Hono
  env?: CloudflareEnv; // Environment variables for Cloudflare
};
