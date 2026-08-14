---
outline: [2, 3]
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

| Setting | Value | Description |
| --- | --- | --- |
| `allowUserToCreateOrganization` | `true` | Any user can create organizations |
| `organizationLimit` | `5` | Max organizations per user |
| `creatorRole` | `"owner"` | Creator automatically gets the owner role |

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

| Column | Type | Description |
| --- | --- | --- |
| `id` | `text` | Prefixed CUID2 (`inv_cm...`) |
| `email` | `text` | Invitee's email address |
| `inviterId` | `text` | References `user.id` |
| `organizationId` | `text` | References `organization.id` |
| `role` | `text` | Role assigned upon acceptance |
| `status` | `text` | `"pending"`, `"accepted"`, `"rejected"`, or `"canceled"` |
| `expiresAt` | `timestamp` | Invitation expiration |
| `acceptedAt` | `timestamp` | Optional app-owned acceptance timestamp; the plugin does not populate it |
| `rejectedAt` | `timestamp` | Optional app-owned rejection timestamp; the plugin does not populate it |

The starter's unique constraint on `(organizationId, email)` permits one lifetime invitation row per address and organization. Better Auth updates an invitation's status but creates a new row for a later invitation, so remove this constraint before supporting re-invites after acceptance, rejection, or cancellation.

## Roles

Three built-in roles with hierarchical permissions:

| Role       | Can manage members | Can manage settings | Can delete org |
| ---------- | ------------------ | ------------------- | -------------- |
| **owner**  | Yes                | Yes                 | Yes            |
| **admin**  | Yes                | Yes                 | No             |
| **member** | No                 | No                  | No             |

### Role Checks in API Procedures

Use the session's `activeOrganizationId` with a membership query to check roles. Reject a missing ID before the query; it means the request has no organization scope.

```ts
// Inside a protected tRPC procedure
const organizationId = ctx.session.activeOrganizationId;
if (!organizationId) {
  throw new TRPCError({
    code: "PRECONDITION_FAILED",
    message: "No active organization",
  });
}

const [row] = await ctx.db
  .select({ role: Db.member.role })
  .from(Db.member)
  .where(
    and(
      eq(Db.member.organizationId, organizationId),
      eq(Db.member.userId, ctx.user.id),
    ),
  );

const isAdmin = row?.role === "owner" || row?.role === "admin";
```

## Active Organization

The session tracks which organization is currently active via `activeOrganizationId`:

```ts
export type AuthSession = SessionResponse["session"] & {
  activeOrganizationId?: string | null;
};
```

This field is stored in the `session` table and persists across requests. When the user switches organizations, Better Auth updates this field. It is nullable because belonging to no organization is a normal state – always narrow it before use.

Better Auth leaves it null on every newly created session, so a `databaseHooks.session.create.before` hook in `apps/api/lib/auth.ts` seeds it through `findInitialOrganization()`. Without it every sign-in would start with no active organization, quietly emptying organization-scoped views and sending billing back to the personal reference.

The oldest membership wins, with `id` breaking `createdAt` ties so the choice cannot flip between sign-ins. Change the ordering if you want a different default – "last used", for example, means storing that choice yourself.

## Members Page

`apps/app/routes/(app)/members.tsx` is the worked example. It reads `activeOrganizationId` from the session, lists members through `useMembersQuery()` in `apps/app/lib/queries/organization.ts`, and falls back to a create-organization form when no organization is active – sign-up deliberately does not create one, and the active organization can also be cleared.

Inviting others is not wired up: `inviteMember` needs `sendInvitationEmail` on the organization plugin and an invitation template in `apps/email/`. See [Email](/email) for adding one.

## Billing Integration

Subscriptions scope to the active organization, and two different owners enforce that.

**Stripe mutations** – checkout, portal, plan changes – go through the Better Auth plugin, whose `authorizeReference` hook in `apps/api/lib/auth.ts` allows personal billing for the caller and organization billing only for an `owner` or `admin`.

**Application reads** are not covered by that hook. `ctx.session.activeOrganizationId` selects the billing scope; it does not prove the caller still belongs to that organization, because a session outlives a membership removal. `apps/api/routers/billing.ts` is the shipped example: it revalidates the membership on `ctx.db` – never `dbCached` – before reading anything, and returns the caller's `canManage` from the same lookup so the UI does not offer actions the plugin will reject. See [Query Patterns > Multi-tenant Queries](/database/queries#multi-tenant-queries).

Better Auth also supports switching and clearing the active organization. The starter UI does not expose either yet: it seeds one on session create and leaves it alone, so add a switcher when your app needs more than one active scope.

## Invitation Lifecycle

1. **Owner/admin invites** – sends invitation to email with assigned role
2. **Invitation pending** – stored in `invitation` table with `status: "pending"` and an expiration
3. **Invitee accepts** – Better Auth creates a `member` record and updates invitation status
4. **Or invitee rejects or the inviter cancels** – status is updated, no member is created. An expired pending invitation is refused when used; expiry alone does not rewrite its status.

The plugin does not populate the optional `acceptedAt` or `rejectedAt` columns. Add organization hooks if the application needs those audit timestamps.

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
