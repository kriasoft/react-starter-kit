/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { schema as Db } from "@root/db";
import { betterAuth } from "better-auth";
import type { DB } from "better-auth/adapters/drizzle";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { anonymous, organization } from "better-auth/plugins";
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
export function createAuth(
  db: DB,
  env: Pick<
    Env,
    "BETTER_AUTH_SECRET" | "GOOGLE_CLIENT_ID" | "GOOGLE_CLIENT_SECRET"
  >,
): ReturnType<typeof betterAuth> {
  return betterAuth({
    secret: env.BETTER_AUTH_SECRET,
    database: drizzleAdapter(db, {
      provider: "sqlite", // Or, use "pg" for PostgreSQL via Cloudflare Hyperdrive

      schema: {
        identity: Db.identity,
        invitation: Db.invitation,
        member: Db.member,
        organization: Db.organization,
        session: Db.session,
        user: Db.user,
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

    plugins: [
      anonymous(),
      organization({
        allowUserToCreateOrganization: true,
        organizationLimit: 5,
        creatorRole: "owner",
      }),
    ],
  });
}

export type Auth = ReturnType<typeof betterAuth>;
