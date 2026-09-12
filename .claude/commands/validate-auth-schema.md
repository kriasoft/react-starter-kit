# Validate Auth Schema

Check that the Drizzle schema in `db/schema/` still satisfies what Better Auth expects. Better Auth derives its required tables from the enabled plugins, so the generated JSON — not the upstream docs — is the source of truth:

```bash
bun run db/scripts/generate-auth-schema.ts
```

The script builds a real auth instance from `apps/api/lib/auth.ts` with fixed placeholder credentials, every optional integration switched on, so the output is the full set of tables rather than the subset your environment happens to enable. Per field it carries the `type`, the `required`, `unique` and `index` flags, any literal `defaultValue`, and the reference target with its `onDelete`. Per table it carries `indexes`: the composite indexes a plugin declares.

Compare that output against `db/schema/` and report:

- Tables Better Auth expects that are missing, and tables no plugin in `auth.ts` needs any more.
- Field-level drift: missing or extra columns, mismatched types, and `required` or `unique` flags that disagree.
- Foreign keys pointing at the wrong table or column.
- A `true` `index` flag, a table-level entry in `indexes`, a literal `defaultValue`, or an `onDelete` in the output is Better Auth asking for it: report a schema that lacks one. Indexes, defaults and cascades the project adds beyond that list are its own decisions — check those against the conventions in `db/AGENTS.md` and do not report them as drift.
- Local naming that must stay mapped, not renamed away: Better Auth's `account` is our `identity` table.
- Project-specific columns, indexes, and constraints are expected and fine on their own. Flag any that constrain a write Better Auth performs: a `NOT NULL` column with no database default breaks every insert into that table, and an extra unique or check constraint can reject a row Better Auth considers valid. Fields that must participate in its models belong in `additionalFields` rather than added to the table behind its back.

Report findings with the specific fix for each. Do not run `db:push`, `db:generate`, or `db:migrate` as part of a validation — schema changes are a separate, deliberate step.
