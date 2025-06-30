/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import type { Session, User } from "better-auth/types";

export type CloudflareEnv = Cloudflare.Env;

export type CloudflareVariables = {
  session?: Session | null;
  user?: User | null;
};
