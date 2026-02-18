# Email

Transactional emails are built with [React Email](https://react.email/) and delivered through [Resend](https://resend.com/). The `apps/email/` workspace owns all templates and rendering – the API imports compiled templates and sends them via the Resend SDK.

## Workspace Structure

```bash
apps/email/
├── components/
│   └── BaseTemplate.tsx       # Shared header, footer, and styling
├── templates/
│   ├── otp-email.tsx          # OTP codes (sign-in, verification, password reset)
│   ├── email-verification.tsx # Link-based email verification
│   └── password-reset.tsx     # Link-based password reset
├── emails/                    # Preview files for dev server (sample data)
├── utils/
│   └── render.ts              # renderEmailToHtml() / renderEmailToText()
├── index.ts                   # Public exports
└── package.json
```

## Templates

Three templates ship out of the box, all wrapped in `BaseTemplate` for consistent branding:

| Template            | Used By                                  | Trigger                    |
| ------------------- | ---------------------------------------- | -------------------------- |
| `OTPEmail`          | [Email & OTP](/auth/email-otp) auth flow | `emailOTP` plugin callback |
| `EmailVerification` | Link-based email verification            | `sendVerificationEmail()`  |
| `PasswordReset`     | Password reset flow                      | `sendPasswordReset()`      |

`OTPEmail` handles three types via a single `type` prop – `"sign-in"`, `"email-verification"`, and `"forget-password"` – each with different copy. Password resets include an additional security warning. The separate `PasswordReset` template uses a red button to emphasize the security-sensitive action.

## Development

Preview templates locally with hot reload:

```bash
bun email:dev
```

This starts the React Email preview server at `http://localhost:3001`. Files in `emails/` provide sample data for each template – edit them to test different states.

::: tip
The email workspace must be built before the API can import templates. The root `bun dev` handles this automatically, but if you run the API standalone, run `bun email:build` first.
:::

## Sending Emails

The API sends emails through helper functions in `apps/api/lib/email.ts`. Each helper renders a template to both HTML and plain text, then sends via Resend:

```ts
// apps/api/lib/email.ts
import { OTPEmail, renderEmailToHtml, renderEmailToText } from "@repo/email";

const component = OTPEmail({
  otp,
  type,
  appName: env.APP_NAME,
  appUrl: env.APP_ORIGIN,
});
const html = await renderEmailToHtml(component);
const text = await renderEmailToText(component);

await sendEmail(env, {
  to: email,
  subject: `Your ${typeLabel} code`,
  html,
  text,
});
```

Available sender functions:

| Function                  | Purpose                                                                        |
| ------------------------- | ------------------------------------------------------------------------------ |
| `sendOTP()`               | OTP codes for all auth flows                                                   |
| `sendVerificationEmail()` | Link-based email verification                                                  |
| `sendPasswordReset()`     | Password reset links                                                           |
| `sendEmail()`             | Low-level sender (validates recipients, requires plain text fallback for HTML) |

::: warning
`sendEmail()` throws if you provide HTML without a plain text fallback. Always render both versions using `renderEmailToHtml()` and `renderEmailToText()`.
:::

### Development Shortcut

In development, `sendOTP()` also prints the code to the terminal for convenience:

```txt
OTP code for user@example.com: 482901
```

A valid `RESEND_API_KEY` is still required – the console output supplements the email, it doesn't replace it.

## Adding a Template

1. Create the template in `apps/email/templates/`:

```tsx
// apps/email/templates/invitation.tsx
import { Button, Heading, Text } from "@react-email/components";
import { BaseTemplate } from "../components/BaseTemplate";

interface InvitationProps {
  inviterName: string;
  orgName: string;
  acceptUrl: string;
  appName?: string;
  appUrl?: string;
}

export function Invitation({
  inviterName,
  orgName,
  acceptUrl,
  appName,
  appUrl,
}: InvitationProps) {
  return (
    <BaseTemplate
      preview={`${inviterName} invited you to ${orgName}`}
      appName={appName}
      appUrl={appUrl}
    >
      <Heading
        style={{ fontSize: "24px", fontWeight: "600", margin: "0 0 24px" }}
      >
        You're invited
      </Heading>
      <Text style={{ fontSize: "16px", lineHeight: "24px" }}>
        {inviterName} invited you to join <strong>{orgName}</strong>.
      </Text>
      <Button href={acceptUrl}>Accept Invitation</Button>
    </BaseTemplate>
  );
}
```

2. Export it from `apps/email/index.ts`:

```ts
export { Invitation } from "./templates/invitation.js";
```

3. Add a preview file in `apps/email/emails/` with sample props for the dev server.

4. Create a sender function in `apps/api/lib/email.ts` following the same render-then-send pattern.

## Environment Variables

| Variable            | Required  | Description                                                        |
| ------------------- | --------- | ------------------------------------------------------------------ |
| `RESEND_API_KEY`    | For email | Resend API key (`re_...`)                                          |
| `RESEND_EMAIL_FROM` | For email | Sender address (e.g., `noreply@example.com`)                       |
| `APP_NAME`          | No        | Used in email subject lines and branding (defaults to `"Example"`) |
| `APP_ORIGIN`        | Yes       | Used for links in email footer                                     |

Set in `.env.local` for development, Cloudflare secrets for staging/production. See [Environment Variables](/getting-started/environment-variables).

## File Map

| Layer            | Files                                         |
| ---------------- | --------------------------------------------- |
| Templates        | `apps/email/templates/*.tsx`                  |
| Shared layout    | `apps/email/components/BaseTemplate.tsx`      |
| Rendering        | `apps/email/utils/render.ts`                  |
| Sending          | `apps/api/lib/email.ts`                       |
| Auth integration | `emailOTP` callback in `apps/api/lib/auth.ts` |
