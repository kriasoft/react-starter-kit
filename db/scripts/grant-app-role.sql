-- Creates the least-privilege role the API worker uses through Hyperdrive.
--
--   psql "$DATABASE_URL" -f db/scripts/grant-app-role.sql \
--     -v role=app_staging -v password='...'
--
-- Run as the role that applies migrations, which must own the database and
-- schema `public`. The closing ALTER DEFAULT PRIVILEGES bind to `current_user`,
-- so a different runner would leave every table a later migration creates
-- unreachable by the app. The script checks this rather than trusting it.
--
-- Covers schema `public` only. Idempotent, and it never rotates an existing
-- password — that is a deliberate `ALTER ROLE ... PASSWORD`.

\set ON_ERROR_STOP on

-- Read inside the checks below, which are dollar-quoted and so never see psql's
-- variable substitution.
SELECT set_config('rsk.app_role', :'role', false);

-- Checked before anything is created, because none of it fails on its own.
-- Postgres answers a REVOKE or GRANT the caller is not entitled to make with a
-- WARNING and a successful exit, so the wrong runner would leave a role that
-- looks provisioned with none of the boundary around it — and `ON_ERROR_STOP`
-- never fires.
DO $$
DECLARE
  app_role text := current_setting('rsk.app_role');
BEGIN
  IF NOT pg_has_role(
    current_user,
    (SELECT datdba FROM pg_database WHERE datname = current_database()),
    'USAGE'
  ) THEN
    RAISE EXCEPTION 'Run this as the owner of database %, not %',
      current_database(), current_user;
  END IF;

  IF NOT pg_has_role(
    current_user,
    (SELECT nspowner FROM pg_namespace WHERE nspname = 'public'),
    'USAGE'
  ) THEN
    RAISE EXCEPTION 'Run this as the owner of schema public, not %', current_user;
  END IF;

  -- Re-running for an app role is the repair path and stays silent. Naming a
  -- role that already carries privileges of its own is the mistake worth
  -- catching: everything below would succeed and report a least-privilege role
  -- that is nothing of the sort.
  IF EXISTS (
    SELECT FROM pg_roles r
    WHERE r.rolname = app_role
      AND (r.rolsuper OR r.rolcreatedb OR r.rolcreaterole OR r.rolbypassrls
           OR r.rolreplication
           OR EXISTS (SELECT FROM pg_auth_members m WHERE m.member = r.oid))
  ) THEN
    RAISE EXCEPTION
      'Role % already exists with privileges of its own; this script only grants, it never takes away. Pick a name that is not already in use.',
      app_role;
  END IF;
END
$$;

-- Login role with nothing of its own; every privilege it has is granted below.
SELECT format('CREATE ROLE %I LOGIN PASSWORD %L', :'role', :'password')
WHERE NOT EXISTS (SELECT FROM pg_roles WHERE rolname = :'role')
\gexec

-- Postgres grants CONNECT and TEMPORARY to PUBLIC on every database, which
-- would let a leaked staging credential open the production database on the
-- same Neon project. Revoking leaves each environment reachable only by its own
-- role; the owner and Neon's superuser hold both privileges explicitly.
REVOKE CONNECT, TEMPORARY ON DATABASE :"DBNAME" FROM PUBLIC;
GRANT CONNECT ON DATABASE :"DBNAME" TO :"role";

-- PostgreSQL 14 and older grant CREATE on schema `public` to PUBLIC, and any
-- database can have had it granted back. Without this the app role inherits it
-- and can create tables — the no-DDL guarantee would be a property of the
-- server version rather than of this script. A no-op on 15 and later.
REVOKE CREATE ON SCHEMA public FROM PUBLIC;
GRANT USAGE ON SCHEMA public TO :"role";
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO :"role";
-- USAGE covers nextval(); SELECT and UPDATE would also hand the app setval().
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO :"role";

-- Without these the app loses access to every table a future migration adds.
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO :"role";
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE ON SEQUENCES TO :"role";
