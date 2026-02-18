# Testing

The project uses [Vitest](https://vitest.dev/) for both API and frontend tests. Two test projects run from a single root config – API tests in Node, frontend tests in [Happy DOM](https://github.com/nicknisi/happy-dom).

## Configuration

The root config defines both projects:

```ts
// vitest.config.ts
export default defineConfig({
  test: {
    projects: ["apps/api", "apps/app"],
  },
});
```

Each project has its own `vitest.config.ts` (or inline `test` block in `vite.config.ts`):

| Project    | Environment    | Setup file        |
| ---------- | -------------- | ----------------- |
| `apps/api` | Node (default) | –                 |
| `apps/app` | `happy-dom`    | `vitest.setup.ts` |

The app setup file registers [jest-dom](https://github.com/testing-library/jest-dom) matchers like `toBeInTheDocument()`:

```ts
// apps/app/vitest.setup.ts
import "@testing-library/jest-dom/vitest";
```

## Running Tests

```bash
bun test                       # All projects, single run
bun test --watch               # Watch mode
bun test --project api         # API tests only
bun test --project app         # Frontend tests only
bun test billing               # Filter by filename
bun app:coverage               # Coverage report (apps/app only)
```

## File Conventions

- Test files live next to the code they test – `billing.ts` → `billing.test.ts`
- Import everything from `vitest`, not globals:

```ts
import { describe, expect, it, vi } from "vitest";
```

## Testing tRPC Procedures

Use `createCallerFactory` to invoke procedures directly without HTTP. Build a minimal context mock with only the fields the procedure accesses:

```ts
// apps/api/routers/billing.test.ts
import { describe, expect, it, vi } from "vitest";
import type { TRPCContext } from "../lib/context";
import { createCallerFactory } from "../lib/trpc";
import { billingRouter } from "./billing";

const createCaller = createCallerFactory(billingRouter);

function testCtx({
  userId = "user-1",
  subscription = undefined as Record<string, unknown> | undefined,
} = {}) {
  return {
    req: new Request("http://localhost"),
    session: {
      id: "s-1",
      userId,
      activeOrganizationId: undefined,
      // ... required session fields
    },
    user: { id: userId, email: "test@example.com", name: "Test User" },
    db: {
      query: {
        subscription: {
          findFirst: vi.fn().mockResolvedValue(subscription),
        },
      },
    } as unknown as TRPCContext["db"],
    cache: new Map(),
  } as TRPCContext;
}

describe("billing.subscription", () => {
  it("returns free plan defaults when no subscription exists", async () => {
    const result = await createCaller(testCtx()).subscription();
    expect(result).toEqual({
      plan: "free",
      status: null,
      periodEnd: null,
      cancelAtPeriodEnd: false,
      limits: { members: 1 },
    });
  });

  it("throws on unknown plan name", async () => {
    await expect(
      createCaller(
        testCtx({ subscription: { plan: "enterprise", status: "active" } }),
      ).subscription(),
    ).rejects.toThrow('Unknown plan "enterprise"');
  });
});
```

Key points:

- `createCallerFactory(router)` from `@trpc/server` – calls procedures in-process, no network layer
- Cast partial DB mocks with `as unknown as TRPCContext["db"]` – only stub the methods your procedure actually calls
- Use `vi.fn().mockResolvedValue()` for async Drizzle query methods

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
import { getCachedSession, isAuthenticated, sessionQueryKey } from "./session";

function createQueryClient() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
}

describe("isAuthenticated", () => {
  it("returns true when both user and session exist", () => {
    const queryClient = createQueryClient();
    queryClient.setQueryData(sessionQueryKey, {
      user: { id: "user-1", email: "test@example.com" },
      session: { id: "session-1", expiresAt: new Date() },
    });
    expect(isAuthenticated(queryClient)).toBe(true);
  });

  it("returns false when no session data cached", () => {
    expect(isAuthenticated(createQueryClient())).toBe(false);
  });
});
```

## Testing React Components

The app project includes [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) with Happy DOM. Components render in a simulated DOM:

```ts
// apps/app/components/example.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
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
const db = {
  query: {
    user: { findFirst: vi.fn().mockResolvedValue({ id: "user-1" }) },
  },
} as unknown as TRPCContext["db"];
```

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
Module mocks are hoisted – they run before imports regardless of where you write them. See [Vitest mocking docs](https://vitest.dev/guide/mocking) for details.
:::

## Where Tests Live

```
apps/
├── api/
│   └── routers/
│       └── billing.test.ts          # tRPC procedure tests
└── app/
    └── lib/
        ├── errors.test.ts           # utility function tests
        └── queries/
            ├── billing.test.ts      # query option tests
            └── session.test.ts      # cache helper tests
```

Place test files next to the source they test. No separate `__tests__` directories.
