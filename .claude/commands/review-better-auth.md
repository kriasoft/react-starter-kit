Verify Better Auth integration to ensure that it is properly configured, up-to-date and functioning as expected. This includes:

- [ ] Verify user related database tables in @db/schema/user.ts. Fetch https://raw.githubusercontent.com/better-auth/better-auth/refs/heads/main/docs/content/docs/adapters/sqlite.mdx and https://raw.githubusercontent.com/better-auth/better-auth/refs/heads/main/docs/content/docs/plugins/anonymous.mdx as a reference.

- [ ] Verify organization and team related tables in @db/schema/organization.ts @db/schema/team.ts @db/schema/invitation.ts. Fetch https://raw.githubusercontent.com/better-auth/better-auth/refs/heads/main/docs/content/docs/plugins/organization.mdx as a reference.

- [ ] Verify db indexes, relations, constraints, default values, and other Better Auth specific database schema features in @db/schema/.

- [ ] Verify that @docs/database-schema.md documentation is up-to-date and reflects the current state of the database schema, including any changes made to support Better Auth.

- [ ] Verify betterAuth initialization logic in both client and server codebases.
