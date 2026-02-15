import { describe, expect, it } from "vitest";
import { billingQueryKey, billingQueryOptions } from "./billing";

describe("billingQueryOptions", () => {
  it("includes activeOrgId in query key", () => {
    const { queryKey } = billingQueryOptions("org-123");
    expect(queryKey).toEqual(["billing", "subscription", "org-123"]);
  });

  it("normalizes undefined to null in query key", () => {
    const { queryKey } = billingQueryOptions(undefined);
    expect(queryKey).toEqual(["billing", "subscription", null]);
  });

  it("normalizes missing arg to null in query key", () => {
    const { queryKey } = billingQueryOptions();
    expect(queryKey).toEqual(["billing", "subscription", null]);
  });

  it("preserves explicit null in query key", () => {
    const { queryKey } = billingQueryOptions(null);
    expect(queryKey).toEqual(["billing", "subscription", null]);
  });

  it("produces distinct keys for different orgs", () => {
    expect(billingQueryOptions("org-1").queryKey).not.toEqual(
      billingQueryOptions("org-2").queryKey,
    );
  });
});

describe("billingQueryKey", () => {
  it("is a prefix of the full query key for bulk invalidation", () => {
    const { queryKey } = billingQueryOptions("org-1");
    expect(queryKey.slice(0, billingQueryKey.length)).toEqual([
      ...billingQueryKey,
    ]);
  });
});
