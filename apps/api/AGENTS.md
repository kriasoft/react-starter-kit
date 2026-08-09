## Auth

- Server config in `lib/auth.ts`. Better Auth `account` table renamed to `identity` via `account.modelName: "identity"`.
- Auth hint cookie: set/cleared in Better Auth hooks (sign-in, sign-out). NOT a security boundary — false positives cause one redirect. See `docs/adr/001-auth-hint-cookie.md`.
- Session types: `AuthUser` and `AuthSession` from `Auth["$Infer"]["Session"]`.

## Database

- Two Hyperdrive connections: `db` (uncached, always fresh) and `dbCached` (query cache, 75s default maximum staleness). Deployments can tune the cache window. Default to `db`; reach for `dbCached` only when you can say why staleness is acceptable. Never use it for auth, permissions, billing state, or a read after a write — Hyperdrive does not invalidate on write.
- Prepared statements stay enabled; Hyperdrive only caches queries it sees prepared. Requires an unpooled origin.
- `max: 1` connection per client, because each request builds two.
- `transform: { undefined: null }` converts JS `undefined` to SQL `NULL`.

## tRPC

- `publicProcedure` and `protectedProcedure` defined in `lib/trpc.ts`.
- `protectedProcedure` throws `UNAUTHORIZED` if `ctx.session` or `ctx.user` is null, then narrows both to non-null in downstream context.
- Router in `lib/app.ts` combines routers from `routers/`. Input validation with Zod.

## Email

- Fresh `Resend` client per invocation via `createResendClient()`.
- Requires both HTML and plain text — use `renderEmailToHtml()` + `renderEmailToText()` from `@repo/email`.
- Validates recipients with Zod before sending.

## Request Context

- `ctx.cache: Map<string | symbol, unknown>` — request-scoped cache.
- DataLoaders use `defineLoader(symbol, batchFn)` helper — handles cache check, instance creation, and typing. See `lib/loaders.ts`.
- AI provider instances (OpenAI) also cached per-request via same pattern.

## Environment

- `lib/env.ts` exports the environment contract and inferred `Env` type. The current entrypoints do not call `parse`; do not claim runtime Zod validation unless that changes. `worker.ts` receives Cloudflare bindings through `c.env`, while `dev.ts` combines the Wrangler proxy with `process.env`.
- `dev.ts` derives its generic local-env overlay from `envSchema`, excluding fields with special precedence. New schema fields therefore join the local merge automatically.
- Do not add generated Wrangler types. They create a competing global `Env`, omit secrets not visible in `wrangler.jsonc`, and narrow placeholder vars to literals such as `APP_NAME: "Example"`. The local `CloudflareEnv` types combine the schema-derived `Env` with Hyperdrive bindings.
- `nodejs_compat` compatibility flag required — web and app workers do NOT have it.

## Worker Entry

- `worker.ts` is the Cloudflare Workers entrypoint (`export default`). Hono middleware stack: `secureHeaders` → `requestId` (CF-Ray or UUID) → `logger` → context init (Drizzle + auth instances).
