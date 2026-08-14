# Forms & Validation

Forms use controlled React inputs with Zod for validation. There's no form library – the patterns are simple enough that a direct approach keeps things explicit.

## Basic Pattern

An application-owned form keeps input values in `useState` and calls a mutation hook from a query module. `useCreateProject` below comes from [Add a tRPC Procedure](/recipes/new-procedure) – no tRPC mutation ships in the starter, so build it first:

```tsx
import { useCreateProject } from "@/lib/queries/project";
import { Button, Input, Label } from "@repo/ui";
import { useId, useState } from "react";

function CreateProjectForm() {
  const [name, setName] = useState("");
  const nameId = useId();
  const createProject = useCreateProject();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        // Clearing the input belongs to this form, not to every caller of the
        // hook, so it rides on the call rather than the module's onSuccess.
        createProject.mutate({ name }, { onSuccess: () => setName("") });
      }}
    >
      <Label htmlFor={nameId}>Project name</Label>
      <Input
        id={nameId}
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        aria-invalid={Boolean(createProject.error)}
      />
      {createProject.error && (
        <p role="alert" className="text-sm text-destructive">
          {createProject.error.message}
        </p>
      )}
      <Button type="submit" disabled={createProject.isPending}>
        {createProject.isPending ? "Creating..." : "Create"}
      </Button>
    </form>
  );
}
```

The failure arrives after submit, so `role="alert"` announces it – the same pattern as the create-organization form in `apps/app/routes/(app)/members.tsx`.

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

- **Counter-based pending ops** – handles overlapping child operations (e.g., a rapid double-click)
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
// useAuthForm folds its own request and every child's into one flag
const isDisabled = isLoading || pendingOps > 0;
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

This keeps the form reusable – `AuthForm` backs both the login and signup pages because the caller controls what happens after success.
