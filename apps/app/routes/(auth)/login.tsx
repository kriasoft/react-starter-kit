/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { LoginForm } from "@/components/auth/login-form";
import { getSafeRedirectUrl } from "@/lib/auth-config";
import { getCachedSession, invalidateSession } from "@/lib/queries/session";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)/login")({
  // [AUTH GUARD] Prevent authenticated users from accessing login
  // NOTE: Both user AND session must exist (partial data = invalid session)
  beforeLoad: async ({ context }) => {
    const session = getCachedSession(context.queryClient);

    if (session?.user && session?.session) {
      throw redirect({ to: "/" });
    }
  },
  component: LoginPage,
  // [SECURITY] Sanitize redirect URLs to prevent open redirect attacks
  // Returns "/" for any non-relative or suspicious URLs
  validateSearch: (search: Record<string, unknown>): { redirect: string } => {
    return {
      redirect: getSafeRedirectUrl(search.redirect),
    };
  },
});

function LoginPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { redirect } = Route.useSearch();

  async function handleSuccess() {
    // [CACHE SYNC] Force refetch to get fresh session after login
    // WARNING: Must complete before navigation or user sees stale state
    await invalidateSession(queryClient);

    // [NAVIGATION] Prefer router navigation, fallback to hard redirect
    // NOTE: Hard redirect ensures clean state if router fails
    navigate({ to: redirect }).catch(() => {
      window.location.href = redirect;
    });
  }

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm onSuccess={handleSuccess} />
      </div>
    </div>
  );
}
