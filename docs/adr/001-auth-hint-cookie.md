# ADR-001 Auth Hint Cookie For Edge Routing

**Status:** Accepted  
**Date:** 2025-12-28  
**Tags:** auth, routing, edge, cookie

## Problem

- The web edge needs a fast signal to route `/` and `/home` without owning auth logic.

## Decision

- Use a dedicated auth-hint cookie (`__Host-auth=1`) set on login and cleared on logout/invalid session. The web worker checks only cookie presence to route, while the app remains the authority and redirects on invalid sessions. No API calls or session validation in `web`.

## Alternatives (brief)

- Validate session in `web` via API — couples edge to auth and adds latency/failure modes.
- Read Better Auth session cookie directly — brittle to auth library changes and cookie formats.

## Impact

- Positive: faster edge routing, clear separation of concerns, auth-lib agnostic.
- Negative/Risks: false positives cause one extra redirect; requires setting/clearing the hint cookie in auth flows.

## Links

- https://github.com/kriasoft/react-starter-kit/issues/2101
