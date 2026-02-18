// Prefixed CUID2 ID generation for all database entities.
// Format: {prefix}_{body} e.g. "usr_ght4k2jxm7pqbv01" (20 chars total)
// See docs/specs/prefixed-ids.md for design rationale.

import { init } from "@paralleldrive/cuid2";

// Keys are Better Auth's internal model names (not table names).
// "account" maps to the "identity" table via account.modelName config.
const AUTH_PREFIX = {
  user: "usr",
  session: "ses",
  account: "idn", // "identity" table — avoids confusion with user/billing account
  verification: "vfy",
  organization: "org",
  member: "mem",
  invitation: "inv",
  passkey: "pky",
  subscription: "sub",
} as const;

export type AuthModel = keyof typeof AUTH_PREFIX;

const ID_LENGTH = 16;
let _createId: (() => string) | null = null;

function createId(): string {
  if (!_createId) _createId = init({ length: ID_LENGTH });
  return _createId();
}

/** Generate a prefixed ID for a Better Auth model (e.g. `"user"` → `"usr_..."`) */
export function generateAuthId(model: AuthModel): string {
  const prefix = AUTH_PREFIX[model];
  if (!prefix) {
    throw new Error(
      `Unknown auth model "${String(model)}". Add it to AUTH_PREFIX in db/schema/id.ts`,
    );
  }
  return `${prefix}_${createId()}`;
}

/** Generate a prefixed ID for non-auth tables (e.g. `generateId("upl")`) */
export function generateId(prefix: string): string {
  if (!/^[a-z]{3}$/.test(prefix)) {
    throw new Error(
      `ID prefix must be exactly 3 lowercase letters, got "${prefix}"`,
    );
  }
  return `${prefix}_${createId()}`;
}
