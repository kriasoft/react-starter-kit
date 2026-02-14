## Schema Conventions

- Drizzle `casing: "snake_case"` — use camelCase in TypeScript, columns map to snake_case in DB.
- All primary keys: `text().primaryKey().default(sql`gen_random_uuid()`)`.
- Timestamps: `timestamp({ withTimezone: true, mode: "date" })`. Every table has `createdAt` (`.defaultNow().notNull()`) and `updatedAt` (`.defaultNow().$onUpdate(() => new Date()).notNull()`).
- `identity` table = Better Auth's `account` table, renamed via `account.modelName: "identity"` in auth config.
- `member.role` is free `text`, not a pgEnum — Better Auth requires this for custom roles.
- `invitationStatusEnum` is a pgEnum (`"pending" | "accepted" | "rejected" | "canceled"`); changes require a migration.
- `organization.metadata` is `text`, not JSONB — Better Auth handles serialization.

## Extended Fields (beyond Better Auth defaults)

- **Passkey:** `lastUsedAt` (security audits), `deviceName` (user-friendly label), `platform` ("platform" | "cross-platform").
- **Invitation:** `invitationStatusEnum` pgEnum; `acceptedAt`/`rejectedAt` lifecycle timestamps. Adding new statuses requires a migration before upgrading Better Auth.
- **Member roles:** free text `role` ("owner", "admin", "member") — not pgEnum, to stay compatible with Better Auth's role customization.

## Indexes and Constraints

- Every foreign key column gets an index: `{table}_{column}_idx`.
- Composite uniques: `member(userId, organizationId)`, `teamMember(teamId, userId)`, `identity(providerId, accountId)`.
- `invitation(organizationId, email, teamId)` uses `.nullsNotDistinct()` — NULL teamId is treated as a value.
- `session.activeOrganizationId` and `session.activeTeamId` have indexes but no FK constraints (Better Auth design).
- All foreign keys use `onDelete: "cascade"`.

## Seeds

- Use `onConflictDoNothing()` for idempotent seeds (safe to rerun).

## Environment

- `ENVIRONMENT` env var overrides `NODE_ENV` for env file selection. DB scripts use short names (`prod`, `staging`, `dev`); API env schema uses full names (`production`, `staging`, `development`).
- DB scripts have `:staging` / `:prod` variants (e.g., `bun db:push:prod`).
- Config loads `.env.{envName}.local` → `.env.local` → `.env` in priority order.
