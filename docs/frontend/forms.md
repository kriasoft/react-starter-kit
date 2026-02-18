# Forms & Validation

Forms use controlled React inputs with Zod for validation. There's no form library – the patterns are simple enough that a direct approach keeps things explicit.

## Basic Pattern

A typical form uses `useState` for input values and a tRPC mutation for submission:

```tsx
import { Button, Input, Label } from "@repo/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { trpcClient } from "@/lib/trpc";

function CreateProjectForm() {
  const [name, setName] = useState("");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (input: { name: string }) =>
      trpcClient.project.create.mutate(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project"] });
      setName("");
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        mutation.mutate({ name });
      }}
    >
      <Label htmlFor="name">Project name</Label>
      <Input
        id="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <Button type="submit" disabled={mutation.isPending}>
        Create
      </Button>
    </form>
  );
}
```

## Zod Schema Sharing

Zod schemas are defined on tRPC procedures and can be shared with the frontend for search param validation or client-side checks. The login route uses a Zod schema with `validateSearch` to sanitize the `returnTo` param at parse time – see [Routing > Search Params](./routing.md#search-params) for the full example.

## Auth Form

The auth form (`apps/app/components/auth/auth-form.tsx`) demonstrates a multi-step form pattern. It uses a state machine with three steps:

```
method → email → otp
  ↑        ↑       │
  └────────┘       │
           ←───────┘
```

The `useAuthForm` hook manages transitions between steps:

```tsx
const VALID_TRANSITIONS: Record<AuthStep, AuthStep[]> = {
  method: ["email"],
  email: ["method", "otp"],
  otp: ["email"],
};
```

Each step renders conditionally based on the current state:

```tsx
export function AuthForm({ mode = "login", onSuccess, returnTo }) {
  const { step, email, isDisabled, error /* actions */ } = useAuthForm({
    onSuccess,
    mode,
  });

  return (
    <div className="flex flex-col gap-6 w-full">
      {error && (
        <div
          role="alert"
          className="rounded-md bg-destructive/10 p-3 text-sm text-destructive"
        >
          {error}
        </div>
      )}

      {step === "method" && <MethodSelection /* ... */ />}
      {step === "email" && <EmailInput /* ... */ />}
      {step === "otp" && <OtpStep /* ... */ />}
    </div>
  );
}
```

Key design decisions in `useAuthForm`:

- **Counter-based pending ops** – handles overlapping child operations (e.g., passkey conditional UI running alongside manual click)
- **Success guard** (`hasSucceededRef`) – prevents concurrent auth completion from multiple methods
- **Email normalization** – trims whitespace and lowercases before API calls
- **Error orthogonal to steps** – errors can occur at any step and are displayed at the form level

## Error Display

Errors are shown as alert boxes with `role="alert"` for screen reader announcements:

```tsx
{
  error && (
    <div
      role="alert"
      className="rounded-md bg-destructive/10 p-3 text-sm text-destructive"
    >
      {error}
    </div>
  );
}
```

For mutation errors, check `mutation.error`:

```tsx
{
  mutation.error && (
    <div role="alert" className="text-sm text-destructive">
      {mutation.error.message}
    </div>
  );
}
```

## Loading States

Coordinate disabled state across form elements to prevent double-submission:

```tsx
// useAuthForm combines multiple sources into one flag
const isDisabled = isLoading || pendingOps > 0 || !!isExternallyLoading;
```

Apply to all interactive elements:

```tsx
<Input disabled={isDisabled} />
<Button type="submit" disabled={isDisabled || !email.trim()}>
  Continue
</Button>
```

For mutations, use `isPending` from the mutation object:

```tsx
<Button type="submit" disabled={mutation.isPending}>
  {mutation.isPending ? "Saving..." : "Save"}
</Button>
```

## Post-Submission

After successful form submission, the caller handles cache invalidation and navigation – not the form itself:

```tsx
// apps/app/routes/(auth)/login.tsx
async function handleSuccess() {
  await revalidateSession(queryClient, router);
  await router.navigate({ to: search.returnTo ?? "/" });
}

<AuthForm mode="login" onSuccess={handleSuccess} returnTo={search.returnTo} />;
```

This keeps the form reusable – `AuthForm` works in both the login page and a login dialog because the caller controls what happens after success.
