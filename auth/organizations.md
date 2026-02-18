---
url: /auth/organizations.md
---

# Organizations & Roles

Organizations provide multi-tenant isolation. Each organization is a separate tenant with its own members, roles, and billing. Users can belong to multiple organizations and switch between them.

## Server Configuration

The organization plugin is configured in `apps/api/lib/auth.ts`:

```ts
organization({
  allowUserToCreateOrganization: true,
  organizationLimit: 5,
  creatorRole: "owner",
}),
```

| Setting                         | Value     | Description                               |
| ------------------------------- | --------- | ----------------------------------------- |
| `allowUserToCreateOrganization` | `true`    | Any user can create organizations         |
| `organizationLimit`             | `5`       | Max organizations per user                |
| `creatorRole`                   | `"owner"` | Creator automatically gets the owner role |

## Database Tables

### `organization`

Defined in `db/schema/organization.ts`:

| Column             | Type   | Description                           |
| ------------------ | ------ | ------------------------------------- |
| `id`               | `text` | Prefixed CUID2 (`org_cm...`)          |
| `name`             | `text` | Display name                          |
| `slug`             | `text` | URL-safe unique identifier            |
| `logo`             | `text` | Logo URL (optional)                   |
| `metadata`         | `text` | JSON string for custom data           |
| `stripeCustomerId` | `text` | Stripe customer for org-level billing |

### `member`

Links users to organizations with a role:

| Column           | Type   | Description                         |
| ---------------- | ------ | ----------------------------------- |
| `id`             | `text` | Prefixed CUID2 (`mem_cm...`)        |
| `userId`         | `text` | References `user.id`                |
| `organizationId` | `text` | References `organization.id`        |
| `role`           | `text` | `"owner"`, `"admin"`, or `"member"` |

A unique constraint on `(userId, organizationId)` prevents duplicate memberships.

### `invitation`

Manages pending invitations, defined in `db/schema/invitation.ts`:

| Column           | Type        | Description                                              |
| ---------------- | ----------- | -------------------------------------------------------- |
| `id`             | `text`      | Prefixed CUID2 (`inv_cm...`)                             |
| `email`          | `text`      | Invitee's email address                                  |
| `inviterId`      | `text`      | References `user.id`                                     |
| `organizationId` | `text`      | References `organization.id`                             |
| `role`           | `text`      | Role assigned upon acceptance                            |
| `status`         | `text`      | `"pending"`, `"accepted"`, `"rejected"`, or `"canceled"` |
| `expiresAt`      | `timestamp` | Invitation expiration                                    |
| `acceptedAt`     | `timestamp` | When the invite was accepted                             |
| `rejectedAt`     | `timestamp` | When the invite was rejected or canceled                 |

A unique constraint on `(organizationId, email)` prevents duplicate invitations to the same person.

## Roles

Three built-in roles with hierarchical permissions:

| Role       | Can manage members | Can manage settings | Can delete org |
| ---------- | ------------------ | ------------------- | -------------- |
| **owner**  | Yes                | Yes                 | Yes            |
| **admin**  | Yes                | Yes                 | No             |
| **member** | No                 | No                  | No             |

### Role Checks in API Procedures

Use the session's `activeOrganizationId` with a membership query to check roles:

```ts
// apps/api/routers/organization.ts
const [row] = await ctx.db
  .select({ role: Db.member.role })
  .from(Db.member)
  .where(
    and(
      eq(Db.member.organizationId, referenceId),
      eq(Db.member.userId, user.id),
    ),
  );

const isAdmin = row?.role === "owner" || row?.role === "admin";
```

## Active Organization

The session tracks which organization is currently active via `activeOrganizationId`:

```ts
export type AuthSession = SessionResponse["session"] & {
  activeOrganizationId?: string;
};
```

This field is stored in the `session` table and persists across requests. When the user switches organizations, Better Auth updates this field.

## Billing Integration

Subscriptions scope to the active organization. The billing router uses `activeOrganizationId` as the billing reference, falling back to the user's own ID for personal billing:

```ts
// apps/api/routers/billing.ts
const referenceId = ctx.session.activeOrganizationId ?? ctx.user.id;
```

The Stripe plugin's `authorizeReference` hook enforces that only owners and admins can manage an organization's subscription:

```ts
authorizeReference: async ({ user, referenceId }) => {
  if (referenceId === user.id) return true; // Personal billing
  const [row] = await db
    .select({ role: Db.member.role })
    .from(Db.member)
    .where(
      and(
        eq(Db.member.organizationId, referenceId),
        eq(Db.member.userId, user.id),
      ),
    );
  return row?.role === "owner" || row?.role === "admin";
},
```

## Invitation Lifecycle

1. **Owner/admin invites** – sends invitation to email with assigned role
2. **Invitation pending** – stored in `invitation` table with `status: "pending"` and an expiration
3. **Invitee accepts** – Better Auth creates a `member` record and updates invitation status
4. **Or invitee rejects / invitation expires** – invitation status is updated, no member created

Each organization can only have one pending invitation per email address.

## Client API

The `organizationClient()` plugin adds organization methods to the auth client:

```ts
// Create an organization
await auth.organization.create({ name: "Acme Inc", slug: "acme" });

// List user's organizations
const { data } = await auth.organization.list();

// Set active organization
await auth.organization.setActive({ organizationId: "org_cm..." });

// Invite a member
await auth.organization.inviteMember({
  email: "jane@example.com",
  role: "member",
  organizationId: "org_cm...",
});
```

See the [Better Auth organization plugin docs](https://www.better-auth.com/docs/plugins/organization) for the complete client API.
