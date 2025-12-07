// All durations in milliseconds. Providers must match server-side config.
// Changing api.basePath requires updating server routing.
export const authConfig = {
  oauth: {
    defaultCallbackUrl: "/login",
    providers: ["google"] as const,
  },

  passkey: {
    enableConditionalUI: true,
    timeout: 60_000,
    userVerification: "preferred" as const,
  },

  security: {
    allowedRedirectOrigins: [
      typeof window !== "undefined"
        ? window.location.origin
        : "http://localhost:5173",
    ],
    csrfTokenHeader: "x-csrf-token",
    sessionCookieName: "better-auth.session",
  },

  api: {
    basePath: "/api/auth",
    requestTimeout: process.env.NODE_ENV === "development" ? 60_000 : 30_000,
  },

  retry: {
    attempts: 3,
    initialDelay: 1000,
    maxDelay: 5000,
    backoffMultiplier: 2,
  },

  session: {
    checkInterval: 5 * 60 * 1000,
    refreshThreshold: 10 * 60 * 1000,
  },

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

// Rejects protocol-relative URLs (//example.com) and external domains
export function isValidRedirectUrl(url: string): boolean {
  if (!url.startsWith("/") || url.startsWith("//")) {
    return false;
  }

  try {
    const parsed = new URL(url, window.location.origin);
    return authConfig.security.allowedRedirectOrigins.includes(parsed.origin);
  } catch {
    return false;
  }
}

// Returns "/" for invalid or missing URLs
export function getSafeRedirectUrl(url: unknown): string {
  if (typeof url !== "string" || !url) {
    return "/";
  }

  return isValidRedirectUrl(url) ? url : "/";
}

// Refresh when expiry is within threshold to prevent mid-operation failures.
// Returns false for already-expired sessions.
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

  return (
    timeUntilExpiry > 0 && timeUntilExpiry < authConfig.session.refreshThreshold
  );
}
