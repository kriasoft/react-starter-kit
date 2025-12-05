# Database Layer

## Schema (Drizzle casing: snake_case)

- user, session, identity, verification, organization, member, team, team_member, invitation, passkey.
- UUID ids via `gen_random_uuid()` (built-in). For UUID v7, use `uuidv7()` (PostgreSQL 18+) or `uuid_generate_v7()` (pg_uuidv7 extension).
- Timestamps use `timestamp(..., withTimezone: true, mode: "date")` with `defaultNow()` and `$onUpdate`.
- Indexes on all FK columns; composite uniques on membership, team membership, identity provider/account, and invitation (org/email/team).
- No FKs on `session.activeOrganizationId/activeTeamId` to stay compatible with Better Auth's dynamic context.
- `organization.metadata` is `text` (JSON serialized); Better Auth expects string for adapter compatibility.

## Extended Fields (beyond Better Auth defaults)

### Passkey

- `lastUsedAt`: Tracks last authentication for security audits
- `deviceName`: User-friendly name (e.g., "MacBook Pro")
- `platform`: Authenticator type ("platform" | "cross-platform")

### Invitation

- `invitationStatusEnum`: DB-level enum ("pending", "accepted", "rejected", "canceled")
- `acceptedAt`, `rejectedAt`: Lifecycle timestamps for audit trails
- ⚠️ If Better Auth adds new statuses, enum migration required before upgrading

### Member Roles

- Free text `role` column; allowed values: "owner", "admin", "member"
- Not using pgEnum to stay compatible with Better Auth's role customization
- To add custom roles, configure `organization({ roles: {...} })` in auth.ts

## Conventions

- Keep singular table names and snake_case columns; avoid adding FKs to dynamic Better Auth fields.
- Use `gen_random_uuid()` for portability. UUID v7 alternatives: `uuidv7()` (PG 18+) or `uuid_generate_v7()` (pg_uuidv7).
- Keep `updatedAt` on all tables for audit trails.

## References

### Better Auth Core Schemas (source)

- `node_modules/@better-auth/core/src/db/schema/shared.ts` — coreSchema (id, createdAt, updatedAt)
- `node_modules/@better-auth/core/src/db/schema/user.ts`
- `node_modules/@better-auth/core/src/db/schema/session.ts`
- `node_modules/@better-auth/core/src/db/schema/account.ts`
- `node_modules/@better-auth/core/src/db/schema/verification.ts`
- `node_modules/@better-auth/core/src/db/schema/rate-limit.ts`
- `node_modules/@better-auth/core/src/db/plugin.ts` — BetterAuthPluginDBSchema
- `node_modules/@better-auth/core/src/types/init-options.ts` — BetterAuthOptions

### Better Auth Plugin Schemas (source)

- `~/gh/better-auth/packages/better-auth/src/plugins/organization/schema.ts`
- `~/gh/better-auth/packages/better-auth/src/plugins/anonymous/schema.ts`
- `~/gh/better-auth/packages/passkey/src/schema.ts`

### Configuration

- `apps/api/lib/auth.ts`
