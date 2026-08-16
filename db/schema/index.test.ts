/**
 * @file The guarantees the schema makes to the code above it.
 *
 * Cascades and composite uniques live in generated SQL, so nothing in
 * TypeScript notices when a regenerated migration drops one. These assert them
 * against the migrated PGlite database, where the constraint either exists or
 * does not.
 */

import { createTestDatabase } from "@repo/db/testing";
import { eq } from "drizzle-orm";
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import {
  identity,
  invitation,
  member,
  organization,
  passkey,
  session,
  subscription,
  user,
} from "./index";

const { db, reset, close } = await createTestDatabase();

afterAll(close);
beforeEach(reset);

async function insertUser(email = "test@example.com") {
  const [row] = await db
    .insert(user)
    .values({ name: "Test User", email, emailVerified: true })
    .returning();

  return row;
}

async function insertOrganization(slug = "acme") {
  const [row] = await db
    .insert(organization)
    .values({ name: slug, slug })
    .returning();

  return row;
}

describe("prefixed IDs", () => {
  // The prefix comes from `$defaultFn`, not from a column default, so it holds
  // only for writes that go through Drizzle. Better Auth's adapter does.
  // These three tables stand in for the rest; `schema/id.ts` owns the full map.
  it("applies prefixed IDs through Drizzle defaults", async () => {
    const owner = await insertUser();
    const org = await insertOrganization();

    const [membership] = await db
      .insert(member)
      .values({ userId: owner.id, organizationId: org.id, role: "owner" })
      .returning();

    expect(owner.id).toMatch(/^usr_[a-z0-9]{16}$/);
    expect(org.id).toMatch(/^org_[a-z0-9]{16}$/);
    expect(membership.id).toMatch(/^mem_[a-z0-9]{16}$/);
  });
});

describe("cascading deletes", () => {
  it("removes everything hanging off a deleted user", async () => {
    const owner = await insertUser();
    const org = await insertOrganization();

    await db.insert(session).values({
      userId: owner.id,
      token: "token",
      expiresAt: new Date(Date.now() + 60_000),
    });
    await db
      .insert(member)
      .values({ userId: owner.id, organizationId: org.id, role: "owner" });
    await db.insert(identity).values({
      userId: owner.id,
      providerId: "google",
      accountId: "google-1",
    });
    await db.insert(passkey).values({
      userId: owner.id,
      publicKey: "key",
      credentialID: "credential-1",
      deviceType: "platform",
      backedUp: false,
    });
    // `inviterId` is a second, easily missed edge from user: an invitation the
    // deleted user sent but nobody accepted. Without the cascade the delete
    // fails outright on the foreign key.
    await db.insert(invitation).values({
      organizationId: org.id,
      inviterId: owner.id,
      email: "invitee@example.com",
      role: "member",
      expiresAt: new Date(Date.now() + 60_000),
    });

    await db.delete(user).where(eq(user.id, owner.id));

    expect(await db.select().from(session)).toEqual([]);
    expect(await db.select().from(member)).toEqual([]);
    expect(await db.select().from(identity)).toEqual([]);
    expect(await db.select().from(passkey)).toEqual([]);
    expect(await db.select().from(invitation)).toEqual([]);
  });

  it("removes an organization's members and invitations with it", async () => {
    const owner = await insertUser();
    const org = await insertOrganization();

    await db
      .insert(member)
      .values({ userId: owner.id, organizationId: org.id, role: "owner" });
    await db.insert(invitation).values({
      organizationId: org.id,
      inviterId: owner.id,
      email: "invitee@example.com",
      role: "member",
      expiresAt: new Date(Date.now() + 60_000),
    });

    await db.delete(organization).where(eq(organization.id, org.id));

    expect(await db.select().from(member)).toEqual([]);
    expect(await db.select().from(invitation)).toEqual([]);
  });

  // `subscription.referenceId` is polymorphic – it points at a user or an
  // organization – so it cannot carry a foreign key and nothing cascades to it.
  // Deleting either side leaves the billing row behind, which account deletion
  // has to handle itself.
  it("leaves subscriptions behind when their reference is deleted", async () => {
    const owner = await insertUser();

    await db
      .insert(subscription)
      .values({ referenceId: owner.id, plan: "pro", status: "active" });

    await db.delete(user).where(eq(user.id, owner.id));

    expect(await db.select().from(subscription)).toHaveLength(1);
  });
});

describe("uniqueness", () => {
  // The constraint spans both columns: one membership per user per
  // organization, and no limit on how many organizations a user joins.
  it("rejects a duplicate membership but allows a second organization", async () => {
    const owner = await insertUser();
    const org = await insertOrganization("acme");
    const other = await insertOrganization("globex");
    const values = {
      userId: owner.id,
      organizationId: org.id,
      role: "member",
    };

    await db.insert(member).values(values);
    await db.insert(member).values({ ...values, organizationId: other.id });

    await expect(db.insert(member).values(values)).rejects.toMatchObject({
      cause: { constraint: "member_user_org_unique" },
    });
  });

  // A starter limitation, asserted so it is a decision rather than a surprise:
  // Better Auth writes a new row per invitation, so re-inviting an address that
  // was already invited fails until this constraint is removed.
  it("rejects a second invitation for the same organization and email", async () => {
    const owner = await insertUser();
    const org = await insertOrganization();
    const values = {
      organizationId: org.id,
      inviterId: owner.id,
      email: "invitee@example.com",
      role: "member",
      expiresAt: new Date(Date.now() + 60_000),
    };

    await db.insert(invitation).values(values);

    await expect(db.insert(invitation).values(values)).rejects.toMatchObject({
      cause: { constraint: "invitation_org_email_unique" },
    });
  });

  it("rejects a second identity for the same provider account", async () => {
    const first = await insertUser("first@example.com");
    const second = await insertUser("second@example.com");
    const values = { providerId: "google", accountId: "google-1" };

    await db.insert(identity).values({ ...values, userId: first.id });

    await expect(
      db.insert(identity).values({ ...values, userId: second.id }),
    ).rejects.toMatchObject({
      cause: { constraint: "identity_provider_account_unique" },
    });
  });

  it("rejects a duplicate organization slug", async () => {
    await insertOrganization("acme");

    await expect(insertOrganization("acme")).rejects.toMatchObject({
      cause: { constraint: "organization_slug_unique" },
    });
  });
});
