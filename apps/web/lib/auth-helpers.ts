/**
 * @file Authentication helper utilities for web worker
 *
 * Contains reusable functions for handling Better Auth session validation
 * and cache control for authentication-dependent content.
 */

import type { BetterAuthApiResponse, BetterAuthSession } from "../types/env";

/**
 * Better Auth default cookie names
 *
 * - SESSION: Standard cookie name for HTTP
 * - SESSION_SECURE: Secure cookie name for HTTPS with __Secure- prefix
 */
export const COOKIE_NAMES = {
  SESSION: "better-auth.session_token",
  SESSION_SECURE: "__Secure-better-auth.session_token",
} as const;

/**
 * Set cache control headers to prevent caching of auth-dependent content
 *
 * Headers set:
 * - Cache-Control: private, no-store
 *   - private: Only browser can cache, not CDN
 *   - no-store: Don't cache at all
 * - Vary: Cookie
 *   - Cache key varies by cookie value
 *
 * This prevents CDN/browser from serving cached authenticated content
 * to unauthenticated users (or vice versa), which would be a security issue.
 *
 * @param response - The Response object to modify
 * @returns The same Response object with cache headers set
 *
 * @example
 * ```ts
 * const response = await fetch(url);
 * return setCacheHeaders(response);
 * ```
 */
export function setCacheHeaders(response: Response): Response {
  response.headers.set("Cache-Control", "private, no-store");
  response.headers.set("Vary", "Cookie");
  return response;
}

/**
 * Extract session from Better Auth API response
 *
 * Handles multiple response formats from different Better Auth plugins/wrappers:
 * - Direct session field: `{ session: {...} }` (most common)
 * - Wrapped in data object: `{ data: { session: {...} } }` (some client wrappers)
 * - Data itself is session: `{ data: {...session fields...} }` (rare)
 *
 * @param json - The parsed JSON response from Better Auth API, or null
 * @returns The extracted session object, or null if no valid session found
 *
 * @example
 * ```ts
 * const response = await apiService.fetch('/api/auth/get-session');
 * const json = await response.json();
 * const session = extractSession(json);
 * if (session) {
 *   // User is authenticated
 * }
 * ```
 */
export function extractSession(
  json: BetterAuthApiResponse | null,
): BetterAuthSession | null {
  if (!json) return null;

  // Format 1: Direct session field (most common)
  if (json.session) {
    return json.session;
  }

  // Format 2 & 3: Session in data field
  if (json.data) {
    // Check if data has a session property
    if (typeof json.data === "object" && "session" in json.data) {
      const nestedSession = (json.data as { session?: BetterAuthSession })
        .session;
      return nestedSession ?? null;
    }
    // data itself might be the session - validate it has required fields
    if (
      typeof json.data === "object" &&
      "id" in json.data &&
      "userId" in json.data
    ) {
      return json.data as BetterAuthSession;
    }
  }

  return null;
}
