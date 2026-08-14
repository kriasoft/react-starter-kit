## Schema Conventions

- Drizzle `casing: "snake_case"` – use camelCase in TypeScript, columns map to snake_case in DB.
- Primary keys use application-generated prefixed CUID2 IDs: `generateAuthId(model)` for Better Auth models and `generateId("xxx")` for domain tables. See `db/schema/id.ts` for the prefix map.
- Timestamps: `timestamp({ withTimezone: true, mode: "date" })`. Every table has `createdAt` (`.defaultNow().notNull()`) and `updatedAt` (`.defaultNow().$onUpdate(() => new Date()).notNull()`).
- `identity` table = Better Auth's `account` table, renamed via `account.modelName: "identity"` in auth config.
- `member.role` and `invitation.status` are free `text`, not pgEnum – avoids fragile coupling with Better Auth's values.
- `organization.metadata` is `text`, not JSONB – Better Auth handles serialization.

## Extended Fields (beyond Better Auth defaults)

- **Passkey:** `lastUsedAt` (security audits), `deviceName` (user-friendly label), `platform` ("platform" | "cross-platform").
- **Invitation:** `acceptedAt`/`rejectedAt` are reserved for application hooks; Better Auth updates `status` but does not populate them.
- **Member roles:** free text `role` ("owner", "admin", "member") – not pgEnum, to stay compatible with Better Auth's role customization.

## Indexes and Constraints

- Every foreign key column gets an index: `{table}_{column}_idx`.
- Composite uniques: `member(userId, organizationId)`, `invitation(organizationId, email)`, `identity(providerId, accountId)`. The invitation unique is a starter limitation: Better Auth creates a new row for a later invitation, so remove the constraint before supporting re-invites after acceptance, rejection, or cancellation.
- `session.activeOrganizationId` has an index but no FK constraint (Better Auth design).
- All foreign keys use `onDelete: "cascade"`.

## Seeds

- Use `onConflictDoNothing()` for idempotent seeds (safe to rerun).

## Environment

- `ENVIRONMENT` overrides `NODE_ENV` for env file selection. Database scripts use `production`, `staging`, and `dev`; the API runtime uses `production`, `staging`, and `development`.
- `migrate`, `studio` and `export` have `:staging` / `:production` variants; `seed` stops at `:staging`; `generate` and `push` have none.
- Development loads `.env.{envName}.local` → `.env.local` → `.env`, first value wins. Staging and production load only `.env.{envName}.local`, override exported values, and throw if it is absent.
