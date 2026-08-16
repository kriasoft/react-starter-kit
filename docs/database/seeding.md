# Seeding

Seed scripts populate your database with test data for development. They live in `db/seeds/` and are orchestrated by `db/scripts/seed.ts`.

## Running Seeds

```bash
bun db:seed              # seed development database
bun db:seed:staging      # seed staging
```

Seeds use `onConflictDoNothing()`, so they're safe to rerun without duplicating data.

There is deliberately no `db:seed:production`. These scripts create test accounts, and a command that inserts `alice@example.com` into a live database is a mistake waiting to happen. If you need real reference data in production – plan tiers, feature flags, a first admin account – write it as a migration, where it is reviewed and applied once.

## Project Structure

```
db/
├── seeds/
│   └── users.ts          # Creates 10 test user accounts
└── scripts/
    └── seed.ts           # Entry point – connects to DB, calls seed functions
```

The seed runner imports your Drizzle config for environment resolution, creates a single-connection client, and calls each seed function in sequence.

## Writing a Custom Seed

**1. Create a seed file** in `db/seeds/`:

```ts
// db/seeds/products.ts
import type { Database } from "../index";
import { product } from "../schema";

export async function seedProducts(db: Database) {
  const data = [
    { name: "Starter Plan Guide", price: 0, organizationId: "org_..." },
    { name: "Pro Onboarding Kit", price: 4900, organizationId: "org_..." },
  ];

  await db.insert(product).values(data).onConflictDoNothing();
  console.log(`Seeded ${data.length} products`);
}
```

**2. Register in the seed runner:**

```ts
// db/scripts/seed.ts
import { seedUsers } from "../seeds/users";
import { seedProducts } from "../seeds/products"; // [!code ++]

// In the main function:
await seedUsers(db);
await seedProducts(db); // [!code ++]
```

## Guidelines

- Use realistic but obviously fake data (`alice@example.com`, not real addresses)
- Always include `onConflictDoNothing()` so seeds are idempotent
- Provide variety – mix of verified/unverified users, different roles, multiple orgs
- Keep seed datasets small but representative of real usage patterns
- Order seed calls by dependency – users before organizations before memberships
