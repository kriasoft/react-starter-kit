// Billing subscription state via TanStack Query.
// Query key includes activeOrgId so switching organizations refetches automatically.

import {
  queryOptions,
  useQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { trpcClient } from "../trpc";

// Partial key for bulk invalidation (e.g. after subscription change)
export const billingQueryKey = ["billing", "subscription"] as const;

export function billingQueryOptions(activeOrgId?: string | null) {
  return queryOptions({
    queryKey: [...billingQueryKey, activeOrgId ?? null] as const,
    queryFn: () => trpcClient.billing.subscription.query(),
  });
}

export function useBillingQuery(activeOrgId?: string | null) {
  return useQuery(billingQueryOptions(activeOrgId));
}

export function useSuspenseBillingQuery(activeOrgId?: string | null) {
  return useSuspenseQuery(billingQueryOptions(activeOrgId));
}
