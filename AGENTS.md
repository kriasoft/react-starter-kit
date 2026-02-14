## Monorepo Structure

- `apps/web/` — Edge worker; routes traffic to app/api workers via service bindings
- `apps/app/` — Main SPA (React, TanStack Router file-based routing)
- `apps/api/` — API server (Hono + tRPC + Better Auth)
- `apps/email/` — React Email templates (built before API dev server starts)
- `packages/ui/` — shadcn/ui components (new-york style)
- `packages/core/` — Shared utilities
- `db/` — Drizzle ORM schemas and migrations (Neon PostgreSQL)
- `infra/` — Terraform (Cloudflare Workers, Hyperdrive, DNS)
- `docs/` — VitePress docs; `docs/adr/` for architecture decision records

## Tech Stack

- **Runtime:** Bun >=1.3.0, TypeScript 5.9, ESM (`"type": "module"`)
- **Frontend:** React 19, TanStack Router, TanStack Query, Jotai, shadcn/ui (new-york), Tailwind CSS v4
- **Backend:** Hono, tRPC 11, Better Auth (email OTP, passkey, Google OAuth, organizations)
- **Database:** Neon PostgreSQL, Drizzle ORM (`snake_case` casing), Cloudflare Hyperdrive
- **Email:** React Email, Resend
- **Testing:** Vitest, Happy DOM
- **Deployment:** Cloudflare Workers (Wrangler), Terraform

## Commands

```bash
bun dev                        # Start web + api + app concurrently
bun build                      # Build email → web → api → app (in order)
bun test                       # Vitest (single run, not watch)
bun lint                       # ESLint with cache
bun typecheck                  # tsc --build
bun ui:add <component>         # Add shadcn/ui component to packages/ui

# Per-app: bun {web,app,api}:{dev,build,test,deploy}
# Database: bun db:{push,generate,migrate,studio,seed} (append :staging or :prod)
```

## Architecture

- Three workers: web (edge router), app (SPA assets), api (Hono server).
- API worker has `nodejs_compat` enabled; web and app workers do NOT.
- Web worker routes: `/api/*` → API worker, app routes → App worker, static → assets.
- Service bindings connect workers internally (no public cross-worker URLs).
- Database, auth, routing, and tRPC conventions are in subdirectory `AGENTS.md` files.

## Design Philosophy

- Simplest correct solution. No speculative abstractions — add them only when a real second use case exists.
- No superficial work: no coverage-only tests, no redundant comments, no wrappers that just forward calls.
- Fail loudly in core logic. Do not silently swallow errors or mask incorrect state.
- Three similar lines are better than a premature abstraction.
- Prefer explicit, readable code over clever or compressed patterns.
- Use precise TypeScript types. Avoid `any` and unnecessary type assertions — let the compiler enforce correctness.
- Document non-obvious trade-offs and decisions. Explain why, not what — every word must add value.
