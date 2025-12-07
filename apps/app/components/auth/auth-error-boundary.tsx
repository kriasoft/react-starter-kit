import { sessionQueryKey } from "@/lib/queries/session";
import { queryClient } from "@/lib/query";
import { Button } from "@repo/ui";
import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import * as React from "react";
import { ErrorBoundary } from "react-error-boundary";

interface AuthErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

// Error type that may include status code
// NOTE: This extends Error to handle both tRPC errors (with status) and native JS errors
interface ErrorWithStatus extends Error {
  status?: number;
}

// Determine if an error is authentication-related
// WARNING: This function must catch all auth errors to prevent infinite error loops
// when wrapped components try to access protected resources
function isAuthError(error: Error): boolean {
  // Check for explicit status codes
  const status = (error as ErrorWithStatus)?.status;
  if (status === 401 || status === 403) return true;

  // Check for auth-related error messages
  const message = error.message?.toLowerCase() || "";
  return (
    message.includes("unauthorized") ||
    message.includes("unauthenticated") ||
    message.includes("session expired") ||
    message.includes("401") ||
    message.includes("403")
  );
}

// Fallback component for auth errors
function AuthErrorFallback({
  error,
  resetErrorBoundary,
}: AuthErrorFallbackProps) {
  const handleRetry = () => {
    // Reset React Query errors and component errors
    // NOTE: resetQueries() clears error state but preserves cached data,
    // allowing immediate retry without full data refetch
    queryClient.resetQueries();
    resetErrorBoundary();
  };

  const handleSignIn = () => {
    // Clear auth caches and redirect to login
    // WARNING: removeQueries() permanently deletes cached auth data.
    // Using window.location.href (not router navigation) ensures full page reload,
    // clearing all React state that might hold stale auth tokens
    queryClient.removeQueries({ queryKey: ["auth"] });
    window.location.href = "/login";
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6">
      <div className="mx-auto max-w-md text-center">
        <AlertCircle className="mx-auto mb-4 h-12 w-12 text-destructive" />
        <h1 className="mb-2 text-2xl font-bold">Authentication Required</h1>
        <p className="mb-6 text-muted-foreground">
          {error.message === "Unauthorized" ||
          (error as ErrorWithStatus)?.status === 401
            ? "Your session has expired. Please sign in again."
            : "You need to sign in to access this page."}
        </p>
        <div className="flex justify-center gap-3">
          <Button variant="outline" onClick={handleRetry}>
            Try Again
          </Button>
          <Button onClick={handleSignIn}>Sign In</Button>
        </div>
      </div>
    </div>
  );
}

interface AuthErrorBoundaryProps {
  children: React.ReactNode;
}

// General error fallback that handles both auth and other errors
// This wrapper ensures auth errors get special UI treatment while preserving
// generic error handling for all other failures
function ErrorFallbackWrapper({
  error,
  resetErrorBoundary,
}: AuthErrorFallbackProps) {
  // If it's not an auth error, show a generic error message
  if (!isAuthError(error)) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center p-6">
        <div className="mx-auto max-w-md text-center">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-destructive" />
          <h1 className="mb-2 text-2xl font-bold">Something went wrong</h1>
          <p className="mb-6 text-muted-foreground">
            {error.message || "An unexpected error occurred"}
          </p>
          <Button onClick={resetErrorBoundary}>Try Again</Button>
        </div>
      </div>
    );
  }

  // For auth errors, use the auth-specific UI
  return (
    <AuthErrorFallback error={error} resetErrorBoundary={resetErrorBoundary} />
  );
}

// Modern auth error boundary using react-error-boundary
export function AuthErrorBoundary({ children }: AuthErrorBoundaryProps) {
  const { reset } = useQueryErrorResetBoundary();

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallbackWrapper}
      onReset={reset}
      onError={(error, errorInfo) => {
        console.error("Error caught by boundary:", error, errorInfo);
        // Clear stale session data for auth errors
        // NOTE: sessionQueryKey is imported from queries/session - ensures we clear
        // the exact query key used by useSession() hook to prevent stale auth state
        if (isAuthError(error)) {
          queryClient.removeQueries({ queryKey: sessionQueryKey });
        }
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
