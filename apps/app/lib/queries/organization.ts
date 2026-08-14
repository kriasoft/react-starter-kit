/**
 * @file Organization membership state via TanStack Query.
 *
 * Backed by Better Auth's organization plugin rather than a tRPC procedure:
 * the plugin already enforces membership, roles, and pagination server-side,
 * so a wrapper would only duplicate that boundary.
 */

import {
  skipToken,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { auth } from "../auth";
import { revalidateSession } from "./session";

export const membersQueryKey = ["organization", "members"] as const;

// Explicit so an upstream default cannot silently truncate this list.
const MEMBERS_PAGE_SIZE = 100;

const membersKey = (organizationId: string | null) =>
  [...membersQueryKey, organizationId] as const;

async function listMembers(organizationId: string) {
  const response = await auth.organization.listMembers({
    query: { organizationId, limit: MEMBERS_PAGE_SIZE },
  });
  if (response.error) throw response.error;
  return response.data;
}

/**
 * Members of the given organization, skipping the request until there is one.
 * Better Auth answers `NO_ACTIVE_ORGANIZATION` rather than an empty list, and a
 * user who has not joined an organization is a normal state, not an error.
 */
export function useMembersQuery(organizationId?: string | null) {
  return useQuery({
    queryKey: membersKey(organizationId ?? null),
    queryFn: organizationId ? () => listMembers(organizationId) : skipToken,
  });
}

/**
 * Creates an organization and makes it the active one. The active organization
 * lives on the session row, so the session cache must be revalidated before any
 * organization-scoped query can see it.
 */
export function useCreateOrganization() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (name: string) => {
      // Better Auth activates a newly created organization unless asked not to.
      const created = await auth.organization.create({
        name,
        slug: newOrganizationSlug(name),
      });
      if (created.error) throw created.error;
      return created.data;
    },
    // Returned rather than fired and forgotten, so the mutation stays pending
    // until the session carries the new organization. Otherwise the form would
    // finish while the page still reads "no active organization".
    onSuccess: () => revalidateSession(queryClient, router),
  });
}

/**
 * Better Auth requires a slug and does not derive one. Slugs are unique across
 * every organization, names are not, and the form never asks for a slug – so
 * the readable part is a hint and the random suffix carries uniqueness. Without
 * it the second customer to type "Acme" hits a collision they have no field to
 * resolve, and a name with no ASCII characters produces no slug at all.
 *
 * Slugs are internal today. Add an editable field here if one reaches a URL.
 */
function newOrganizationSlug(name: string): string {
  const readable = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 32);

  // 64 bits: make collisions not happen rather than handle them.
  const unique = Array.from(crypto.getRandomValues(new Uint8Array(8)), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");

  return readable ? `${readable}-${unique}` : `org-${unique}`;
}
