# Auth Form Specification

The login and signup pages share `AuthForm`, a three-step passwordless flow. They differ only in copy, terms, the account-switch link, and passkey availability.

## Methods

| Method | Login | Signup | Availability |
| --- | --- | --- | --- |
| Email OTP | Yes | Yes | Always |
| Passkey | Yes | No | Existing accounts only |
| Google | Yes | Yes | Only when both server credentials are configured |

The API exposes `config.socialProviders`, derived from the same helper that configures Better Auth. Auth routes prefetch it and the login dialog warms it on mount, so the UI neither advertises a disabled provider nor keeps a duplicate client-side enablement flag.

## Steps

```text
method selection ── email chosen ──> email input ── code sent ──> OTP
       ^                                  ^                         │
       └──────────── back ────────────────┘──────── back ──────────┘
```

The transition table in `use-auth-form.ts` permits only:

```ts
const VALID_TRANSITIONS = {
  method: ["email"],
  email: ["method", "otp"],
  otp: ["email"],
} as const;
```

Social and passkey flows complete outside this step sequence. A success guard prevents overlapping conditional-passkey and manual operations from completing authentication twice.

### Method selection

- Login shows configured social providers, email, and passkey.
- Signup shows configured social providers and email, followed by the terms and privacy notice.
- While any child flow is active, all methods and navigation are disabled.
- Errors use the form's inline `role="alert"` region.

### Email input

- The field uses `type="email"`, `autocomplete="email"`, and autofocus.
- Submission trims and lowercases the address.
- Both login and signup request OTP type `"sign-in"`; Better Auth creates a user when the address is new.
- Signup repeats the terms and privacy notice on this step.

### OTP

- Codes are six numeric digits, expire after five minutes, and are invalidated after three failed attempts.
- The field uses `autocomplete="one-time-code"`, `inputmode="numeric"`, and autofocus.
- `TOO_MANY_ATTEMPTS` and `OTP_EXPIRED` return the form to the email step while preserving the explanation. Other failures stay on the OTP step.
- The resend button has a 30-second client-side cooldown. This is interface feedback, not server-side abuse protection; production deployments still need rate limiting at Cloudflare.

## Props and completion

```ts
interface AuthFormProps {
  mode?: "login" | "signup";
  onSuccess: () => Promise<void>;
  isLoading?: boolean;
  returnTo?: string;
}
```

The caller owns post-auth cache invalidation and navigation. `AuthForm` awaits `onSuccess` before clearing its busy state. `returnTo` must already have passed `getSafeRedirectUrl()`; OAuth embeds it in the callback URL so it survives the redirect round trip.

## Accessibility

- The active input receives focus on the email and OTP steps.
- Native forms support Enter submission.
- Busy states disable conflicting controls.
- The logo link has an accessible name while its image remains decorative.
- Errors are announced through `role="alert"`.

## File Map

| Concern                   | File                                            |
| ------------------------- | ----------------------------------------------- |
| Shared form and step UI   | `apps/app/components/auth/auth-form.tsx`        |
| OTP state machine         | `apps/app/components/auth/use-auth-form.ts`     |
| Code entry and resend     | `apps/app/components/auth/otp-verification.tsx` |
| Passkey flow              | `apps/app/components/auth/passkey-login.tsx`    |
| Google redirect           | `apps/app/components/auth/google-login.tsx`     |
| Server capabilities query | `apps/api/routers/config.ts`                    |
| Client capabilities query | `apps/app/lib/queries/config.ts`                |
