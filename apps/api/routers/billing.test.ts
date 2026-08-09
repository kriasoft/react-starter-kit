import { describe, expect, it, vi } from "vitest";
import type { TRPCContext } from "../lib/context";
import { createCallerFactory } from "../lib/trpc";
import { billingRouter } from "./billing";

const createCaller = createCallerFactory(billingRouter);

// Minimal context mock — only fields the billing procedure accesses.
function testCtx({
  billingEnabled = true,
  userId = "user-1",
  activeOrgId = undefined as string | undefined,
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
        subscription: {
          findFirst: vi.fn().mockResolvedValue(subscription),
        },
      },
    } as unknown as TRPCContext["db"],
    dbCached: {} as TRPCContext["dbCached"],
    cache: new Map(),
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
});
