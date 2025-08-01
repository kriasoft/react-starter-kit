-- Sets up required PostgreSQL extensions for the database.
-- Ensures pg_uuidv7 is available for UUIDv7 support in Drizzle ORM schemas.
-- Safe to run multiple times; uses IF NOT EXISTS.
-- Note: Native UUIDv7 support is coming in PostgreSQL v18,
-- so this extension may not be needed in future versions.

CREATE EXTENSION IF NOT EXISTS "pg_uuidv7";
