# ADR-001 Auth Hint Cookie For Edge Routing

**Status:** Accepted
**Date:** 2025-12-28
**Tags:** auth, routing, edge

## Problem

The web edge needs a fast signal to route `/` without owning auth logic.

## Decision

Use a dedicated auth-hint cookie set on login and cleared on logout or invalid session. The web worker checks only cookie presence to route, while the app remains the authority. No API calls or session validation in `web`.

This cookie is NOT a security boundary. It is a routing hint only. False positives are acceptable and result in one extra redirect to `/login`.

## Implementation Notes

- Cookie name: `__Host-auth` in HTTPS; `auth` in HTTP dev (browsers reject `__Host-` without Secure).
- Cookie lifecycle: set on new session; clear on sign-out; clear on session-check failure.
- Web routing: check for either cookie name; never read session cookies.

## Alternatives Considered

1. **Validate session in web via API** – Couples edge to auth, adds latency/failure modes.
2. **Read Better Auth session cookie directly** – Brittle to auth library changes and cookie formats.

## Consequences

- **Positive:** Faster edge routing, clear separation of concerns, auth-lib agnostic.
- **Negative:** False positives cause one extra redirect; requires maintaining set/clear hooks.

## Links

- https://github.com/kriasoft/react-starter-kit/issues/2101
