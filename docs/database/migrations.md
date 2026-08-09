# Migrations

Drizzle Kit generates SQL migrations by diffing your TypeScript schema against the latest snapshot. Migration files live in `db/migrations/` alongside a journal that tracks applied versions.

## Workflow

**1. Edit the schema** in `db/schema/`.

**2. Generate a migration:**

```bash
bun db:generate
```

This produces a numbered SQL file (e.g., `0001_add_product_table.sql`) in `db/migrations/`.

**3. Review the generated SQL.** Drizzle Kit's output is generally correct, but always check for destructive operations – column drops, type changes, or data loss.

**4. Apply the migration:**

```bash
bun db:migrate
```

**5. Verify in Drizzle Studio:**

```bash
bun db:studio
```

## Push vs Migrate

| Command | What it does | Use when |
| --- | --- | --- |
| `bun db:migrate` | Applies pending migrations to local DB | Local and shared development |
| `bun db:migrate:<env>` | Applies pending migrations to named DB | Staging and production |
| `bun db:push` | Syncs schema directly, no migration files | Local development, rapid prototyping |

`push` is faster during development since it skips migration file generation. Switch to `migrate` when you need reproducible, reviewable changes.

## Targeting Environments

Append `:staging` or `:production` to run against other databases:

```bash
bun db:migrate:staging
bun db:migrate:production
```

These set `ENVIRONMENT` internally and load only the matching `.env.{env}.local` file. They fail when that file is missing instead of falling back to a local URL, and its `DATABASE_URL` overrides an inherited shell value.

## Migration History Checks

After merging branches that both generated migrations, run:

```bash
bun db:check
```

This checks the generated migration history for conflicting branches. It does not connect to or detect drift in a live database; use introspection and a deliberate reconciliation migration for out-of-band database changes.

## Tips

- **Name your migrations** – `bun db:generate --name add-product-table` produces clearer filenames than auto-numbered defaults.
- **One concern per migration** – avoid bundling unrelated schema changes. Smaller migrations are easier to review and roll back.
- **Never edit applied migrations** – if a migration has already run in staging or production, create a new migration to correct issues.
- **Review before applying** – `db:generate` writes SQL to disk. Read the file before running `db:migrate`.
