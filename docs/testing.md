# Testing

The project uses [Vitest](https://vitest.dev/) for API, database and frontend tests. Three test projects run from a single root config – API and database tests in Node, frontend tests in [Happy DOM](https://github.com/capricorn86/happy-dom).

Database-backed tests run against PGlite in-process, with no server to start. `bun install && bun run test` works on a fresh clone.

## Configuration

The root config defines the projects:

```ts
// vitest.config.ts
export default defineConfig({
  cacheDir: "./.cache/vite",
  test: {
    projects: ["apps/api", "apps/app", "db"],
  },
});
```

`apps/api` and `db` have their own `vitest.config.ts`; `apps/app` uses an inline `test` block in `vite.config.ts`:

| Project    | Environment    | Setup file        |
| ---------- | -------------- | ----------------- |
| `apps/api` | Node (default) | –                 |
| `db`       | Node (default) | –                 |
| `apps/app` | `happy-dom`    | `vitest.setup.ts` |

The app setup file registers [jest-dom](https://github.com/testing-library/jest-dom) matchers like `toBeInTheDocument()`:

```ts
// apps/app/vitest.setup.ts
import "@testing-library/jest-dom/vitest";
```

## Running Tests

From the repository root:

```bash
bun run test                       # All projects, watch mode
bun run test --run                 # Single run (no watch)
bun run test --project @repo/api   # API tests only
bun run test --project @repo/app   # Frontend tests only
bun run test --project @repo/db    # Schema tests only
bun run test billing               # Filter by filename
```

::: warning

Use `bun run test`, not `bun test`. The latter invokes Bun's test runner instead of the root Vitest script, so it ignores the Happy DOM environment and `vitest.setup.ts`; DOM-dependent frontend tests fail with `document is not defined`. The `bun api:test` and `bun app:test` shorthands are safe because both names resolve to package scripts.

Only the root, `apps/api`, `apps/app` and `db` define a `test` script. In a workspace that does not, `bun run test` may resolve a system command named `test` instead of reporting a missing script.

:::

## File Conventions

- Test files live next to the code they test – `billing.ts` → `billing.test.ts`
- Import everything from `vitest`, not globals:

```ts
import { describe, expect, it, vi } from "vitest";
```

## Database Tests

Use `@repo/db/testing` when behavior depends on query scoping, migrations, or database constraints:

```ts
import { createTestDatabase } from "@repo/db/testing";

const { db, reset, close } = await createTestDatabase();

afterAll(close);
beforeEach(reset);
```

`createTestDatabase()` boots [PGlite](https://pglite.dev/) – Postgres compiled to WebAssembly – and applies the committed migrations from `db/migrations`. Migrations, constraints and queries execute in a Postgres engine rather than against a mock, with no container to start and no service to configure in CI.

`db` is typed as `Database`, the same driver-agnostic client production code receives – so a test cannot depend on an API the code under test does not have.

Each call returns its own in-memory instance, so test files never see one another's rows. Create it once per file and call `reset()` – a `truncate` across every table in the schema – between tests.

Because it applies migrations rather than pushing the schema, a migration that will not apply fails here instead of on deploy. It does not comprehensively compare `db/schema` against the migrated result: an unmigrated table is caught when `reset()` tries to truncate it, but an existing column or constraint can drift unless a test exercises it. The suite covers the committed migrations and the invariants it asserts explicitly – not full schema-to-migration equivalence.

::: tip Why not mock `db.query`?

A mocked `findFirst` proves which lookups a procedure runs and what it does with the rows it gets back, but not that those were the right rows. For example, `billing.subscription` reads an organization's plan only after matching `member(organizationId, userId)`. Against a mock that check can pass even if the lookup forgets the user; against the test database it fails.

:::

Writes go through Drizzle, so `$defaultFn` fills in prefixed IDs and `.returning()` hands back what the database actually stored:

```ts
// db/schema/index.test.ts
const [org] = await db
  .insert(organization)
  .values({ name: "Acme", slug: "acme" })
  .returning();

expect(org.id).toMatch(/^org_[a-z0-9]{16}$/);
```

Constraint violations surface as a Drizzle error wrapping the Postgres one. Assert on the constraint name so the test says which rule it depends on:

```ts
await expect(db.insert(member).values(values)).rejects.toMatchObject({
  cause: { constraint: "member_user_org_unique" },
});
```

::: warning What PGlite does not cover

PGlite is one connection in one process, built with its own locale and extension set. It does not model multi-connection concurrency or advisory locks, the postgres-js and Hyperdrive path in front of the deployed database, ICU collation ordering, extensions, or behaviour specific to Neon's Postgres version. Those belong to a deployed environment.

For the Postgres features these tests do exercise – schema, constraints, query scoping – it is high-fidelity in a way no mock can be.

:::

## Testing tRPC Procedures

Use `createCallerFactory` to invoke procedures directly without HTTP. When the procedure's behavior depends on query results, build its context around the test database:

```ts
// apps/api/routers/billing.test.ts
import { user } from "@repo/db";
import { createTestDatabase } from "@repo/db/testing";
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import type { TRPCContext } from "../lib/context";
import { createCallerFactory } from "../lib/trpc";
import { billingRouter } from "./billing";

const createCaller = createCallerFactory(billingRouter);
const { db, reset, close } = await createTestDatabase();

afterAll(close);
beforeEach(reset);

async function insertUser(email = "test@example.com") {
  const [row] = await db
    .insert(user)
    .values({ name: "Test User", email, emailVerified: true })
    .returning();

  return row.id;
}

function testCtx(userId: string) {
  const ctx: TRPCContext = {
    req: new Request("http://localhost"),
    info: {} as TRPCContext["info"],
    session: {
      id: "ses_test",
      createdAt: new Date(),
      updatedAt: new Date(),
      userId,
      expiresAt: new Date(Date.now() + 60_000),
      token: "token",
      activeOrganizationId: undefined,
    },
    user: {
      id: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      email: "test@example.com",
      emailVerified: true,
      name: "Test User",
    },
    db,
    dbCached: db,
    env: {
      STRIPE_SECRET_KEY: "sk_test",
      STRIPE_WEBHOOK_SECRET: "whsec_test",
      STRIPE_STARTER_PRICE_ID: "price_starter",
      STRIPE_PRO_PRICE_ID: "price_pro",
    } as TRPCContext["env"],
  };

  return ctx;
}

describe("billing.subscription", () => {
  it("returns free plan defaults when no subscription exists", async () => {
    const userId = await insertUser();

    await expect(
      createCaller(testCtx(userId)).subscription(),
    ).resolves.toMatchObject({ plan: "free", status: null });
  });
});
```

Key points:

- `createCallerFactory(router)` from `lib/trpc` – calls procedures in-process with the same tRPC configuration and no network layer
- `db` and `dbCached` both point at the test database; the distinction between them is a Hyperdrive caching concern, not a query one
- external dependencies still use focused fakes or mocks; the example supplies only the environment variables the procedure reads

## Testing Utility Functions

Pure functions need no mocking – just import and assert:

```ts
// apps/app/lib/errors.test.ts
import { describe, expect, it } from "vitest";
import { getErrorMessage, isUnauthenticatedError } from "./errors";

describe("getErrorMessage", () => {
  it("extracts message from Error instances", () => {
    expect(getErrorMessage(new Error("Something broke"))).toBe(
      "Something broke",
    );
  });

  it("returns fallback for unknown shapes", () => {
    expect(getErrorMessage(null)).toBe("An unexpected error occurred");
  });
});
```

## Testing Query Options

Test TanStack Query option factories by inspecting query keys. Use a real `QueryClient` with retries disabled to test cache helpers:

```ts
// apps/app/lib/queries/session.test.ts
import { QueryClient } from "@tanstack/react-query";
import { describe, expect, it } from "vitest";
import { getCachedSession, sessionQueryKey } from "./session";

function createQueryClient() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
}

describe("getCachedSession", () => {
  it("returns cached session data", () => {
    const queryClient = createQueryClient();
    const sessionData = { user: { id: "user-1" }, session: { id: "s-1" } };
    queryClient.setQueryData(sessionQueryKey, sessionData);
    expect(getCachedSession(queryClient)).toEqual(sessionData);
  });

  it("returns undefined when nothing is cached", () => {
    expect(getCachedSession(createQueryClient())).toBeUndefined();
  });
});
```

## Testing React Components

The app project includes [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) with Happy DOM. Components render in a simulated DOM:

```ts
// apps/app/components/example.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { MyComponent } from "./my-component";

describe("MyComponent", () => {
  it("renders the label", () => {
    render(<MyComponent label="Hello" />);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("calls onClick when button is pressed", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<MyComponent label="Click me" onClick={onClick} />);
    await user.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledOnce();
  });
});
```

::: tip

Use `userEvent` over `fireEvent` for user interactions – it simulates real browser behavior (focus, keyboard events, pointer events) rather than dispatching synthetic events.

:::

## Mocking

### Function mocks

```ts
const fn = vi.fn();
fn.mockReturnValue(42);
fn.mockResolvedValue({ data: "ok" }); // async
fn.mockImplementation((x) => x + 1);
```

### Partial object mocks

Cast partial mocks when you only need a subset of a typed interface:

```ts
const env = { STRIPE_SECRET_KEY: "sk_test" } as TRPCContext["env"];
```

Mock third-party SDKs and anything that leaves the process. Use the [test database](#database-tests) when the behavior under test depends on SQL semantics or query scoping.

### Module mocks

```ts
vi.mock(import("./some-module.js"), () => ({
  myFunction: vi.fn().mockReturnValue("mocked"),
}));
```

For partial module mocks that keep the original implementation:

```ts
vi.mock(import("./some-module.js"), async (importOriginal) => {
  const mod = await importOriginal();
  return { ...mod, myFunction: vi.fn() };
});
```

::: warning

Module mocks are hoisted – they run before imports regardless of where you write them. A factory that closes over a normal `const` throws `Cannot access '...' before initialization`. Declare the shared mock with `vi.hoisted()` so it is lifted too:

```ts
const { signOut } = vi.hoisted(() => ({ signOut: vi.fn() }));

vi.mock(import("../auth"), () => ({
  auth: { signOut } as unknown as AuthModule["auth"],
}));
```

See [Vitest mocking docs](https://vitest.dev/guide/mocking) for details.

:::

## Where Tests Live

```
apps/
├── api/
│   ├── lib/
│   │   └── auth.test.ts             # auth configuration
│   └── routers/
│       └── billing.test.ts          # tRPC procedure tests
└── app/
    └── lib/
        ├── errors.test.ts           # utility function tests
        └── queries/
            ├── billing.test.ts      # query option tests
            └── session.test.ts      # guards, cache helpers, sign-out mutation
db/
└── schema/
    └── index.test.ts                # cascades, unique constraints, ID prefixes
```

Place test files next to the source they test. No separate `__tests__` directories.
