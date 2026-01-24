import { describe, expect, it } from "vitest";
import { isAuthError } from "./auth-error-boundary";

describe("isAuthError", () => {
  it("returns true for 401 status", () => {
    expect(isAuthError({ status: 401 })).toBe(true);
  });

  it("returns false for 403 status (authorization, not authentication)", () => {
    expect(isAuthError({ status: 403 })).toBe(false);
  });

  it("returns false for other status codes", () => {
    expect(isAuthError({ status: 500 })).toBe(false);
    expect(isAuthError({ status: 404 })).toBe(false);
  });

  it("returns false for non-error values", () => {
    expect(isAuthError(null)).toBe(false);
    expect(isAuthError("error")).toBe(false);
    expect(isAuthError({})).toBe(false);
  });

  it("detects 401 in nested cause", () => {
    expect(isAuthError({ cause: { status: 401 } })).toBe(true);
  });
});
