// Social providers come from `config.socialProviders`, which is derived from
// server credentials. Keeping a client-side copy would let the two drift.
export const authConfig = {
  api: {
    basePath: "/api/auth",
  },

  errors: {
    networkError: "Network error. Please check your connection and try again.",
    passkeyNotSupported: "Your browser doesn't support passkeys.",
    genericError: "Something went wrong. Please try again.",
  },
} as const;

// Only allows same-origin relative paths (starts with "/" but not "//")
export function isValidRedirectUrl(url: string): boolean {
  return url.startsWith("/") && !url.startsWith("//");
}

// Returns "/" for invalid or missing URLs
export function getSafeRedirectUrl(url: unknown): string {
  if (typeof url !== "string" || !url) {
    return "/";
  }

  return isValidRedirectUrl(url) ? url : "/";
}
