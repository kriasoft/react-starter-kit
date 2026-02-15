import { planLimits, type PlanName } from "../lib/plans.js";
import { protectedProcedure, router } from "../lib/trpc.js";

export const billingRouter = router({
  // Active subscription + limits for the current billing reference.
  // referenceId is derived from session — org billing when an org is active,
  // personal billing otherwise. No client-side param needed.
  subscription: protectedProcedure.query(async ({ ctx }) => {
    const referenceId = ctx.session.activeOrganizationId ?? ctx.user.id;

    const sub = await ctx.db.query.subscription.findFirst({
      where: (s, { eq, and, inArray }) =>
        and(
          eq(s.referenceId, referenceId),
          inArray(s.status, ["active", "trialing"]),
        ),
    });

    const plan = sub?.plan ?? "free";

    if (!(plan in planLimits)) {
      throw new Error(`Unknown plan "${plan}"`);
    }

    return {
      plan,
      status: sub?.status ?? null,
      periodEnd: sub?.periodEnd ?? null,
      cancelAtPeriodEnd: sub?.cancelAtPeriodEnd ?? false,
      limits: planLimits[plan as PlanName],
    };
  }),
});
