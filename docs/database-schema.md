# Database Schema

This document describes the database schema for your application. The schema provides a foundation for building multi-tenant SaaS applications with authentication, organizations, teams, and role-based access control.

## Overview

The database uses:

- **Database Engine:** Neon PostgreSQL with Cloudflare Hyperdrive for edge optimization
- **ORM:** Drizzle ORM for type-safe database operations
- **Authentication:** Built on [Better Auth](https://www.better-auth.com/) specification
- **Connection Pooling:** Cloudflare Hyperdrive provides connection pooling and caching at the edge

## Database Setup

All primary keys use `gen_random_uuid()` (built-in PostgreSQL function), so no extensions are required to get started.

::: tip UUIDv7 Upgrade Path
For time-ordered UUIDs (better index locality), you can switch to `uuidv7()` (PostgreSQL 18+) or `uuid_generate_v7()` via the [pg_uuidv7](https://github.com/fboulnois/pg_uuidv7) extension. The `db/scripts/setup-extensions.sql` file pre-installs `pg_uuidv7` for this purpose.
:::

The schema is divided into two main sections:

1. **Authentication tables** - Required for user authentication and session management
2. **Application tables** - For your specific business logic (organizations, teams, and your custom tables)

::: warning Important
The authentication tables follow [Better Auth's requirements](https://www.better-auth.com/docs/concepts/database). Maintain compatibility when extending these tables.
:::

## Entity Relationship Diagram

```mermaid
erDiagram
    %% Core Authentication Tables
    user {
        text id PK "gen_random_uuid()"
        text name "Full name"
        text email UK "Email address"
        boolean email_verified "Email verification status"
        text image "Profile image URL"
        boolean is_anonymous "Anonymous user flag"
        timestamp created_at "Account creation timestamp"
        timestamp updated_at "Last update timestamp"
    }

    session {
        text id PK "gen_random_uuid()"
        timestamp expires_at "Session expiration"
        text token UK "Session token"
        timestamp created_at "Creation timestamp"
        timestamp updated_at "Last update timestamp"
        text ip_address "Client IP address"
        text user_agent "Client user agent"
        text user_id FK "User reference"
        text active_organization_id "Current organization context"
        text active_team_id "Current team context"
    }

    identity {
        text id PK "gen_random_uuid()"
        text account_id "Provider account ID"
        text provider_id "OAuth provider name"
        text user_id FK "User reference"
        text access_token "OAuth access token"
        text refresh_token "OAuth refresh token"
        text id_token "OAuth ID token"
        timestamp access_token_expires_at "Access token expiry"
        timestamp refresh_token_expires_at "Refresh token expiry"
        text scope "OAuth scopes"
        text password "Hashed password for email auth"
        timestamp created_at "Creation timestamp"
        timestamp updated_at "Last update timestamp"
    }

    verification {
        text id PK "gen_random_uuid()"
        text identifier "Email or other identifier"
        text value "Verification code/token"
        timestamp expires_at "Expiration timestamp"
        timestamp created_at "Creation timestamp"
        timestamp updated_at "Last update timestamp"
    }

    passkey {
        text id PK "gen_random_uuid()"
        text name "Key name"
        text public_key "WebAuthn public key"
        text credential_id UK "WebAuthn credential ID"
        integer counter "Signature counter"
        text device_type "Authenticator type"
        boolean backed_up "Backed up flag"
        text transports "Supported transports"
        text aaguid "Authenticator AAGUID"
        timestamp last_used_at "Last authentication time"
        text device_name "User-friendly device name"
        text platform "platform or cross-platform"
        text user_id FK "User reference"
        timestamp created_at "Creation timestamp"
        timestamp updated_at "Last update timestamp"
    }

    %% Multi-tenancy Tables
    organization {
        text id PK "gen_random_uuid()"
        text name "Organization name"
        text slug UK "URL-friendly identifier"
        text logo "Logo URL"
        text metadata "JSON metadata"
        timestamp created_at "Creation timestamp"
        timestamp updated_at "Last update timestamp"
    }

    member {
        text id PK "gen_random_uuid()"
        text user_id FK "User reference"
        text organization_id FK "Organization reference"
        text role "owner, admin, or member"
        timestamp created_at "Join timestamp"
        timestamp updated_at "Last update timestamp"
    }

    team {
        text id PK "gen_random_uuid()"
        text name "Team name"
        text organization_id FK "Parent organization"
        timestamp created_at "Creation timestamp"
        timestamp updated_at "Last update timestamp"
    }

    team_member {
        text id PK "gen_random_uuid()"
        text team_id FK "Team reference"
        text user_id FK "User reference"
        timestamp created_at "Join timestamp"
        timestamp updated_at "Last update timestamp"
    }

    invitation {
        text id PK "gen_random_uuid()"
        text email "Invitee email"
        text inviter_id FK "Inviting user"
        text organization_id FK "Target organization"
        text role "Invited role"
        invitation_status status "pending, accepted, rejected, canceled"
        text team_id FK "Target team (optional)"
        timestamp expires_at "Expiration timestamp"
        timestamp accepted_at "Acceptance timestamp"
        timestamp rejected_at "Rejection timestamp"
        timestamp created_at "Creation timestamp"
        timestamp updated_at "Last update timestamp"
    }

    %% Relationships
    user ||--o{ session : "has"
    user ||--o{ identity : "authenticates with"
    user ||--o{ passkey : "registers"
    user ||--o{ member : "belongs to"
    user ||--o{ team_member : "member of"
    user ||--o{ invitation : "invited by"

    organization ||--o{ member : "has members"
    organization ||--o{ team : "contains"
    organization ||--o{ invitation : "receives"

    team ||--o{ team_member : "has members"
    team ||--o{ invitation : "invites to"
```

## Authentication Tables

These tables handle user authentication and are based on the Better Auth specification. They form the foundation of your application's security layer.

### Core Tables

#### `user` Table

Central table for all user accounts in your application.

| Column           | Type      | Description               | Required | Constraints                            |
| ---------------- | --------- | ------------------------- | -------- | -------------------------------------- |
| `id`             | TEXT      | Primary key (UUID)        | Yes      | PRIMARY KEY, DEFAULT gen_random_uuid() |
| `name`           | TEXT      | User's display name       | Yes      |                                        |
| `email`          | TEXT      | Email address             | Yes      | UNIQUE                                 |
| `email_verified` | BOOLEAN   | Email verification status | Yes      | DEFAULT false                          |
| `image`          | TEXT      | Profile image URL         | No       |                                        |
| `is_anonymous`   | BOOLEAN   | Anonymous user flag       | Yes      | DEFAULT false                          |
| `created_at`     | TIMESTAMP | Account creation time     | Yes      | DEFAULT now()                          |
| `updated_at`     | TIMESTAMP | Last modification time    | Yes      | DEFAULT now(), auto-update             |

::: details TypeScript Schema Definition

```typescript
// Drizzle casing: "snake_case" — camelCase in TS maps to snake_case columns
export const user = pgTable("user", {
  id: text()
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text().notNull(),
  email: text().notNull().unique(),
  emailVerified: boolean().default(false).notNull(),
  image: text(),
  isAnonymous: boolean().default(false).notNull(),
  createdAt: timestamp({ withTimezone: true, mode: "date" })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp({ withTimezone: true, mode: "date" })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});
```

:::

#### `session` Table

Manages active user sessions with device tracking and organization context.

| Column                   | Type      | Description             | Required |
| ------------------------ | --------- | ----------------------- | -------- |
| `id`                     | TEXT      | Session identifier      | Yes      |
| `expires_at`             | TIMESTAMP | Session expiration time | Yes      |
| `token`                  | TEXT      | Unique session token    | Yes      |
| `created_at`             | TIMESTAMP | Creation timestamp      | Yes      |
| `updated_at`             | TIMESTAMP | Last update timestamp   | Yes      |
| `user_id`                | TEXT      | Reference to user       | Yes      |
| `ip_address`             | TEXT      | Client IP for security  | No       |
| `user_agent`             | TEXT      | Browser/client info     | No       |
| `active_organization_id` | TEXT      | Current org context     | No       |
| `active_team_id`         | TEXT      | Current team context    | No       |

#### `identity` Table

Handles authentication credentials for both OAuth providers and email/password.

::: info
This table is named `identity` in our schema but maps to Better Auth's `account` table.
:::

| Column                | Type           | Description                           | Required |
| --------------------- | -------------- | ------------------------------------- | -------- |
| `id`                  | TEXT           | Identity record ID                    | Yes      |
| `account_id`          | TEXT           | Provider-specific account ID          | Yes      |
| `provider_id`         | TEXT           | Provider name (google, email, etc.)   | Yes      |
| `user_id`             | TEXT           | Reference to user                     | Yes      |
| `password`            | TEXT           | Hashed password (email provider only) | No       |
| OAuth token fields... | TEXT/TIMESTAMP | Various OAuth tokens and expiries     | No       |

#### `verification` Table

Manages email verification, password resets, and other verification flows.

| Column       | Type      | Description                   | Required |
| ------------ | --------- | ----------------------------- | -------- |
| `id`         | TEXT      | Verification ID               | Yes      |
| `identifier` | TEXT      | Email or identifier to verify | Yes      |
| `value`      | TEXT      | Verification code/token       | Yes      |
| `expires_at` | TIMESTAMP | Code expiration               | Yes      |
| `created_at` | TIMESTAMP | Creation timestamp            | Yes      |
| `updated_at` | TIMESTAMP | Last update timestamp         | Yes      |

#### `passkey` Table

Stores WebAuthn passkey credentials for passwordless authentication via the [Better Auth passkey plugin](https://www.better-auth.com/docs/plugins/passkey).

| Column          | Type      | Description                                       | Required |
| --------------- | --------- | ------------------------------------------------- | -------- |
| `id`            | TEXT      | Passkey ID                                        | Yes      |
| `name`          | TEXT      | Key name                                          | No       |
| `public_key`    | TEXT      | WebAuthn public key                               | Yes      |
| `user_id`       | TEXT      | Reference to user                                 | Yes      |
| `credential_id` | TEXT      | WebAuthn credential ID (unique)                   | Yes      |
| `counter`       | INTEGER   | Signature counter                                 | Yes      |
| `device_type`   | TEXT      | Authenticator device type                         | Yes      |
| `backed_up`     | BOOLEAN   | Whether key is backed up                          | Yes      |
| `transports`    | TEXT      | Supported transports                              | No       |
| `aaguid`        | TEXT      | Authenticator AAGUID                              | No       |
| `last_used_at`  | TIMESTAMP | Last authentication time (extended)               | No       |
| `device_name`   | TEXT      | User-friendly name, e.g. "MacBook Pro" (extended) | No       |
| `platform`      | TEXT      | "platform" or "cross-platform" (extended)         | No       |

## Application Tables

These tables implement the multi-tenant architecture with organizations and teams. They integrate with the authentication layer through Better Auth's [organization](https://www.better-auth.com/docs/plugins/organization) and [teams](https://www.better-auth.com/docs/plugins/teams) plugins.

### `organization` Table

Represents a tenant/company/workspace in your application. This is the primary grouping mechanism for multi-tenancy.

| Column       | Type      | Description                      |
| ------------ | --------- | -------------------------------- |
| `id`         | TEXT      | Organization ID                  |
| `name`       | TEXT      | Display name                     |
| `slug`       | TEXT      | URL-friendly identifier (unique) |
| `logo`       | TEXT      | Logo image URL                   |
| `metadata`   | TEXT      | JSON for custom fields           |
| `created_at` | TIMESTAMP | Creation timestamp               |
| `updated_at` | TIMESTAMP | Last update timestamp            |

### `member` Table

Defines the relationship between users and organizations, including their role within each organization.

| Column            | Type      | Description                 |
| ----------------- | --------- | --------------------------- |
| `id`              | TEXT      | Membership ID               |
| `user_id`         | TEXT      | Reference to user           |
| `organization_id` | TEXT      | Reference to organization   |
| `role`            | TEXT      | Role (owner, admin, member) |
| `created_at`      | TIMESTAMP | Join timestamp              |
| `updated_at`      | TIMESTAMP | Last update timestamp       |

### `team` Table

Optional subgroups within organizations. Use teams when you need more granular permissions beyond organization-level roles.

| Column            | Type      | Description           |
| ----------------- | --------- | --------------------- |
| `id`              | TEXT      | Team ID               |
| `name`            | TEXT      | Team name             |
| `organization_id` | TEXT      | Parent organization   |
| `created_at`      | TIMESTAMP | Creation timestamp    |
| `updated_at`      | TIMESTAMP | Last update timestamp |

### `invitation` Table

Tracks pending invitations. Users can be invited to join organizations with specific roles, and optionally assigned to teams.

| Column            | Type              | Description                                    |
| ----------------- | ----------------- | ---------------------------------------------- |
| `id`              | TEXT              | Invitation ID                                  |
| `email`           | TEXT              | Invitee's email                                |
| `inviter_id`      | TEXT              | User who sent invitation                       |
| `organization_id` | TEXT              | Target organization                            |
| `role`            | TEXT              | Invited role                                   |
| `status`          | invitation_status | pending, accepted, rejected, canceled (pgEnum) |
| `team_id`         | TEXT              | Target team (optional)                         |
| `expires_at`      | TIMESTAMP         | Invitation expiry                              |
| `accepted_at`     | TIMESTAMP         | When accepted (extended)                       |
| `rejected_at`     | TIMESTAMP         | When rejected/canceled (extended)              |
| `created_at`      | TIMESTAMP         | Creation timestamp                             |
| `updated_at`      | TIMESTAMP         | Last update timestamp                          |

## Extending the Schema

### Adding Your Own Tables

As you build your application, you'll add tables specific to your domain. Here's the recommended approach:

1. Create a new schema file in `db/schema/` for each logical group:

```typescript {7-12}
// db/schema/product.ts
export const product = pgTable("product", {
  id: text()
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text().notNull(),
  description: text(),
  price: integer().notNull(), // Store in cents
  organizationId: text()
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  createdBy: text()
    .notNull()
    .references(() => user.id),
  createdAt: timestamp({ withTimezone: true, mode: "date" })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp({ withTimezone: true, mode: "date" })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});
```

2. Add relations for better querying:

```typescript
export const productRelations = relations(product, ({ one }) => ({
  organization: one(organization, {
    fields: [product.organizationId],
    references: [organization.id],
  }),
  creator: one(user, {
    fields: [product.createdBy],
    references: [user.id],
  }),
}));
```

3. Export from `db/schema/index.ts` and generate migrations

### Extending Existing Tables

To add fields to existing tables (like adding custom user fields):

1. Update the schema file:

```typescript
// db/schema/user.ts
export const user = pgTable("user", {
  // ... existing fields ...

  // Your custom fields
  phoneNumber: text(),
  preferences: text(), // JSON string
  tier: text().default("free"),
});
```

2. For authentication tables, update Better Auth configuration:

::: tip
When adding fields to authentication tables, always update the Better Auth configuration to ensure proper data handling.
:::

```typescript
betterAuth({
  user: {
    additionalFields: {
      phoneNumber: { type: "string", required: false },
      preferences: { type: "string", required: false },
      tier: { type: "string", required: false },
    },
  },
});
```

3. Generate and apply migrations:

```bash
bun db:generate
bun db:migrate  # or bun db:push
```

## Database Seeding

The project includes a seeding system for populating your database with test data during development.

### Seed Scripts

- `db/scripts/seed.ts` - Entry point that orchestrates all seed functions
- `db/seeds/users.ts` - Creates test user accounts with realistic data
- Add your own seed files in `db/seeds/` following the same pattern

### Running Seeds

```bash
# Seed development database
bun db:seed

# Seed specific environments
bun db:seed:staging
bun db:seed:prod
```

### Creating Custom Seeds

Follow this pattern when creating new seed files:

```typescript
// db/seeds/products.ts
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import type * as schema from "../schema";

export async function seedProducts(db: PostgresJsDatabase<typeof schema>) {
  console.log("Seeding products...");

  const products = [
    { name: "Example Product", price: 2999, organizationId: "org-1" },
    // ... more test data
  ];

  for (const product of products) {
    await db.insert(schema.product).values(product).onConflictDoNothing();
  }

  console.log(`Seeded ${products.length} products`);
}
```

Then add your seed function to `db/scripts/seed.ts`:

```typescript
import { seedProducts } from "../seeds/products";

// In the main seeding function:
await seedUsers(db);
await seedProducts(db);
```

### Seed Data Guidelines

- Use realistic but obviously fake data (example.com emails, etc.)
- Include `onConflictDoNothing()` to allow re-running seeds safely
- Provide variety in your test data (verified/unverified users, different roles, etc.)
- Keep seed data small but representative of real usage patterns

::: details Important: Schema Compatibility
When extending authentication tables, ensure your changes don't break Better Auth's expected schema. Always test authentication flows after making changes.
:::

### Role-Based Access Control

Implement RBAC using the member roles:

```typescript
// Check if user is organization admin
const membership = await db.query.member.findFirst({
  where: and(
    eq(member.userId, userId),
    eq(member.organizationId, orgId),
    eq(member.role, "admin"),
  ),
});

// Get all teams user belongs to
const teams = await db.query.teamMember.findMany({
  where: eq(teamMember.userId, userId),
  with: {
    team: true,
  },
});
```

## Common Query Patterns

### Multi-tenant Queries

Always scope queries to the current organization:

```typescript
// Get all products for the current organization
const products = await db.query.product.findMany({
  where: eq(product.organizationId, session.activeOrganizationId),
  with: {
    creator: {
      columns: { id: true, name: true, email: true },
    },
  },
});
```

### User Organization Access

Check user's access to resources:

```typescript
// Verify user has access to organization
const membership = await db.query.member.findFirst({
  where: and(eq(member.userId, userId), eq(member.organizationId, orgId)),
});

if (!membership) {
  throw new Error("Access denied");
}
```

### Complex Relationships

Load nested relationships efficiently:

```typescript
// Get organization with all members and their teams
const org = await db.query.organization.findFirst({
  where: eq(organization.id, orgId),
  with: {
    members: {
      with: {
        user: true,
      },
    },
    teams: {
      with: {
        members: {
          with: {
            user: true,
          },
        },
      },
    },
  },
});
```

## Best Practices

### Security Considerations

::: danger Security Critical

- **Never expose sensitive tokens**: Access tokens, refresh tokens, and passwords should never be sent to the client
- **Validate organization context**: Always verify user has access to the organization they're trying to access
- **Use parameterized queries**: Drizzle ORM handles this automatically
- **Implement rate limiting**: Especially for invitation endpoints
  :::

### Performance Tips

::: tip Optimization Guidelines

- **Index frequently queried fields**: Email, slug, and foreign keys are already indexed in PostgreSQL
- **Use relations for complex queries**: Drizzle's `with` clause is more efficient than multiple queries
- **Batch operations when possible**: Use `db.insert().values([...])` for bulk inserts
- **Limit data fetching**: Only select columns you need using the `columns` option
- **Leverage Hyperdrive**: Connection pooling and caching reduce latency at the edge
  :::

### Design Patterns

#### Multi-tenant Data Isolation

Every table that contains user data should reference an organization:

```typescript {4-7}
// Always include organizationId in your tables
export const yourTable = pgTable("your_table", {
  id: text()
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  organizationId: text()
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  // ... other fields
});

// Always filter by organization in queries
where: eq(yourTable.organizationId, currentOrgId);
```

#### Soft Deletes

Preserve data integrity by marking records as deleted:

```typescript
// Add to your schema
deletedAt: timestamp("deleted_at", { withTimezone: true, mode: "date" }),

// Filter out deleted records
where: isNull(table.deletedAt),

// Soft delete
await db
  .update(yourTable)
  .set({ deletedAt: new Date() })
  .where(eq(yourTable.id, recordId));
```

#### Audit Fields

Track who created/updated records:

```typescript
createdBy: text("created_by").references(() => user.id),
updatedBy: text("updated_by").references(() => user.id),
createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).defaultNow(),
updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }).defaultNow().$onUpdate(() => new Date()),
```

## Next Steps

1. Add your domain-specific tables in `db/schema/`
2. Configure authentication providers in `apps/api/lib/auth.ts`
3. Set up database backups for production deployments
4. Implement proper access control in your API endpoints

## Additional Resources

- [Better Auth Documentation](https://www.better-auth.com/docs) - Authentication flows and plugins
- [Drizzle ORM Documentation](https://orm.drizzle.team/) - Database queries and migrations
- [Neon PostgreSQL Documentation](https://neon.tech/docs) - Database deployment and optimization
- [Cloudflare Hyperdrive Documentation](https://developers.cloudflare.com/hyperdrive/) - Connection pooling and edge optimization
