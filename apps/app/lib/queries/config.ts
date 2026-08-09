import { queryOptions, useQuery } from "@tanstack/react-query";
import { trpcClient } from "../trpc";

export const socialProvidersQueryKey = ["config", "socialProviders"] as const;

export function socialProvidersQueryOptions() {
  return queryOptions({
    queryKey: socialProvidersQueryKey,
    queryFn: () => trpcClient.config.socialProviders.query(),
    staleTime: Infinity,
  });
}

/**
 * Returns configured social providers. Empty while loading or after failure so
 * the UI never offers a sign-in method that may not work.
 */
export function useSocialProviders(): string[] {
  const { data } = useQuery(socialProvidersQueryOptions());
  return data ?? [];
}
