// Extract HTTP status from various error shapes (with cycle guard)
export function getErrorStatus(
  error: unknown,
  seen = new WeakSet<object>(),
): number | undefined {
  if (!error || typeof error !== "object") return undefined;
  if (seen.has(error)) return undefined;
  seen.add(error);

  const err = error as Record<string, unknown>;
  // Direct status (tRPC, Better Auth)
  if (typeof err.status === "number") return err.status;
  // Nested in response (axios-style)
  if (
    err.response &&
    typeof (err.response as Record<string, unknown>).status === "number"
  ) {
    return (err.response as Record<string, unknown>).status as number;
  }
  // Error cause chain
  if (err.cause) return getErrorStatus(err.cause, seen);
  return undefined;
}

// Check if error indicates unauthenticated state (401).
// Maps tRPC UNAUTHORIZED code and HTTP 401 status to a semantic boolean.
// Does not match 403 (forbidden) - that means authenticated but lacking permission.
export function isUnauthenticatedError(error: unknown): boolean {
  // tRPC errors expose typed code
  if (error && typeof error === "object" && "data" in error) {
    const data = (error as { data?: { code?: string } }).data;
    if (data?.code === "UNAUTHORIZED") return true;
  }
  return getErrorStatus(error) === 401;
}

// Safely extract message from any thrown value
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  // Response objects (fetch API)
  if (error && typeof error === "object" && "statusText" in error) {
    const statusText = (error as { statusText?: string }).statusText;
    if (statusText) return statusText;
  }
  return "An unexpected error occurred";
}
