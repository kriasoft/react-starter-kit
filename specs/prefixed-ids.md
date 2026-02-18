---
url: /specs/prefixed-ids.md
---
# Prefixed CUID2 Database IDs

All database primary keys use application-generated, prefixed [CUID2](https://github.com/paralleldrive/cuid2) identifiers: `usr_ght4k2jxm7pqbv01`. The prefix encodes entity type, improving debuggability across logs, URLs, and support conversations. Same pattern as Stripe (`cus_`, `sub_`), Clerk (`user_`, `org_`).

IDs are opaque strings – clients must not parse or decode them.

## Format

```text
{prefix}_{body}        Example: usr_ght4k2jxm7pqbv01
 └──3──┘ └─16─┘        20 chars total
```

* **Prefix:** 3-char lowercase entity type
* **Body:** 16-char CUID2 (alphanumeric, starts with letter)

## Prefix Map

Defined in `db/schema/id.ts`. Keys are Better Auth model names (not table names).

| Model          | Prefix | Notes                                                   |
| -------------- | ------ | ------------------------------------------------------- |
| `user`         | `usr`  |                                                         |
| `session`      | `ses`  |                                                         |
| `account`      | `idn`  | Maps to `identity` table via `account.modelName` config |
| `verification` | `vfy`  |                                                         |
| `organization` | `org`  |                                                         |
| `member`       | `mem`  |                                                         |
| `invitation`   | `inv`  |                                                         |
| `passkey`      | `pky`  |                                                         |
| `subscription` | `sub`  |                                                         |

## API

```ts
import { generateAuthId, generateId } from "@repo/db";

// Auth tables – type-checked against the prefix map
generateAuthId("user"); // "usr_ght4k2jxm7pqbv01"

// Non-auth tables – any 3-letter prefix
generateId("upl"); // "upl_m8xk3jvqp2wnba09"
```

Throws on unknown auth models or invalid prefixes. The CUID2 generator is lazy-initialized (no module-level side effects – safe for Workers isolates).

## Integration Points

**Better Auth** – `apps/api/lib/auth.ts`:

```ts
advanced: {
  database: {
    generateId: ({ model }) => generateAuthId(model as AuthModel),
  },
},
```

**Drizzle schema** – `db/schema/*.ts` use `.$defaultFn()` instead of `gen_random_uuid()`:

```ts
id: text().primaryKey().$defaultFn(() => generateAuthId("user")),
```

## Adding a New Model

1. Add the prefix to `AUTH_PREFIX` in `db/schema/id.ts`
2. Use `.$defaultFn(() => generateAuthId("modelName"))` in the schema
3. Re-generate migrations: `bun db:generate`
