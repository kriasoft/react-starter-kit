/**
 * @file Better Auth client instance.
 *
 * Do not use auth.useSession() directly - use TanStack Query wrappers
 * from lib/queries/session.ts to ensure proper caching and consistency.
 */

import { passkeyClient } from "@better-auth/passkey/client";
import {
  anonymousClient,
  emailOTPClient,
  organizationClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { authConfig } from "./auth-config";

const baseURL =
  typeof window !== "undefined"
    ? window.location.origin
    : "http://localhost:5173";

export const auth = createAuthClient({
  baseURL: baseURL + authConfig.api.basePath,
  plugins: [
    anonymousClient(),
    emailOTPClient(),
    organizationClient(),
    passkeyClient(),
  ],
});

export type AuthClient = typeof auth;

// Inferred types from configured instance - includes plugin extensions
// $Infer.Session is the full response shape { user, session }
type SessionResponse = typeof auth.$Infer.Session;
export type User = SessionResponse["user"];
export type Session = SessionResponse["session"];
