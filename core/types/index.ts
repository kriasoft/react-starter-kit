/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import type { Session } from "better-auth/types";

export type CloudflareEnv = Cloudflare.Env & {
  // Cloudflare Workers secret bindings
  BETTER_AUTH_SECRET: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  OPENAI_API_KEY: string;
};

export type CloudflareVariables = {
  session?: Session | null;
};
