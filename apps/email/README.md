# Email Templates

Transactional email templates built with React Email.

[Documentation](https://reactstarter.com/email)

## Templates

- **EmailVerification** - Email verification with verification link
- **PasswordReset** - Password reset with secure reset link
- **OTPEmail** - One-time password codes for sign-in, verification, or password reset

## Development

```bash
# Start email preview development server
bun email:dev

# Build email templates
bun email:build

# Export static email templates
bun email:export
```

The development server will be available at <http://localhost:3001>

## Usage

```typescript
import { EmailVerification, renderEmailToHtml } from "@repo/email";

const component = EmailVerification({
  userName: "John Doe",
  verificationUrl: "https://example.com/verify?token=abc123",
  appName: "My App",
  appUrl: "https://example.com",
});

const html = await renderEmailToHtml(component);
```

## Structure

```bash
templates/        # React Email component templates
components/       # Shared components (BaseTemplate)
utils/            # Rendering utilities
emails/           # Preview files for development server
```
