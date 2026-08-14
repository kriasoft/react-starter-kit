import { TRPCError } from "@trpc/server";
import {
  canManageOrgBilling,
  planLimits,
  type PlanName,
} from "../lib/plans.js";
import { protectedProcedure, router } from "../lib/trpc.js";

export const billingRouter = router({
  // Active subscription + limits for the current billing reference.
  // referenceId is derived from session – org billing when an org is active,
  // personal billing otherwise. No client-side param needed.
  subscription: protectedProcedure.query(async ({ ctx }) => {
    const enabled = Boolean(
      ctx.env.STRIPE_SECRET_KEY &&
      ctx.env.STRIPE_WEBHOOK_SECRET &&
      ctx.env.STRIPE_STARTER_PRICE_ID &&
      ctx.env.STRIPE_PRO_PRICE_ID,
    );

    if (!enabled) {
      return {
        enabled,
        // Nothing to manage while billing is off, so no caller may.
        canManage: false,
        plan: "free" as const,
        status: null,
        periodEnd: null,
        cancelAtPeriodEnd: false,
        limits: planLimits.free,
      };
    }

    const organizationId = ctx.session.activeOrganizationId;

    // Personal billing: the caller is the subscriber, so nothing to look up.
    let canManage = true;

    // The active organization selects the billing scope; it does not prove the
    // caller still belongs to it. A session outlives a membership removal, so
    // without this an ex-member keeps reading their old organization's plan.
    // `ctx.db`, never `dbCached` – a stale answer here is an authorization hole.
    // The role rides along on the same lookup: every member may see the plan,
    // but only owners and admins may change it, and the UI has no other way to
    // know that before Better Auth rejects the checkout.
    if (organizationId) {
      const membership = await ctx.db.query.member.findFirst({
        columns: { role: true },
        where: (m, { and, eq }) =>
          and(eq(m.organizationId, organizationId), eq(m.userId, ctx.user.id)),
      });

      if (!membership) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Not a member of the active organization",
        });
      }

      canManage = canManageOrgBilling(membership.role);
    }

    const referenceId = organizationId ?? ctx.user.id;

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
      enabled,
      canManage,
      plan,
      status: sub?.status ?? null,
      periodEnd: sub?.periodEnd ?? null,
      cancelAtPeriodEnd: sub?.cancelAtPeriodEnd ?? false,
      limits: planLimits[plan as PlanName],
    };
  }),
});
