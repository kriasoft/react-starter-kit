import { auth } from "@/lib/auth";
import { authConfig } from "@/lib/auth-config";
import { sessionQueryKey } from "@/lib/queries/session";
import { queryClient } from "@/lib/query";
import { useRouterState } from "@tanstack/react-router";
import { Button } from "@repo/ui";

interface SocialLoginProps {
  onError: (error: string) => void;
  isDisabled?: boolean;
}

export function SocialLogin({ onError, isDisabled }: SocialLoginProps) {
  // Get returnTo from router state (already sanitized by validateSearch)
  const returnTo = useRouterState({
    select: (s) => (s.location.search as { returnTo?: string }).returnTo,
  });

  const handleGoogleLogin = async () => {
    try {
      onError(""); // Clear any previous errors

      // Clear stale session before OAuth redirect
      queryClient.removeQueries({ queryKey: sessionQueryKey });

      // Use sanitized returnTo or root as default
      const destination = returnTo || "/";

      // Initiate Google OAuth flow
      await auth.signIn.social({
        provider: "google",
        callbackURL: `${authConfig.oauth.defaultCallbackUrl}?returnTo=${encodeURIComponent(destination)}`,
      });

      // Note: This code won't execute as OAuth redirects the page
    } catch (err) {
      console.error("Google login error:", err);
      onError("Failed to sign in with Google");
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      onClick={handleGoogleLogin}
      disabled={isDisabled}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="mr-2 h-4 w-4"
      >
        <path
          d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
          fill="currentColor"
        />
      </svg>
      Continue with Google
    </Button>
  );
}
