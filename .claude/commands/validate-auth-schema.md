# Validate Auth Schema

Validate that the Drizzle ORM schema in `db/schema/` matches the Better Auth requirements.

## Steps

1. **Generate Better Auth schema reference**:

   ```bash
   bun run db/scripts/generate-auth-schema.ts
   ```

2. **Compare with current Drizzle schema**:
   - Review all files in `db/schema/` (user.ts, organization.ts, etc.)
   - Check that each Better Auth table has corresponding Drizzle table
   - Verify field types, constraints, and relationships match
   - Ensure table names and field names align with Better Auth expectations

3. **Key validation points**:
   - **Table mapping**: Better Auth `account` → Drizzle `identity`
   - **Required fields**: All Better Auth required fields are present and correctly typed
   - **Relationships**: Foreign key references match (userId, organizationId, etc.)
   - **Constraints**: Unique fields, required fields, default values
   - **Field types**: string/text, boolean, date/timestamp, number types

4. **Report findings**:
   - List any missing tables or fields
   - Identify type mismatches
   - Note incorrect constraints or relationships
   - Suggest specific fixes needed

## Context

Better Auth requires specific database schema structure. The generated JSON serves as the source of truth for what Better Auth expects, while the Drizzle schema in `db/schema/` is our actual implementation that must match.

## Success Criteria

- All Better Auth required tables exist in Drizzle schema
- Field types and constraints match Better Auth requirements
- Foreign key relationships are correctly implemented
- Custom schema additions (like organizations) don't conflict with Better Auth expectations
