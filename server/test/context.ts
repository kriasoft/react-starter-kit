/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { Firestore } from "@google-cloud/firestore";
import {
  AnyRootConfig,
  AnyRouterDef,
  Router,
  createCallerFactory,
} from "@trpc/server";
import { testUsers } from "db";
import { IdTokenClient } from "google-auth-library";
import { auth } from "../core/auth";
import { env } from "../core/env";
import { getFirestore } from "../core/firestore";
import { logger } from "../core/logging";
import { Context } from "../core/trpc";

let idTokenClient: IdTokenClient | undefined;

export async function getIdToken(audience: string) {
  idTokenClient = idTokenClient ?? (await auth.getIdTokenClient(audience));
  return await idTokenClient.idTokenProvider.fetchIdToken(audience);
}

/**
 * Create a tRPC context for unit testing.
 */
export function createContext(options?: ContextOptions): Context {
  const user = testUsers.find((u) => u.screenName === options?.user);
  const now = Math.floor(Date.now() / 1000);

  if (options?.user && !user) {
    throw new Error(`User not found: ${options.user}`);
  }

  return {
    db: options?.db ?? getFirestore(),
    log: logger,
    token: user
      ? {
          uid: user.localId,
          sub: user.localId,
          email: user.email,
          email_verified: user.emailVerified,
          aud: env.GOOGLE_CLOUD_PROJECT,
          iss: `https://securetoken.google.com/${env.GOOGLE_CLOUD_PROJECT}`,
          iat: now,
          exp: now + 3600,
          auth_time: parseInt(user.lastLoginAt!, 10),
          firebase: {
            identities: {},
            sign_in_provider: "google.com",
          },
          ...(user.customAttributes && JSON.parse(user.customAttributes)),
        }
      : null,
  };
}

export function createClient<
  TRouter extends Router<AnyRouterDef<AnyRootConfig>>,
>(router: TRouter, options?: ContextOptions) {
  const createCaller = createCallerFactory();
  const ctx = createContext(options);
  const client = createCaller(router)(ctx);
  return [client, ctx] as const;
}

// #region Types

type ContextOptions = {
  /**
   * The user to impersonate. Use `dan` if you need admin permissions.
   */
  user?: "erika" | "ryan" | "marian" | "kurt" | "dan";
  db?: Firestore;
};

// #endregion Types
