import { describe, expect, it, vi } from "vitest";
import { findInitialOrganization } from "./auth";

/** Shape of the `orderBy` callback, reduced to what this test drives it with. */
type OrderBy = (
  columns: Record<string, string>,
  ops: { asc: (column: string) => string },
) => string[];

function stubDb(membership?: { organizationId: string }) {
  const findFirst = vi.fn().mockResolvedValue(membership);
  const db = { query: { member: { findFirst } } } as unknown as Parameters<
    typeof findInitialOrganization
  >[0];

  return { db, findFirst };
}

describe("findInitialOrganization", () => {
  it("returns the organization of the matched membership", async () => {
    const { db } = stubDb({ organizationId: "org_1" });

    await expect(findInitialOrganization(db, "usr_1")).resolves.toBe("org_1");
  });

  it("returns null for a user with no membership", async () => {
    const { db } = stubDb();

    // Signing up does not create an organization, so this is the common case
    // on a first session, not an error.
    await expect(findInitialOrganization(db, "usr_1")).resolves.toBeNull();
  });

  it("orders by createdAt, then id", async () => {
    // Two memberships written in one transaction can share a createdAt. Without
    // the second key the active organization flips between sign-ins.
    const { db, findFirst } = stubDb({ organizationId: "org_1" });

    await findInitialOrganization(db, "usr_1");

    const { orderBy } = findFirst.mock.calls[0][0] as { orderBy: OrderBy };
    const order = orderBy(
      { createdAt: "createdAt", id: "id" },
      { asc: (c) => c },
    );

    expect(order).toEqual(["createdAt", "id"]);
  });
});
