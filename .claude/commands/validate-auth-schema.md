# Validate Auth Schema

Check that the Drizzle schema in `db/schema/` still satisfies what Better Auth expects. Better Auth derives its required tables from the enabled plugins, so the generated JSON — not the upstream docs — is the source of truth:

```bash
bun run db/scripts/generate-auth-schema.ts
```

The script builds a real auth instance from `apps/api/lib/auth.ts` with mock credentials and prints every table, field, and reference Better Auth needs.

Compare that output against `db/schema/` and report:

- Tables Better Auth expects that are missing, and tables no enabled plugin needs any more.
- Field-level drift: missing or extra columns, mismatched types, nullability, defaults, and unique constraints.
- Foreign keys that point at the wrong table or column, and `onDelete` behaviour that would orphan rows.
- Local naming that must stay mapped, not renamed away: Better Auth's `account` is our `identity` table.
- Project-specific columns, indexes, and constraints are expected and fine on their own. Flag any that constrain a write Better Auth performs: a `NOT NULL` column with no database default breaks every insert into that table, and an extra unique or check constraint can reject a row Better Auth considers valid. Fields that must participate in its models belong in `additionalFields` rather than added to the table behind its back.

Report findings with the specific fix for each. Do not run `db:push`, `db:generate`, or `db:migrate` as part of a validation — schema changes are a separate, deliberate step.
