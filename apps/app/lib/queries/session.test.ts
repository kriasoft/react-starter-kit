import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { createElement, type ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import {
  getCachedSession,
  isValidSession,
  sessionQueryKey,
  useSignOut,
  type SessionData,
} from "./session";

type AuthModule = typeof import("../auth");

// Only the one method `useSignOut` reaches for; the rest of the client is a
// Better Auth instance with no bearing on this behaviour. `vi.hoisted` because
// the mock factory is lifted above every other statement in this file.
const { signOut } = vi.hoisted(() => ({ signOut: vi.fn() }));
vi.mock(import("../auth"), () => ({
  auth: { signOut } as unknown as AuthModule["auth"],
}));

function createQueryClient() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
}

/** Builds the malformed payloads the type prohibits but the network can return. */
function sessionResponse(value: unknown): SessionData {
  return value as SessionData;
}

describe("isValidSession", () => {
  it("rejects an absent session", () => {
    expect(isValidSession(undefined)).toBe(false);
    expect(isValidSession(null)).toBe(false);
  });

  // Every auth decision goes through this, so a response carrying one field
  // without the other must not pass: a page would render with no user.
  it("rejects a partial session", () => {
    expect(isValidSession(sessionResponse({ session: { id: "1" } }))).toBe(
      false,
    );
    expect(isValidSession(sessionResponse({ user: { id: "1" } }))).toBe(false);
  });

  it("accepts a session carrying both user and session", () => {
    const session = sessionResponse({
      user: { id: "user-1", email: "test@example.com" },
      session: { id: "session-1", expiresAt: new Date() },
    });
    expect(isValidSession(session)).toBe(true);
  });
});

describe("useSignOut", () => {
  // The whole point of checking Better Auth's `{ error }`: the server session
  // outlived the request, so a cleared cache would show a signed-out UI over a
  // live session and the login guard would bounce the user back into the app.
  it("leaves the cached session alone when sign-out fails", async () => {
    signOut.mockResolvedValue({ error: { message: "Failed to fetch" } });

    const queryClient = createQueryClient();
    const session = { user: { id: "user-1" }, session: { id: "session-1" } };
    queryClient.setQueryData(sessionQueryKey, session);

    const { result } = renderHook(() => useSignOut(), {
      wrapper: ({ children }: { children: ReactNode }) =>
        createElement(QueryClientProvider, { client: queryClient }, children),
    });
    result.current.mutate();

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(getCachedSession(queryClient)).toEqual(session);
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
