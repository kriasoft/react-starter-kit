/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { schema as Db } from "@root/db";
import { betterAuth } from "better-auth";
import type { DB } from "better-auth/adapters/drizzle";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { anonymous } from "better-auth/plugins";
import type { Env } from "./env";

/**
 * Creates an authentication instance using Better Auth with Drizzle ORM.
 *
 * @link {https://www.better-auth.com/}
 * @link {https://www.better-auth.com/llms.txt}
 *
 * @param db The Drizzle ORM database instance.
 * @param env The environment variables.
 * @returns An instance of the Better Auth service.
 */
export function createAuth(db: DB, env: Env) {
  return betterAuth({
    secret: env.BETTER_AUTH_SECRET,
    database: drizzleAdapter(db, {
      provider: "pg", // Use "pg" for PostgreSQL via Hyperdrive
      schema: {
        user: Db.user,
        session: Db.session,
        identity: Db.identity,
        verification: Db.verification,
      },
    }),

    account: {
      modelName: "identity",
    },

    // Email and password authentication
    emailAndPassword: {
      enabled: true,
    },

    // OAuth providers
    socialProviders: {
      google: {
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
      },
    },

    plugins: [anonymous()],
  });
}

export type Auth = ReturnType<typeof createAuth>;
