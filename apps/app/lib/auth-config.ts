/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

/**
 * Centralized authentication configuration
 *
 * CONTRACTS:
 * - All durations are in milliseconds
 * - Providers array must match server-side Better Auth config
 * - Security settings must align with API CORS configuration
 *
 * SAFE MODIFICATIONS: All values except api.basePath can be changed.
 * Changing basePath requires updating server routing.
 */
export const authConfig = {
  // OAuth provider configuration
  oauth: {
    // Default callback URL after OAuth authentication - redirect to login page first
    defaultCallbackUrl: "/login",
    // Final destination after login page processing
    postLoginRedirect: "/",
    // Supported OAuth providers
    providers: ["google"] as const,
  },

  // Passkey configuration
  passkey: {
    // Enable conditional UI for passkey autofill
    enableConditionalUI: true,
    // Timeout for passkey operations in milliseconds
    timeout: 60_000,
    // User verification requirement
    userVerification: "preferred" as const,
  },

  // Security configuration
  security: {
    // Allowed redirect origins (prevents open redirect attacks)
    allowedRedirectOrigins: [
      typeof window !== "undefined"
        ? window.location.origin
        : "http://localhost:5173",
    ],
    // CSRF token header name
    csrfTokenHeader: "x-csrf-token",
    // Session cookie name
    sessionCookieName: "better-auth.session",
  },

  // API configuration
  api: {
    // Base path for auth endpoints
    basePath: "/api/auth",
    // Timeout for API requests (longer in dev for debugging)
    requestTimeout: process.env.NODE_ENV === "development" ? 60_000 : 30_000,
  },

  // Retry configuration
  retry: {
    // Number of retry attempts for failed requests
    attempts: 3,
    // Initial delay between retries in milliseconds
    initialDelay: 1000,
    // Maximum delay between retries
    maxDelay: 5000,
    // Backoff multiplier
    backoffMultiplier: 2,
  },

  // Session configuration
  session: {
    // Session check interval in milliseconds (5 minutes)
    checkInterval: 5 * 60 * 1000,
    // Session refresh threshold (refresh if expires in less than this)
    refreshThreshold: 10 * 60 * 1000, // 10 minutes
  },

  // Error messages
  errors: {
    sessionExpired: "Your session has expired. Please sign in again.",
    unauthorized: "You need to sign in to access this page.",
    networkError: "Network error. Please check your connection and try again.",
    passkeyNotSupported: "Your browser doesn't support passkeys.",
    passkeyNotFound:
      "No passkey found for this account. Please sign in with Google first.",
    genericError: "Something went wrong. Please try again.",
  },
} as const;

/**
 * Validates redirect URLs to prevent open redirect attacks
 *
 * SECURITY: Rejects protocol-relative URLs (//example.com) and absolute URLs
 * to external domains. Only relative paths within allowed origins pass.
 *
 * @param url - URL to validate
 * @returns true if URL is safe to redirect to
 */
export function isValidRedirectUrl(url: string): boolean {
  // Only allow relative URLs starting with /
  if (!url.startsWith("/") || url.startsWith("//")) {
    return false;
  }

  try {
    const parsed = new URL(url, window.location.origin);
    // Check if origin matches allowed origins
    return authConfig.security.allowedRedirectOrigins.includes(parsed.origin);
  } catch {
    return false;
  }
}

/**
 * Sanitizes user-provided redirect URLs
 *
 * USAGE: Always use this when handling redirects from query params or user input
 * FALLBACK: Returns "/" for invalid or missing URLs
 */
export function getSafeRedirectUrl(url: unknown): string {
  if (typeof url !== "string" || !url) {
    return "/";
  }

  return isValidRedirectUrl(url) ? url : "/";
}

/**
 * Determines if session token should be refreshed proactively
 *
 * STRATEGY: Refresh when expiry is within threshold (default 10 min) to prevent
 * mid-operation auth failures. Returns false for expired sessions.
 *
 * @param expiresAt - Session expiration time
 * @returns true if session should be refreshed (not expired but expiring soon)
 */
export function shouldRefreshSession(
  expiresAt: Date | string | undefined,
): boolean {
  if (!expiresAt) return false;

  const expiryTime =
    typeof expiresAt === "string"
      ? new Date(expiresAt).getTime()
      : expiresAt.getTime();

  const now = Date.now();
  const timeUntilExpiry = expiryTime - now;

  // NOTE: Returns false for already-expired sessions (timeUntilExpiry <= 0)
  return (
    timeUntilExpiry > 0 && timeUntilExpiry < authConfig.session.refreshThreshold
  );
}
