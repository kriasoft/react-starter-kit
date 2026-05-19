import { describe, expect, it } from "vitest";
import { formatLocalDateKey } from "./dates";

describe("formatLocalDateKey", () => {
  it("uses the local calendar day instead of the UTC day", () => {
    const lateLocalEvening = new Date(2026, 0, 1, 22, 30);

    expect(formatLocalDateKey(lateLocalEvening)).toBe("2026-01-01");
  });
});
