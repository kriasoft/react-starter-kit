// Single source of truth for plan limits.
// Referenced by auth plugin config (plan definitions) and tRPC router (query responses).

export const planLimits = {
  free: { members: 1 },
  starter: { members: 5 },
  pro: { members: 50 },
} as const;

export type PlanName = keyof typeof planLimits;

/**
 * Who may change an organization's subscription. `authorizeReference` in
 * `auth.ts` enforces it on every Stripe mutation; `billing.subscription`
 * reports it so the UI never offers a member an action that can only fail.
 * One predicate, so those two can't drift apart.
 */
export function canManageOrgBilling(role: string | null | undefined): boolean {
  return role === "owner" || role === "admin";
}
