# Database Layer

## Tech Stack

- **Database:** Cloudflare D1 (SQLite)
- **ORM:** Drizzle ORM with TypeScript
- **Auth:** Better Auth integration
- **Migration:** Drizzle Kit with dual-mode support (local/remote)

## Architecture

**Dual-Mode Configuration:**

- **Local:** Uses Wrangler-generated SQLite in `.wrangler/state/v3/d1/`
- **Remote:** Connects to Cloudflare D1 via HTTPS API

**Schema Structure:**

- `user` - User accounts
- `session` - Authentication sessions
- `identity` - OAuth account credentials
- `verification` - Email/password verification tokens
- `organization` - Multi-tenant organizations
- `member` - Organization membership
- `invite` - Organization invitations

## Common Commands

- `bun --filter db generate --name <name>` - Generate migrations
- `bun --filter db migrate` - Apply migrations to local database
- `bun --filter db migrate:remote` - Apply migrations to remote database
- `bun --filter db studio` - Open Drizzle Studio
- `bun --filter db push` - Push schema to local database

## Conventions

- Singular table names: `user`, `organization`
- Snake case columns: `email_verified`, `created_at`
- Camel case TypeScript exports: `user`, `userRelations`
- Timestamp fields use integer mode with `Date()` defaults
