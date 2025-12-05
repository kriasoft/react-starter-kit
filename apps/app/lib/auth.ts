/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { passkeyClient } from "@better-auth/passkey/client";
import {
  anonymousClient,
  emailOTPClient,
  organizationClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { authConfig } from "./auth-config";

/**
 * ARCHITECTURE: Better Auth Client Configuration
 *
 * WARNING: Do NOT use auth.useSession() directly.
 * Instead, use TanStack Query wrappers in lib/queries/session.ts:
 * - useSessionQuery() - for components that handle loading states
 * - useSuspenseSessionQuery() - for components with Suspense boundaries
 *
 * WHY: Native hooks bypass our caching layer causing:
 * - Duplicate network requests
 * - State inconsistency between components
 * - Missing optimistic updates and error boundaries
 *
 * SAFE MODIFICATIONS: Add plugins to the array, but maintain existing ones.
 * Config changes should be made in auth-config.ts, not here.
 */

// Get the base URL from environment variable or use default for development
const baseURL =
  typeof window !== "undefined"
    ? window.location.origin
    : "http://localhost:5173";

/**
 * Auth client for use throughout the app.
 */
export const auth = createAuthClient({
  baseURL: baseURL + authConfig.api.basePath,
  plugins: [
    anonymousClient(),
    emailOTPClient(),
    organizationClient(),
    passkeyClient(),
  ],
});

/** Auth client type for router context */
export type AuthClient = typeof auth;
