# Security Checklist

Use this checklist when changing authentication, authorization, data access, or deployment configuration. It records the safeguards this repository actually has and the gaps an application owner must close before production.

## Existing Safeguards

- The browser uses one public origin. The web worker forwards API requests over a service binding, so the default deployment needs no CORS policy.
- Better Auth validates its own requests against `APP_ORIGIN`; sessions use HTTP-only cookies.
- `protectedProcedure` rejects requests without both a session and user.
- Better Auth, authorization, billing, and read-after-write paths use the uncached database binding. Cached reads are opt-in and may be 75 seconds old with the default Hyperdrive settings.
- API responses pass through Hono's `secureHeaders()` middleware. Static web assets have a CSP and other headers in `apps/web/public/_headers`.
- Wrangler requires `BETTER_AUTH_SECRET` and `RESEND_API_KEY` before a deployed API version is accepted. Optional integrations validate complete credential sets at their feature boundary.
- CI runs formatting, linting, type checking, tests, builds, and Terraform validation. Application deployment remains disabled in the starter kit until credentials are configured.

The auth-hint cookie is routing metadata, not authentication. A protected route must always trust the Better Auth session from the API, never the hint.

## Code Review

### Inputs and outputs

- [ ] Give every tRPC procedure that accepts data a bounded Zod input schema.
- [ ] Validate upload type, size, ownership, and object key on the server. The client-provided MIME type and filename are not authoritative.
- [ ] Do not render untrusted HTML. If a feature genuinely needs HTML, select a maintained sanitizer and test the allowed markup explicitly.
- [ ] Return public response shapes rather than database rows containing fields the caller does not need.

### Authentication and authorization

- [ ] Use `protectedProcedure` for signed-in operations.
- [ ] Check ownership, organization membership, and role for the specific resource inside every protected read and mutation. Authentication alone is not authorization.
- [ ] Keep auth, permission, billing, and read-after-write queries on `ctx.db`, not `ctx.dbCached`.
- [ ] Treat Google and Stripe as complete sets: both Google credentials, or all four required Stripe values. Do not reintroduce silent partial setup.
- [ ] Do not log OTPs, session cookies, authorization headers, API keys, full database URLs, or unnecessary personal data in production.

### Browser and API boundaries

- [ ] Keep redirect destinations relative and pass them through `getSafeRedirectUrl()`.
- [ ] Keep the API same-origin unless the move includes an explicit CORS and CSRF design. Better Auth's origin checks do not protect arbitrary tRPC mutations.
- [ ] Revisit both static header files when adding third-party scripts, fonts, images, frames, or network origins.
- [ ] Avoid storing session material or other secrets in `localStorage`.

## Before Deployment

### Configuration

- [ ] Replace placeholder Worker names, domains, Hyperdrive IDs, database URLs, and application names.
- [ ] Generate a unique `BETTER_AUTH_SECRET` for each environment and store it with Wrangler, never in a committed env file.
- [ ] Set `RESEND_EMAIL_FROM` to a sender on a verified domain. The default `onboarding@resend.dev` cannot deliver OTPs to normal users.
- [ ] Set Google credentials together, Stripe's four required values together, and leave unused optional integrations unset.
- [ ] Confirm `APP_ORIGIN`, Google callback URLs, Stripe webhook URLs, and service-binding targets all use the intended environment.
- [ ] Apply reviewed migrations with `db:migrate:staging` or `db:migrate:production`; do not use `db:push` outside local development.

### Edge controls

- [ ] Add and test a CSP for `apps/app`. It is intentionally deferred because the current inline theme script and Google Fonts need explicit handling.
- [ ] Configure Cloudflare rate limiting for authentication and other abuse-prone endpoints. No in-process map can enforce a global limit across Worker isolates; use a WAF rule or a Rate Limiting binding.
- [ ] Verify headers on deployed web, app, and API responses rather than only in local builds.
- [ ] Keep preview URLs disabled unless their authentication, service bindings, and data isolation have been reviewed.

### Repository and operations

- [ ] Enable branch protection, dependency alerts, and secret scanning on the hosting repository.
- [ ] Give GitHub and HCP Terraform tokens only the scopes documented in [CI/CD](/deployment/ci-cd) and [Infrastructure](/specs/infra-terraform).
- [ ] Configure log retention and alerts without recording secrets or sensitive request bodies.
- [ ] Test database restoration and Worker rollback. A Worker rollback does not reverse a database migration.
- [ ] Assign an incident contact and rehearse the [incident playbook](./incident-playbook) with application-specific details.

## Verification

Run the repository checks before deployment:

```bash
bun prettier --check .
bun lint
bun typecheck
bun run test -- --run
bun web:check
bun docs:build
bun infra:check
```

Then test the deployed environment:

- [ ] Email OTP delivery, expiry, and failed-attempt handling
- [ ] Sign-out and protected-route rejection
- [ ] Each enabled OAuth callback
- [ ] Organization role boundaries
- [ ] Stripe webhook signature rejection and a test-mode checkout, when enabled
- [ ] Rate-limit behavior and recovery
- [ ] Security headers and CSP in a browser

See [Authentication](/auth/), [Cloudflare deployment](/deployment/cloudflare), [Production database](/deployment/production-database), and the [incident playbook](./incident-playbook) for the corresponding procedures.
