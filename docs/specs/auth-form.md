# Auth Form Specification

The login and signup pages share `AuthForm`, a three-step passwordless flow. They differ only in copy, the account-switch link, and passkey availability.

The form shows no terms-of-service notice. Either page can create an account, so a notice belongs on both – but the starter ships no legal pages to link to, and a link to a page that does not exist is worse on the account-creation path than no notice at all. Add both when you add the documents; the [security checklist](/security/checklist) carries it as a pre-launch item.

## Methods

| Method | Login | Signup | Availability |
| --- | --- | --- | --- |
| Email OTP | Yes | Yes | Always |
| Passkey | Yes | No | Existing accounts only |
| Google | Yes | Yes | Only when both server credentials are configured |

The API exposes `config.socialProviders`, derived from the same helper that configures Better Auth. The login and signup routes prefetch it before rendering the form, so the UI neither advertises a disabled provider nor keeps a duplicate client-side enablement flag.

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

Passkey completes outside this step sequence. A success guard runs the post-auth work once per form, because disabling is state-backed and two completions can land before React rerenders. Google leaves the page entirely; the login route resolves the session when the browser returns.

### Method selection

- Login shows configured social providers, email, and passkey.
- Signup shows configured social providers and email.
- While any child flow is active, all methods and navigation are disabled.
- Errors use the form's inline `role="alert"` region.

### Email input

- The field uses `type="email"`, `autocomplete="email"`, and autofocus.
- Submission trims and lowercases the address.
- Both login and signup request OTP type `"sign-in"`; Better Auth creates a user when the address is new.

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
  returnTo?: string;
}
```

The caller owns post-auth cache invalidation and navigation. `AuthForm` awaits `onSuccess` before clearing its busy state. `returnTo` must already have passed `getSafeRedirectUrl()`; OAuth embeds it in the callback URL so it survives the redirect round trip.

## Accessibility

- The active input receives focus on the email and OTP steps.
- Native forms support Enter submission.
- Busy states disable conflicting controls.
- The logo link has an accessible name while its image remains decorative. It is an `<a href="/">`, not a `<Link>`: `/` inside the SPA is the protected dashboard, so only a request reaching the edge router can answer with the marketing page.
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
