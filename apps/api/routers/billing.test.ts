import { describe, expect, it, vi } from "vitest";
import { createCallerFactory } from "../lib/trpc";
import { billingRouter } from "./billing";

const createCaller = createCallerFactory(billingRouter);

// Minimal context mock — only fields the billing procedure accesses.
function testCtx({
  userId = "user-1",
  activeOrgId = null as string | null,
  subscription = undefined as Record<string, unknown> | undefined,
} = {}) {
  return {
    session: { id: "s-1", activeOrganizationId: activeOrgId },
    user: { id: userId },
    db: {
      query: {
        subscription: {
          findFirst: vi.fn().mockResolvedValue(subscription),
        },
      },
    },
  } as Parameters<typeof createCaller>[0];
}

describe("billing.subscription", () => {
  it("returns free plan defaults when no subscription exists", async () => {
    const result = await createCaller(testCtx()).subscription();

    expect(result).toEqual({
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
      plan: "pro",
      status: "active",
      periodEnd,
      cancelAtPeriodEnd: false,
      limits: { members: 50 },
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
});
