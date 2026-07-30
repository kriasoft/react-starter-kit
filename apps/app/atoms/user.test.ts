import { createStore } from "jotai";
import { queryClientAtom } from "jotai-tanstack-query";
import { QueryClient } from "@tanstack/react-query";
import { describe, expect, it } from "vitest";
import { sessionQueryKey } from "@/lib/queries/session";
import {
  authTokenAtom,
  isAuthenticatedAtom,
  userDisplayNameAtom,
  userInitialsAtom,
} from "./user";

function createTestStore(sessionData: unknown) {
  const store = createStore();
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  queryClient.setQueryData(sessionQueryKey, sessionData);
  store.set(queryClientAtom, queryClient);
  return store;
}

describe("userDisplayNameAtom", () => {
  it("returns Guest when user is null", () => {
    const store = createTestStore(null);
    expect(store.get(userDisplayNameAtom)).toBe("Guest");
  });

  it("returns user name when available", () => {
    const store = createTestStore({
      user: { id: "1", name: "Alice" },
      session: { id: "s1" },
    });
    expect(store.get(userDisplayNameAtom)).toBe("Alice");
  });

  it("returns email when name is missing", () => {
    const store = createTestStore({
      user: { id: "1", email: "alice@test.com" },
      session: { id: "s1" },
    });
    expect(store.get(userDisplayNameAtom)).toBe("alice@test.com");
  });
});

describe("userInitialsAtom", () => {
  it("returns G when user is null", () => {
    const store = createTestStore(null);
    expect(store.get(userInitialsAtom)).toBe("G");
  });

  it("returns single initial from name", () => {
    const store = createTestStore({
      user: { id: "1", name: "Alice" },
      session: { id: "s1" },
    });
    expect(store.get(userInitialsAtom)).toBe("A");
  });

  it("returns two initials from full name", () => {
    const store = createTestStore({
      user: { id: "1", name: "Alice Bob" },
      session: { id: "s1" },
    });
    expect(store.get(userInitialsAtom)).toBe("AB");
  });

  it("returns initial from email when name missing", () => {
    const store = createTestStore({
      user: { id: "1", email: "alice@test.com" },
      session: { id: "s1" },
    });
    expect(store.get(userInitialsAtom)).toBe("A");
  });
});

describe("isAuthenticatedAtom", () => {
  it("returns false when session is null", () => {
    const store = createTestStore(null);
    expect(store.get(isAuthenticatedAtom)).toBe(false);
  });

  it("returns true when session data exists", () => {
    const store = createTestStore({
      user: { id: "1", name: "Alice" },
      session: { id: "s1" },
    });
    expect(store.get(isAuthenticatedAtom)).toBe(true);
  });
});

describe("authTokenAtom", () => {
  it("returns null when no session", () => {
    const store = createTestStore(null);
    expect(store.get(authTokenAtom)).toBeNull();
  });

  it("returns session token when available", () => {
    const store = createTestStore({
      user: { id: "1", name: "Alice" },
      session: { id: "s1", token: "tok_123" },
    });
    expect(store.get(authTokenAtom)).toBe("tok_123");
  });
});
