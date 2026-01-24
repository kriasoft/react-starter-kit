import { getErrorMessage, getErrorStatus } from "@/lib/errors";
import { sessionQueryKey } from "@/lib/queries/session";
import type { AppRouter } from "@repo/api";
import { Button } from "@repo/ui";
import {
  useQueryClient,
  useQueryErrorResetBoundary,
} from "@tanstack/react-query";
import { isTRPCClientError } from "@trpc/client";
import { AlertCircle } from "lucide-react";
import { ErrorBoundary } from "react-error-boundary";

// Check if error indicates session expiry (401 only, not 403 which is authorization)
export function isAuthError(error: unknown): boolean {
  // tRPC errors: check typed code
  if (isTRPCClientError<AppRouter>(error)) {
    return error.data?.code === "UNAUTHORIZED";
  }
  // Non-tRPC: only 401 (unauthenticated), not 403 (forbidden/no permission)
  return getErrorStatus(error) === 401;
}

interface ResetProps {
  resetErrorBoundary: () => void;
}

// Fallback for auth errors in protected routes
function AuthErrorFallback({ resetErrorBoundary }: ResetProps) {
  const queryClient = useQueryClient();

  const handleRetry = () => {
    queryClient.resetQueries({ queryKey: sessionQueryKey });
    resetErrorBoundary();
  };

  const handleSignIn = () => {
    queryClient.removeQueries({ queryKey: sessionQueryKey });
    const { pathname, search, hash } = window.location;
    const returnTo = encodeURIComponent(pathname + search + hash);
    window.location.href = `/login?returnTo=${returnTo}`;
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6">
      <div className="mx-auto max-w-md text-center">
        <AlertCircle className="mx-auto mb-4 h-12 w-12 text-destructive" />
        <h1 className="mb-2 text-2xl font-bold">Authentication Required</h1>
        <p className="mb-6 text-muted-foreground">
          Please sign in to access this page.
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

interface ErrorFallbackProps {
  error: unknown;
  resetErrorBoundary: () => void;
}

// Generic error fallback for non-auth errors
function GenericErrorFallback({
  error,
  resetErrorBoundary,
}: ErrorFallbackProps) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6">
      <div className="mx-auto max-w-md text-center">
        <AlertCircle className="mx-auto mb-4 h-12 w-12 text-destructive" />
        <h1 className="mb-2 text-2xl font-bold">Something went wrong</h1>
        <p className="mb-6 text-muted-foreground">{getErrorMessage(error)}</p>
        <Button onClick={resetErrorBoundary}>Try Again</Button>
      </div>
    </div>
  );
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

// Routes auth errors to AuthErrorFallback, others to GenericErrorFallback
function AuthAwareErrorFallback({
  error,
  resetErrorBoundary,
}: ErrorFallbackProps) {
  return isAuthError(error) ? (
    <AuthErrorFallback resetErrorBoundary={resetErrorBoundary} />
  ) : (
    <GenericErrorFallback
      error={error}
      resetErrorBoundary={resetErrorBoundary}
    />
  );
}

// Auth error boundary for protected routes only.
// Catches auth errors (tRPC UNAUTHORIZED or HTTP 401) and shows recovery UI.
// 403 (forbidden) falls through to generic handler since user IS authenticated.
export function AuthErrorBoundary({ children }: ErrorBoundaryProps) {
  const queryClient = useQueryClient();
  const { reset } = useQueryErrorResetBoundary();

  return (
    <ErrorBoundary
      FallbackComponent={AuthAwareErrorFallback}
      onReset={reset}
      onError={(error) => {
        console.error("Error caught by boundary:", error);
        if (isAuthError(error)) {
          queryClient.removeQueries({ queryKey: sessionQueryKey });
        }
      }}
    >
      {children}
    </ErrorBoundary>
  );
}

// Generic error boundary for app root - no auth-specific handling
export function AppErrorBoundary({ children }: ErrorBoundaryProps) {
  const { reset } = useQueryErrorResetBoundary();

  return (
    <ErrorBoundary
      FallbackComponent={GenericErrorFallback}
      onReset={reset}
      onError={(error) => console.error("Uncaught error:", error)}
    >
      {children}
    </ErrorBoundary>
  );
}
