/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { LoginForm } from "@/components/auth/login-form";
import { authConfig, getSafeRedirectUrl } from "@/lib/auth-config";
import { invalidateSession, sessionQueryOptions } from "@/lib/queries/session";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/(auth)/login")({
  // [AUTH GUARD] Redirect authenticated users away from login page
  // WARNING: Both user AND session must exist - partial data indicates corrupted session
  beforeLoad: async ({ context }) => {
    // Fetch fresh session data to ensure we have the latest auth state
    const session = await context.queryClient.fetchQuery(sessionQueryOptions());

    if (session?.user && session?.session) {
      throw redirect({ to: "/" });
    }
  },
  component: LoginPage,
  // [SECURITY] Prevent open redirect attacks by sanitizing all redirect URLs
  // Returns "/" for non-relative or suspicious URLs
  //
  // [OAUTH FLOW] returnUrl signals post-OAuth callback state:
  // 1. User initiates social login → redirects to provider
  // 2. Provider authenticates → returns to /api/auth/callback/<provider>
  // 3. API validates OAuth → redirects here with returnUrl=<destination>
  // 4. Component verifies session → auto-navigates to final destination
  validateSearch: (
    search: Record<string, unknown>,
  ): { redirect: string; returnUrl?: string } => {
    return {
      redirect: getSafeRedirectUrl(search.redirect),
      returnUrl:
        typeof search.returnUrl === "string"
          ? getSafeRedirectUrl(search.returnUrl)
          : undefined,
    };
  },
});

function LoginPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { redirect, returnUrl } = Route.useSearch();
  const [isPostOAuth, setIsPostOAuth] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(false);
  const isMounted = useRef(true);

  // [POST-OAUTH] Auto-redirect authenticated users after OAuth callback
  // Triggered when returnUrl present (indicates return from provider)
  useEffect(() => {
    // Prevent React state updates on unmounted component (memory leak protection)
    isMounted.current = true;

    const checkPostOAuthAuth = async () => {
      // returnUrl presence confirms OAuth callback - skip check otherwise
      if (!returnUrl) return;

      try {
        setIsCheckingAuth(true);

        // Fetch fresh session to verify OAuth success
        const session = await queryClient.fetchQuery(sessionQueryOptions());

        // Guard against unmounted component updates
        if (!isMounted.current) return;

        if (session?.user && session?.session) {
          setIsPostOAuth(true);

          // [CACHE SYNC] Invalidate stale session before navigation
          await invalidateSession(queryClient);

          // [AUTO REDIRECT] Route to original destination or default
          const finalDestination =
            returnUrl || authConfig.oauth.postLoginRedirect;
          navigate({ to: finalDestination }).catch(() => {
            // Hard redirect fallback ensures navigation on router failure
            window.location.href = finalDestination;
          });
        } else {
          // OAuth incomplete - display login form for retry
          setIsCheckingAuth(false);
        }
      } catch (error) {
        console.error("Post-OAuth auth check failed:", error);
        if (isMounted.current) {
          setIsCheckingAuth(false);
        }
      }
    };

    checkPostOAuthAuth();

    // Cleanup: mark component unmounted
    return () => {
      isMounted.current = false;
    };
  }, [returnUrl, queryClient, navigate]);

  async function handleSuccess() {
    // [CACHE SYNC] Invalidate session cache after successful login
    // WARNING: Must complete before navigation to prevent stale UI state
    await invalidateSession(queryClient);

    // Priority: returnUrl (OAuth flow) > redirect (standard flow)
    const destination = returnUrl || redirect;

    // Try router navigation first, hard redirect on failure
    // NOTE: Hard redirect guarantees navigation despite router state issues
    navigate({ to: destination }).catch(() => {
      window.location.href = destination;
    });
  }

  // [UI STATE] Post-OAuth loading indicator during session verification
  if (isPostOAuth) {
    return (
      <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-lg font-semibold mb-2">Completing sign in...</h2>
          <p className="text-muted-foreground text-sm">
            You'll be redirected to your destination shortly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm onSuccess={handleSuccess} isLoading={isCheckingAuth} />
      </div>
    </div>
  );
}
