import { QueryClient } from "@tanstack/react-query";
import { describe, expect, it } from "vitest";
import { getCachedSession, isAuthenticated, sessionQueryKey } from "./session";

function createQueryClient() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
}

describe("isAuthenticated", () => {
  it("returns false when no session data cached", () => {
    const queryClient = createQueryClient();
    expect(isAuthenticated(queryClient)).toBe(false);
  });

  it("returns false when session is null", () => {
    const queryClient = createQueryClient();
    queryClient.setQueryData(sessionQueryKey, null);
    expect(isAuthenticated(queryClient)).toBe(false);
  });

  it("returns false when user is missing", () => {
    const queryClient = createQueryClient();
    queryClient.setQueryData(sessionQueryKey, {
      session: { id: "1" },
      user: null,
    });
    expect(isAuthenticated(queryClient)).toBe(false);
  });

  it("returns false when session is missing", () => {
    const queryClient = createQueryClient();
    queryClient.setQueryData(sessionQueryKey, {
      user: { id: "1" },
      session: null,
    });
    expect(isAuthenticated(queryClient)).toBe(false);
  });

  it("returns true when both user and session exist", () => {
    const queryClient = createQueryClient();
    queryClient.setQueryData(sessionQueryKey, {
      user: { id: "user-1", email: "test@example.com" },
      session: { id: "session-1", expiresAt: new Date() },
    });
    expect(isAuthenticated(queryClient)).toBe(true);
  });
});

describe("getCachedSession", () => {
  it("returns undefined when no data cached", () => {
    const queryClient = createQueryClient();
    expect(getCachedSession(queryClient)).toBeUndefined();
  });

  it("returns cached session data", () => {
    const queryClient = createQueryClient();
    const sessionData = {
      user: { id: "user-1" },
      session: { id: "session-1" },
    };
    queryClient.setQueryData(sessionQueryKey, sessionData);
    expect(getCachedSession(queryClient)).toEqual(sessionData);
  });
});
