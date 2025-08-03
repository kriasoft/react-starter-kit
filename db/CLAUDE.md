# Database Layer

## Tech Stack

- **Database:** Neon PostgreSQL
- **ORM:** Drizzle ORM with TypeScript
- **Auth:** Better Auth integration
- **Migration:** Drizzle Kit with environment support

## Architecture

**Environment Configuration:**

- **Local/Development** Connects to local PostgreSQL or Neon development database
- **Staging/Production:** Connects to Neon PostgreSQL via DATABASE_URL

**Schema Structure:**

- `user` - User accounts
- `session` - Authentication sessions
- `identity` - OAuth account credentials
- `verification` - Email/password verification tokens
- `organization` - Multi-tenant organizations
- `member` - Organization membership
- `invite` - Organization invitations

## Common Commands

- `bun --filter @repo/db generate --name <name>` - Generate migrations
- `bun --filter @repo/db migrate` - Apply migrations to database
- `bun --filter @repo/db studio` - Open Drizzle Studio
- `bun --filter @repo/db push` - Push schema to database
- `bun --filter @repo/db seed` - Seed database with test data

## Conventions

- Singular table names: `user`, `organization`
- Snake case columns: `email_verified`, `created_at`
- Camel case TypeScript exports: `user`, `userRelations`
- Timestamps with timezone
- Default values and `$onUpdate()` where applicable
