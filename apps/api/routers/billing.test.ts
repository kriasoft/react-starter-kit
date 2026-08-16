import { member, organization, subscription, user } from "@repo/db";
import { createTestDatabase } from "@repo/db/testing";
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import type { TRPCContext } from "../lib/context";
import { createCallerFactory } from "../lib/trpc";
import { billingRouter } from "./billing";

const createCaller = createCallerFactory(billingRouter);

const { db, reset, close } = await createTestDatabase();

afterAll(close);
beforeEach(reset);

async function insertUser(email = "test@example.com") {
  const [row] = await db
    .insert(user)
    .values({ name: "Test User", email, emailVerified: true })
    .returning();

  return row.id;
}

async function insertOrganization(slug: string) {
  const [row] = await db
    .insert(organization)
    .values({ name: slug, slug })
    .returning();

  return row.id;
}

function testCtx({
  userId,
  activeOrgId,
  billingEnabled = true,
}: {
  userId: string;
  activeOrgId?: string;
  billingEnabled?: boolean;
}) {
  const ctx: TRPCContext = {
    req: new Request("http://localhost"),
    info: {} as TRPCContext["info"],
    session: {
      id: "ses_test",
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
    db,
    dbCached: db,
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
    const userId = await insertUser();

    await expect(
      createCaller(testCtx({ userId })).subscription(),
    ).resolves.toEqual({
      enabled: true,
      canManage: true,
      plan: "free",
      status: null,
      periodEnd: null,
      cancelAtPeriodEnd: false,
      limits: { members: 1 },
    });
  });

  it("returns the active subscription with its plan limits", async () => {
    const userId = await insertUser();
    const periodEnd = new Date("2025-03-01T00:00:00.000Z");

    await db.insert(subscription).values({
      referenceId: userId,
      plan: "pro",
      status: "active",
      periodEnd,
      cancelAtPeriodEnd: false,
    });

    await expect(
      createCaller(testCtx({ userId })).subscription(),
    ).resolves.toEqual({
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
    const userId = await insertUser();

    await db.insert(subscription).values({
      referenceId: userId,
      plan: "pro",
      status: "active",
    });

    // The subscription exists; billing being off outranks it.
    await expect(
      createCaller(testCtx({ userId, billingEnabled: false })).subscription(),
    ).resolves.toMatchObject({
      enabled: false,
      canManage: false,
      plan: "free",
      limits: { members: 1 },
    });
  });

  it("treats a trialing subscription as active", async () => {
    const userId = await insertUser();

    await db.insert(subscription).values({
      referenceId: userId,
      plan: "starter",
      status: "trialing",
    });

    await expect(
      createCaller(testCtx({ userId })).subscription(),
    ).resolves.toMatchObject({
      plan: "starter",
      status: "trialing",
      limits: { members: 5 },
    });
  });

  // Every other status means the subscription no longer grants anything, and
  // reading the plan off a canceled row would keep the limits alive after it.
  it.each(["canceled", "incomplete", "past_due", "unpaid"])(
    "ignores a %s subscription",
    async (status) => {
      const userId = await insertUser();

      await db
        .insert(subscription)
        .values({ referenceId: userId, plan: "pro", status });

      await expect(
        createCaller(testCtx({ userId })).subscription(),
      ).resolves.toMatchObject({ plan: "free", status: null });
    },
  );

  it("maps the cancelAtPeriodEnd flag", async () => {
    const userId = await insertUser();

    await db.insert(subscription).values({
      referenceId: userId,
      plan: "pro",
      status: "active",
      cancelAtPeriodEnd: true,
    });

    await expect(
      createCaller(testCtx({ userId })).subscription(),
    ).resolves.toMatchObject({ cancelAtPeriodEnd: true });
  });

  // A plan Stripe knows about but `planLimits` does not would otherwise be
  // served as an unlimited one.
  it("throws on an unknown plan name", async () => {
    const userId = await insertUser();

    await db
      .insert(subscription)
      .values({ referenceId: userId, plan: "enterprise", status: "active" });

    await expect(
      createCaller(testCtx({ userId })).subscription(),
    ).rejects.toThrow('Unknown plan "enterprise"');
  });
});

describe("billing.subscription scoping", () => {
  it("reads the organization's subscription for a current member", async () => {
    const userId = await insertUser();
    const orgId = await insertOrganization("acme");

    await db
      .insert(member)
      .values({ userId, organizationId: orgId, role: "owner" });
    await db
      .insert(subscription)
      .values({ referenceId: orgId, plan: "pro", status: "active" });

    await expect(
      createCaller(testCtx({ userId, activeOrgId: orgId })).subscription(),
    ).resolves.toMatchObject({ plan: "pro" });
  });

  // The active organization picks the billing reference; the caller's own
  // subscription must not leak into it, or a personal plan would silently
  // raise an organization's limits.
  it("ignores the caller's personal subscription while an organization is active", async () => {
    const userId = await insertUser();
    const orgId = await insertOrganization("acme");

    await db
      .insert(member)
      .values({ userId, organizationId: orgId, role: "owner" });
    await db
      .insert(subscription)
      .values({ referenceId: userId, plan: "pro", status: "active" });

    await expect(
      createCaller(testCtx({ userId, activeOrgId: orgId })).subscription(),
    ).resolves.toMatchObject({ plan: "free" });
  });

  it("ignores another organization's subscription", async () => {
    const userId = await insertUser();
    const orgId = await insertOrganization("acme");
    const otherOrgId = await insertOrganization("globex");

    await db
      .insert(member)
      .values({ userId, organizationId: orgId, role: "owner" });
    await db
      .insert(subscription)
      .values({ referenceId: otherOrgId, plan: "pro", status: "active" });

    await expect(
      createCaller(testCtx({ userId, activeOrgId: orgId })).subscription(),
    ).resolves.toMatchObject({ plan: "free" });
  });

  // A session outlives a membership removal, so the active organization ID on
  // its own would let an ex-member keep reading that organization's billing.
  it("refuses a session whose user is no longer a member", async () => {
    const userId = await insertUser();
    const orgId = await insertOrganization("acme");

    await db
      .insert(subscription)
      .values({ referenceId: orgId, plan: "pro", status: "active" });

    await expect(
      createCaller(testCtx({ userId, activeOrgId: orgId })).subscription(),
    ).rejects.toThrow("Not a member of the active organization");
  });

  // The membership lookup has to match on both columns. Matching only the
  // organization would authorize anyone once a single member existed.
  it("refuses a caller who is a member of a different organization", async () => {
    const userId = await insertUser();
    const otherUserId = await insertUser("other@example.com");
    const orgId = await insertOrganization("acme");
    const otherOrgId = await insertOrganization("globex");

    await db.insert(member).values([
      { userId: otherUserId, organizationId: orgId, role: "owner" },
      { userId, organizationId: otherOrgId, role: "owner" },
    ]);

    await expect(
      createCaller(testCtx({ userId, activeOrgId: orgId })).subscription(),
    ).rejects.toThrow("Not a member of the active organization");
  });

  it("serves personal billing to a user who belongs to no organization", async () => {
    const userId = await insertUser();

    await db
      .insert(subscription)
      .values({ referenceId: userId, plan: "starter", status: "active" });

    await expect(
      createCaller(testCtx({ userId })).subscription(),
    ).resolves.toMatchObject({ plan: "starter", canManage: true });
  });

  // Better Auth rejects a plain member's checkout, so the answer has to reach
  // the UI before it offers the button.
  it.each([
    ["owner", true],
    ["admin", true],
    ["member", false],
  ] as const)("reports canManage %s -> %s", async (role, canManage) => {
    const userId = await insertUser();
    const orgId = await insertOrganization("acme");

    await db.insert(member).values({ userId, organizationId: orgId, role });

    await expect(
      createCaller(testCtx({ userId, activeOrgId: orgId })).subscription(),
    ).resolves.toMatchObject({ canManage });
  });
});
