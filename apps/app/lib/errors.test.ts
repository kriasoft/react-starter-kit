import { describe, expect, it } from "vitest";
import { getErrorMessage, getErrorStatus } from "./errors";

describe("getErrorStatus", () => {
  it("returns undefined for non-objects", () => {
    expect(getErrorStatus(null)).toBeUndefined();
    expect(getErrorStatus(undefined)).toBeUndefined();
    expect(getErrorStatus("string")).toBeUndefined();
    expect(getErrorStatus(123)).toBeUndefined();
  });

  it("extracts direct status property", () => {
    expect(getErrorStatus({ status: 401 })).toBe(401);
    expect(getErrorStatus({ status: 500 })).toBe(500);
  });

  it("ignores non-numeric status", () => {
    expect(getErrorStatus({ status: "401" })).toBeUndefined();
    expect(getErrorStatus({ status: null })).toBeUndefined();
  });

  it("extracts nested response.status (axios-style)", () => {
    expect(getErrorStatus({ response: { status: 403 } })).toBe(403);
  });

  it("follows error cause chain", () => {
    const nested = { status: 401 };
    const wrapper = { cause: nested };
    expect(getErrorStatus(wrapper)).toBe(401);
  });

  it("handles deep cause chains", () => {
    const deep = { cause: { cause: { cause: { status: 500 } } } };
    expect(getErrorStatus(deep)).toBe(500);
  });

  it("handles circular cause references without stack overflow", () => {
    const circular: Record<string, unknown> = { status: undefined };
    circular.cause = circular;
    expect(getErrorStatus(circular)).toBeUndefined();
  });

  it("prefers direct status over nested", () => {
    expect(getErrorStatus({ status: 401, response: { status: 500 } })).toBe(
      401,
    );
  });
});

describe("getErrorMessage", () => {
  it("extracts message from Error instances", () => {
    expect(getErrorMessage(new Error("Something broke"))).toBe(
      "Something broke",
    );
  });

  it("returns string errors directly", () => {
    expect(getErrorMessage("Direct error message")).toBe(
      "Direct error message",
    );
  });

  it("extracts statusText from Response-like objects", () => {
    expect(getErrorMessage({ statusText: "Not Found" })).toBe("Not Found");
  });

  it("returns fallback for unknown error shapes", () => {
    expect(getErrorMessage(null)).toBe("An unexpected error occurred");
    expect(getErrorMessage(undefined)).toBe("An unexpected error occurred");
    expect(getErrorMessage({})).toBe("An unexpected error occurred");
    expect(getErrorMessage({ statusText: "" })).toBe(
      "An unexpected error occurred",
    );
  });
});
