## Monorepo Structure

- `apps/web/` — Astro marketing site, served by an edge worker that also routes traffic to the app/api workers via service bindings
- `apps/app/` — Main SPA (React, TanStack Router file-based routing)
- `apps/api/` — API server (Hono + tRPC + Better Auth)
- `apps/email/` — React Email templates (built before API dev server starts)
- `packages/ui/` — shadcn/ui components (new-york style)
- `packages/core/` — Shared utilities
- `db/` — Drizzle ORM schemas and migrations (Neon PostgreSQL)
- `infra/` — Terraform (Hyperdrive and optional R2 storage; Wrangler owns Workers and DNS)
- `docs/` — VitePress docs; `docs/adr/` for architecture decision records

## Tech Stack

- **Runtime:** Bun >=1.3.0, TypeScript 6.0, ESM (`"type": "module"`)
- **Frontend:** React 19, TanStack Router, TanStack Query, Jotai, shadcn/ui (new-york), Tailwind CSS v4
- **Backend:** Hono, tRPC 11, Better Auth (email OTP, passkey, Google OAuth, organizations)
- **Database:** Neon PostgreSQL, Drizzle ORM (`snake_case` casing), Cloudflare Hyperdrive
- **Email:** React Email, Resend
- **Testing:** Vitest, Happy DOM
- **Deployment:** Cloudflare Workers (Wrangler), Terraform

## Commands

```bash
bun dev                        # Start web + api + app concurrently
bun run build                  # Build email, web, api, and app workspaces
bun run test                   # Vitest (watch mode; --run for single run)
bun lint                       # ESLint with cache
bun typecheck                  # tsc --build (builds apps/email for its types)
bun infra:check                # Terraform fmt + validate, no credentials or state
bun ui:add <component>         # Add shadcn/ui component to packages/ui

# Per-app: bun {web,app,api}:{dev,build,deploy}; test for app/api, check for web
# Database: bun db:{push,generate,migrate,studio,seed,export}
#   :staging / :production on migrate, studio, export; seed stops at :staging;
#   push and generate are local-only
```

## Verification

- Run the narrowest checks covering what you changed, then report what you ran. Never imply verification you did not perform.
- Do not run migrations, deployments, or Terraform `plan`/`apply` unless explicitly asked — they act on shared environments.

## Architecture

- Three workers: web (marketing site + edge router), app (SPA assets), api (Hono server).
- API worker has `nodejs_compat` enabled; web and app workers do NOT.
- Web worker routes: `/api/*` → API worker, app routes → App worker, static → assets.
- Service bindings connect workers internally (no public cross-worker URLs).
- Per-workspace conventions live in subdirectory `AGENTS.md` files: `apps/api/`, `apps/app/`, `db/`, `infra/`, `packages/ui/`.

## Agent Tooling

- `AGENTS.md` files are the canonical instructions; per-tool files (`CLAUDE.md`, `.gemini/settings.json`) only point at them.
- **Every directory with an `AGENTS.md` needs a sibling `CLAUDE.md` containing `@AGENTS.md`.** Codex scopes nested `AGENTS.md` to its directory tree natively; Claude Code's nested lookup matches only `CLAUDE.md`, so without the adapter it never loads the scoped file. Adding a scoped `AGENTS.md` without one is a silent no-op for Claude.
- **Skills live in `.agents/skills/<name>/SKILL.md`, symlinked into `.claude/skills/<name>/`.** Both vendors build on the Agent Skills format, but only the discovery paths differ: Codex scans `.agents/skills/` from the repo root natively, Claude Code scans `.claude/skills/`. One canonical copy plus a symlink is what makes a skill visible to both. Third-party skills installed by the `skills` CLI are tracked in `skills-lock.json` — do not hand-edit those directories.
- Skills are for workflows the model should recognise and reach for on its own; their `description` is the trigger. A prompt you invoke deliberately stays a Claude Code command in `.claude/commands/<name>.md`, which has no portable equivalent.
- `*.local.md` and `*.local.json` are gitignored — personal prompts and settings stay out of the repo.

## Design Philosophy

- Simplest correct solution. No speculative abstractions — add them only when a real second use case exists.
- No superficial work: no coverage-only tests, no redundant comments, no wrappers that just forward calls.
- Fail loudly in core logic. Do not silently swallow errors or mask incorrect state.
- Three similar lines are better than a premature abstraction.
- Prefer explicit, readable code over clever or compressed patterns.
- Use precise TypeScript types. Avoid `any` and unnecessary type assertions — let the compiler enforce correctness.
- Document non-obvious trade-offs and decisions. Explain why, not what — every word must add value.

## Markdown

- Prose is not hard-wrapped: keep each paragraph on one line and use paragraphs, lists and headings for structure. Prettier enforces this with `proseWrap: "never"`.
- Keep a blank line after a VitePress container's opening marker and before its closing `:::`. Prettier does not recognise `:::`, so an adjacent line gets folded into the marker, turning the body into the container title and swallowing everything up to the next `:::`.
