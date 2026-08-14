import { describe, expect, it, vi, type Mock } from "vitest";
import type { TRPCContext } from "../lib/context";
import { createCallerFactory } from "../lib/trpc";
import { billingRouter } from "./billing";

const createCaller = createCallerFactory(billingRouter);

/** The membership `where` callback, reduced to what this test drives it with. */
type MemberWhere = (
  columns: Record<string, string>,
  ops: {
    and: (...parts: string[]) => string;
    eq: (column: string, value: string) => string;
  },
) => string;

// Minimal context mock – only fields the billing procedure accesses.
function testCtx({
  billingEnabled = true,
  userId = "user-1",
  activeOrgId = undefined as string | undefined,
  memberRole = "owner" as string | null,
  subscription = undefined as Record<string, unknown> | undefined,
} = {}) {
  const ctx: TRPCContext = {
    req: new Request("http://localhost"),
    info: {} as TRPCContext["info"],
    session: {
      id: "s-1",
      createdAt: new Date(),
      updatedAt: new Date(),
      userId,
      expiresAt: new Date(Date.now() + 60_000),
      token: "token",
      activeOrganizationId: activeOrgId,
    },
    user: {
      id: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      email: "test@example.com",
      emailVerified: true,
      name: "Test User",
    },
    db: {
      query: {
        // Drizzle's `findFirst` resolves undefined when nothing matches.
        member: {
          findFirst: vi
            .fn()
            .mockResolvedValue(memberRole ? { role: memberRole } : undefined),
        },
        subscription: { findFirst: vi.fn().mockResolvedValue(subscription) },
      },
    } as unknown as TRPCContext["db"],
    dbCached: {} as TRPCContext["dbCached"],
    env: (billingEnabled
      ? {
          STRIPE_SECRET_KEY: "sk_test",
          STRIPE_WEBHOOK_SECRET: "whsec_test",
          STRIPE_STARTER_PRICE_ID: "price_starter",
          STRIPE_PRO_PRICE_ID: "price_pro",
        }
      : {}) as TRPCContext["env"],
  };

  return ctx;
}

describe("billing.subscription", () => {
  it("returns free plan defaults when no subscription exists", async () => {
    const result = await createCaller(testCtx()).subscription();

    expect(result).toEqual({
      enabled: true,
      canManage: true,
      plan: "free",
      status: null,
      periodEnd: null,
      cancelAtPeriodEnd: false,
      limits: { members: 1 },
    });
  });

  it("returns active subscription with plan limits", async () => {
    const periodEnd = new Date("2025-03-01");
    const result = await createCaller(
      testCtx({
        subscription: {
          plan: "pro",
          status: "active",
          periodEnd,
          cancelAtPeriodEnd: false,
        },
      }),
    ).subscription();

    expect(result).toEqual({
      enabled: true,
      canManage: true,
      plan: "pro",
      status: "active",
      periodEnd,
      cancelAtPeriodEnd: false,
      limits: { members: 50 },
    });
  });

  it("reports billing disabled without Stripe configuration", async () => {
    const result = await createCaller(
      testCtx({ billingEnabled: false }),
    ).subscription();

    expect(result).toEqual({
      enabled: false,
      canManage: false,
      plan: "free",
      status: null,
      periodEnd: null,
      cancelAtPeriodEnd: false,
      limits: { members: 1 },
    });
  });

  it("returns trialing subscription", async () => {
    const result = await createCaller(
      testCtx({
        subscription: {
          plan: "starter",
          status: "trialing",
          periodEnd: null,
          cancelAtPeriodEnd: false,
        },
      }),
    ).subscription();

    expect(result.plan).toBe("starter");
    expect(result.status).toBe("trialing");
    expect(result.limits).toEqual({ members: 5 });
  });

  it("maps cancelAtPeriodEnd flag", async () => {
    const result = await createCaller(
      testCtx({
        subscription: {
          plan: "pro",
          status: "active",
          periodEnd: new Date(),
          cancelAtPeriodEnd: true,
        },
      }),
    ).subscription();

    expect(result.cancelAtPeriodEnd).toBe(true);
  });

  it("throws on unknown plan name", async () => {
    await expect(
      createCaller(
        testCtx({
          subscription: { plan: "enterprise", status: "active" },
        }),
      ).subscription(),
    ).rejects.toThrow('Unknown plan "enterprise"');
  });

  it("reads the organization's subscription for a current member", async () => {
    const ctx = testCtx({
      activeOrgId: "org-1",
      subscription: { plan: "pro", status: "active" },
    });

    await expect(createCaller(ctx).subscription()).resolves.toMatchObject({
      plan: "pro",
    });
  });

  // Driving the callback, not just the resolved value: a lookup that dropped
  // either column would still find *a* membership and authorize the read.
  it("looks the membership up by both organization and user", async () => {
    const ctx = testCtx({ activeOrgId: "org-1" });
    await createCaller(ctx).subscription();

    const findMember = ctx.db.query.member.findFirst as unknown as Mock;
    const { where } = findMember.mock.calls[0][0] as { where: MemberWhere };

    expect(
      where(
        { organizationId: "organizationId", userId: "userId" },
        {
          and: (...parts) => parts.join(" AND "),
          eq: (column, value) => `${column}=${value}`,
        },
      ),
    ).toBe("organizationId=org-1 AND userId=user-1");
  });

  // A session outlives a membership removal, so the active organization ID on
  // its own would let an ex-member keep reading that organization's billing.
  it("refuses a session whose user is no longer a member", async () => {
    const ctx = testCtx({ activeOrgId: "org-1", memberRole: null });

    await expect(createCaller(ctx).subscription()).rejects.toThrow(
      "Not a member of the active organization",
    );
    expect(ctx.db.query.subscription.findFirst).not.toHaveBeenCalled();
  });

  it("skips the membership check for personal billing", async () => {
    const ctx = testCtx({ memberRole: null });

    await expect(createCaller(ctx).subscription()).resolves.toMatchObject({
      plan: "free",
    });
    expect(ctx.db.query.member.findFirst).not.toHaveBeenCalled();
  });

  // Better Auth rejects a plain member's checkout, so the answer has to reach
  // the UI before it offers the button.
  it.each([
    ["owner", true],
    ["admin", true],
    ["member", false],
  ] as const)("reports canManage %s -> %s", async (role, canManage) => {
    const result = await createCaller(
      testCtx({ activeOrgId: "org-1", memberRole: role }),
    ).subscription();

    expect(result.canManage).toBe(canManage);
  });

  it("lets a user manage their own personal billing", async () => {
    const result = await createCaller(testCtx()).subscription();

    expect(result.canManage).toBe(true);
  });
});
