## Auth

- Server config in `lib/auth.ts`. Better Auth `account` table renamed to `identity` via `account.modelName: "identity"`.
- Auth hint cookie: set/cleared in Better Auth hooks (sign-in, sign-out). NOT a security boundary – false positives cause one redirect. See `docs/adr/001-auth-hint-cookie.md`.
- `databaseHooks.session.create.before` seeds `activeOrganizationId` via `findInitialOrganization()`. Better Auth leaves it null on every new session, which would silently drop org-scoped views and billing back to personal after each sign-in.
- Session types: `AuthUser` and `AuthSession` from `Auth["$Infer"]["Session"]`.

## Database

- Two Hyperdrive connections: `db` (uncached, always fresh) and `dbCached` (served from the cache window Terraform configures). Default to `db`; reach for `dbCached` only when you can say why staleness is acceptable. Never use it for auth, permissions, billing state, or a read after a write – Hyperdrive does not invalidate on write.
- Prepared statements stay enabled; Hyperdrive only caches queries it sees prepared. Requires an unpooled origin.
- `max: 1` connection per client, because each request builds two.
- `transform: { undefined: null }` converts JS `undefined` to SQL `NULL`.

## tRPC

- `publicProcedure` and `protectedProcedure` defined in `lib/trpc.ts`.
- `protectedProcedure` throws `UNAUTHORIZED` if `ctx.session` or `ctx.user` is null, then narrows both to non-null in downstream context.
- Authenticated is not authorized. `ctx.session.activeOrganizationId` selects a tenant scope; it does not prove membership, because a session outlives a membership removal. Any procedure reading org-scoped data must verify `member(organizationId, userId)` against `ctx.db` first – `routers/billing.ts` is the shipped example. The Stripe plugin's `authorizeReference` covers only its own endpoints, never ours.
- Router in `lib/app.ts` combines routers from `routers/`. Input validation with Zod.

## Email

- `sendEmail()` is the only function that touches the provider SDK, so the templated senders stay provider-agnostic. It builds a fresh `Resend` per invocation – a module-level client would outlive the env it was built from. The `RESEND_*` names are still part of the env contract (`lib/env.ts`, `AuthEnv`, `wrangler.jsonc`), so swapping providers is not confined to this file.
- `EmailOptions.text` is required, `html` optional – the type, not a runtime check, is what prevents an HTML-only send. Render both with `renderEmailToHtml()` + `renderEmailToText()` from `@repo/email`.
- Validates recipients with Zod before sending.

## Environment

- `lib/env.ts` exports the environment contract and inferred `Env` type. The current entrypoints do not call `parse`; do not claim runtime Zod validation unless that changes. `worker.ts` receives Cloudflare bindings through `c.env`, while `dev.ts` combines the Wrangler proxy with `process.env`.
- `dev.ts` derives its generic local-env overlay from `envSchema`, excluding fields with special precedence. New schema fields therefore join the local merge automatically.
- Do not add generated Wrangler types. They create a competing global `Env`, omit secrets not visible in `wrangler.jsonc`, and narrow placeholder vars to literals such as `APP_NAME: "Example"`. The local `CloudflareEnv` types combine the schema-derived `Env` with Hyperdrive bindings.
- `nodejs_compat` compatibility flag required – web and app workers do NOT have it.

## Worker Entry

- `worker.ts` is the Cloudflare Workers entrypoint (`export default`). Hono middleware stack: `secureHeaders` → `requestId` (CF-Ray or UUID) → `logger` → context init (Drizzle + auth instances).
