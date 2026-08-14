/**
 * @file Subscription state and Stripe redirects.
 *
 * Reads go through tRPC, which joins the subscription row with plan limits.
 * Writes go through the Better Auth client, because the Stripe plugin owns the
 * checkout session, the organization authorization check, and the redirect.
 */

import { queryOptions, useMutation, useQuery } from "@tanstack/react-query";
import { auth } from "../auth";
import { trpcClient } from "../trpc";

// Partial key for bulk invalidation (e.g. after subscription change)
export const billingQueryKey = ["billing", "subscription"] as const;

/** Paid plans offered at checkout. Mirrors `planLimits` in `apps/api/lib/plans.ts`. */
export type PaidPlan = "starter" | "pro";

export function billingQueryOptions(activeOrgId?: string | null) {
  return queryOptions({
    queryKey: [...billingQueryKey, activeOrgId ?? null] as const,
    queryFn: () => trpcClient.billing.subscription.query(),
  });
}

export function useBillingQuery(activeOrgId?: string | null) {
  return useQuery(billingQueryOptions(activeOrgId));
}

/**
 * Bills the active organization when there is one, the user otherwise. The API
 * derives the same reference from the session, so the two must agree.
 */
function billingReference(activeOrgId?: string | null) {
  return activeOrgId
    ? ({ referenceId: activeOrgId, customerType: "organization" } as const)
    : {};
}

/**
 * Sends the user to Stripe Checkout.
 *
 * Better Auth resolves with `{ error }` instead of throwing, so both mutations
 * here rethrow it. Discarding it leaves the button looking functional while an
 * authorization or Stripe failure silently does nothing.
 */
export function useUpgradeSubscription(activeOrgId?: string | null) {
  return useMutation({
    mutationFn: async (plan: PaidPlan) => {
      const returnUrl = window.location.href;
      const { error } = await auth.subscription.upgrade({
        ...billingReference(activeOrgId),
        plan,
        successUrl: returnUrl,
        cancelUrl: returnUrl,
      });
      if (error) throw error;
    },
  });
}

/** Sends the user to the Stripe customer portal to manage an existing subscription. */
export function useBillingPortal(activeOrgId?: string | null) {
  return useMutation({
    mutationFn: async () => {
      const { error } = await auth.subscription.billingPortal({
        ...billingReference(activeOrgId),
        returnUrl: window.location.href,
      });
      if (error) throw error;
    },
  });
}
