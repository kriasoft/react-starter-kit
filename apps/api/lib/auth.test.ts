import { member, organization, user } from "@repo/db";
import { createTestDatabase } from "@repo/db/testing";
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { findInitialOrganization } from "./auth";

const { db, reset, close } = await createTestDatabase();

afterAll(close);
beforeEach(reset);

async function insertUser(email: string) {
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

describe("findInitialOrganization", () => {
  it("returns the organization the user belongs to", async () => {
    const userId = await insertUser("owner@example.com");
    const orgId = await insertOrganization("acme");

    await db
      .insert(member)
      .values({ userId, organizationId: orgId, role: "owner" });

    await expect(findInitialOrganization(db, userId)).resolves.toBe(orgId);
  });

  // The lookup has to filter by user. Without that predicate the first session
  // of any new user would activate a stranger's organization.
  it("ignores another user's membership", async () => {
    const userId = await insertUser("newcomer@example.com");
    const otherUserId = await insertUser("stranger@example.com");
    const orgId = await insertOrganization("acme");

    await db
      .insert(member)
      .values({ userId: otherUserId, organizationId: orgId, role: "owner" });

    await expect(findInitialOrganization(db, userId)).resolves.toBeNull();
  });

  it("returns null for a user with no membership", async () => {
    const userId = await insertUser("solo@example.com");

    // Signing up does not create an organization, so this is the common case
    // on a first session, not an error.
    await expect(findInitialOrganization(db, userId)).resolves.toBeNull();
  });

  it("picks the oldest membership", async () => {
    const userId = await insertUser("member@example.com");
    const newerOrgId = await insertOrganization("newer");
    const olderOrgId = await insertOrganization("older");

    // Newer inserted first, so insertion order alone would return the wrong one.
    await db.insert(member).values([
      {
        userId,
        organizationId: newerOrgId,
        role: "member",
        createdAt: new Date("2025-06-01T00:00:00.000Z"),
      },
      {
        userId,
        organizationId: olderOrgId,
        role: "member",
        createdAt: new Date("2025-01-01T00:00:00.000Z"),
      },
    ]);

    await expect(findInitialOrganization(db, userId)).resolves.toBe(olderOrgId);
  });

  // Two memberships written in one transaction can share a createdAt. Without
  // the second sort key the active organization flips between sign-ins.
  it("breaks a createdAt tie by id", async () => {
    const userId = await insertUser("tied@example.com");
    const firstOrgId = await insertOrganization("first");
    const secondOrgId = await insertOrganization("second");
    const createdAt = new Date("2025-01-01T00:00:00.000Z");

    // Higher id inserted first: with no tie-break, heap order returns it.
    await db.insert(member).values([
      {
        id: "mem_zzzzzzzzzzzzzzzz",
        userId,
        organizationId: firstOrgId,
        role: "member",
        createdAt,
      },
      {
        id: "mem_aaaaaaaaaaaaaaaa",
        userId,
        organizationId: secondOrgId,
        role: "member",
        createdAt,
      },
    ]);

    await expect(findInitialOrganization(db, userId)).resolves.toBe(
      secondOrgId,
    );
  });
});
