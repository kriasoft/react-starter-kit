// Single source of truth for plan limits.
// Referenced by auth plugin config (plan definitions) and tRPC router (query responses).

export const planLimits = {
  free: { members: 1 },
  starter: { members: 5 },
  pro: { members: 50 },
} as const;

export type PlanName = keyof typeof planLimits;
