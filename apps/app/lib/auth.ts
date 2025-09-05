/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import {
  anonymousClient,
  emailOTPClient,
  organizationClient,
  passkeyClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { authConfig } from "./auth-config";

/**
 * ARCHITECTURE: Better Auth Client Configuration
 *
 * This is the single Better Auth client instance used throughout the app.
 *
 * WARNING: Do NOT use the native useSession hook exported here.
 * Instead, use our TanStack Query wrappers in lib/queries/session.ts:
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

// Create the auth client with plugins and configuration
export const authClient = createAuthClient({
  baseURL: baseURL + authConfig.api.basePath,
  plugins: [
    anonymousClient(),
    emailOTPClient(),
    organizationClient(),
    passkeyClient(),
  ],
});

// Alias for brevity - use either 'auth' or 'authClient' based on preference
export const auth = authClient;

// Export commonly used hooks and methods
// NOTE: Prefer TanStack Query wrappers over useSession for consistency
export const { useSession, signIn, signOut, signUp, getSession } = authClient;
