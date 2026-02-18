---
url: /auth/email-otp.md
---

# Email & OTP

The primary sign-in method is passwordless email OTP. Users enter their email, receive a 6-digit code, and enter it to authenticate. The same flow handles both login and signup – if the email doesn't exist, Better Auth creates the account automatically.

## Server Configuration

The `emailOTP` plugin is configured in `apps/api/lib/auth.ts`:

```ts
emailOTP({
  async sendVerificationOTP({ email, otp, type }) {
    await sendOTP(env, { email, otp, type });
  },
  otpLength: 6,
  expiresIn: 300,      // 5 minutes
  allowedAttempts: 3,   // max wrong guesses before code is invalidated
}),
```

OTP codes are stored in the `verification` table and automatically expire. After 3 failed attempts, the code is invalidated and the user must request a new one.

### Email Delivery

OTP emails are sent via [React Email](https://react.email/) templates rendered to HTML + plain text, delivered through [Resend](https://resend.com/):

```ts
// apps/api/lib/email.ts
export async function sendOTP(env, { email, otp, type }) {
  // In development, OTP is also printed to the console
  if (env.ENVIRONMENT === "development") {
    console.log(`OTP code for ${email}: ${otp}`);
  }

  const component = OTPEmail({ otp, type, appName: env.APP_NAME });
  const html = await renderEmailToHtml(component);
  const text = await renderEmailToText(component);

  return sendEmail(env, {
    to: email,
    subject: `Your Sign In code`,
    html,
    text,
  });
}
```

::: tip
During local development, OTP codes are logged to the terminal – you don't need a real Resend API key to test the flow.
:::

## Client Flow

The auth form implements a 3-step state machine:

```
method → email → otp
```

Each step is a separate UI component orchestrated by `AuthForm`:

| Step     | Component         | What Happens                                       |
| -------- | ----------------- | -------------------------------------------------- |
| `method` | `MethodSelection` | User picks sign-in method (Google, email, passkey) |
| `email`  | `EmailInput`      | User enters email, OTP is sent                     |
| `otp`    | `OtpVerification` | User enters 6-digit code to complete sign-in       |

### State Machine

The state transitions are defined in `apps/app/components/auth/use-auth-form.ts`:

```ts
const VALID_TRANSITIONS: Record<AuthStep, AuthStep[]> = {
  method: ["email"],
  email: ["method", "otp"],
  otp: ["email"],
};
```

Transitions are validated – invalid step jumps are silently ignored. This prevents race conditions from concurrent auth operations (e.g., passkey conditional UI completing while the user clicks a button).

### Sending the OTP

When the user submits their email, the `sendOtp` function normalizes the input and calls the Better Auth client:

```ts
// "sign-in" type handles both login and signup
const result = await auth.emailOtp.sendVerificationOtp({
  email: normalizedEmail,
  type: "sign-in",
});
```

The `sign-in` type is used for both login and signup flows. Better Auth creates the user account if the email is new.

### Verifying the Code

The `OtpVerification` component handles code entry and verification:

```ts
const result = await auth.signIn.emailOtp({ email, otp });
```

The input field restricts to 6 numeric digits with `inputMode="numeric"` and `autoComplete="one-time-code"` for mobile OTP autofill.

## Error Handling

The OTP plugin returns specific error codes that map to user-friendly messages:

| Error Code          | User Message                                           | Behavior                      |
| ------------------- | ------------------------------------------------------ | ----------------------------- |
| `TOO_MANY_ATTEMPTS` | "Too many failed attempts. Please request a new code." | Returns to email step         |
| `OTP_EXPIRED`       | "Code has expired. Please request a new one."          | Returns to email step         |
| `INVALID_OTP`       | "Invalid verification code"                            | Stays on OTP step (can retry) |

When `TOO_MANY_ATTEMPTS` or `OTP_EXPIRED` occurs, the form automatically returns to the email step so the user can request a fresh code.

### Resend Cooldown

After the initial OTP is sent, users can request a new code with a 30-second cooldown:

```ts
const RESEND_COOLDOWN_SECONDS = 30;
```

The resend button shows a countdown timer and is disabled during the cooldown period.

## Component Architecture

```
AuthForm
├── MethodSelection          Step 1: choose sign-in method
│   ├── GoogleLogin          OAuth redirect
│   ├── "Continue with email" button
│   └── PasskeyLogin         WebAuthn (login only)
├── EmailInput               Step 2: enter email, send OTP
└── OtpStep
    └── OtpVerification      Step 3: enter code, verify
```

The `AuthForm` accepts a `mode` prop (`"login"` or `"signup"`) that controls copy and available methods. Both modes use the same OTP flow – the difference is cosmetic (headings, ToS display, passkey availability).

::: info
Passkeys are only shown during login. They require an existing account with a registered passkey – see [Passkeys](./passkeys).
:::
