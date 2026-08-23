/**
 * @file Refuses `db:push` against a database that is not local.
 *
 * `push` diffs the schema and reshapes whatever it is pointed at, inferring the
 * change rather than applying a reviewed migration. That is fine against a
 * throwaway local database and is not fine anywhere holding real rows.
 *
 * The rule already existed – `docs/security/checklist.md` and the command table
 * in `docs/database/index.md` both state it. It was a rule someone had to
 * remember, and the moment `.env.local` points `DATABASE_URL` at a hosted
 * branch the dangerous thing becomes the easy thing. This makes it a control.
 *
 * Importing the Drizzle config for its side effects rather than re-reading the
 * env files: it already resolves `DATABASE_URL` through the cascade and
 * validates the format, and a second copy of that logic would eventually
 * disagree with the one that decides where `push` actually goes.
 */

import "../drizzle.config";
import { isLocalDatabase } from "./local-database";

/** The deliberate way out, for a remote database that is genuinely disposable. */
const OVERRIDE = "ALLOW_REMOTE_DB_PUSH";

if (
  isLocalDatabase(process.env.DATABASE_URL!) ||
  process.env[OVERRIDE] === "1"
) {
  process.exit(0);
}

const url = new URL(process.env.DATABASE_URL!);

console.error(
  [
    ``,
    `Refusing to push to ${url.hostname}.`,
    ``,
    `\`push\` infers a schema change and applies it in place. Against a database`,
    `holding real rows that is a migration nobody reviewed, and it can drop a`,
    `column – and its data – to make the shapes agree.`,
    ``,
    `Use a reviewed migration instead:`,
    ``,
    `  bun db:generate              # write the migration`,
    `  bun db:migrate:staging       # apply it`,
    ``,
    `If this database really is disposable, say so explicitly:`,
    ``,
    `  ${OVERRIDE}=1 bun db:push`,
    ``,
  ].join("\n"),
);

process.exit(1);
