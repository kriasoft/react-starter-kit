---
url: /specs/auth-form.md
---
# Auth Flow UX Specification

Target UX inspired by Linear's authentication flow.

## Design Principles

1. **Progressive disclosure** – Show only what's needed at each step
2. **Method selection first** – Let users choose their auth method before showing inputs
3. **Minimal friction** – Reduce cognitive load with focused, single-purpose views
4. **Clear navigation** – Easy to go back and switch methods

## Flow Structure

### Login (`/login`)

```text
Step 1: Method Selection
┌─────────────────────────────┐
│         [Logo]              │
│                             │
│    Log in to [App Name]     │
│                             │
│  ┌───────────────────────┐  │
│  │ Continue with Google  │  │
│  └───────────────────────┘  │
│  ┌───────────────────────┐  │
│  │ Continue with email   │  │
│  └───────────────────────┘  │
│  ┌───────────────────────┐  │
│  │ Log in with passkey   │  │
│  └───────────────────────┘  │
│                             │
│  Don't have an account?     │
│  Sign up                    │
└─────────────────────────────┘

Step 2: Email Input (after clicking "Continue with email")
┌─────────────────────────────┐
│         [Logo]              │
│                             │
│  What's your email address? │
│                             │
│  ┌───────────────────────┐  │
│  │ Enter your email...   │  │
│  └───────────────────────┘  │
│  ┌───────────────────────┐  │
│  │ Continue with email   │  │
│  └───────────────────────┘  │
│                             │
│  ← Back to login            │
└─────────────────────────────┘

Step 3: OTP Verification
┌─────────────────────────────┐
│         [Logo]              │
│                             │
│  Check your email           │
│  We sent a code to          │
│  user@example.com           │
│                             │
│  ┌─┬─┬─┬─┬─┬─┐              │
│  │ │ │ │ │ │ │  (6 digits)  │
│  └─┴─┴─┴─┴─┴─┘              │
│                             │
│  Resend code                │
│  ← Back                     │
└─────────────────────────────┘
```

### Signup (`/signup`)

```text
Step 1: Method Selection
┌─────────────────────────────┐
│         [Logo]              │
│                             │
│    Create your account      │
│                             │
│  ┌───────────────────────┐  │
│  │ Continue with Google  │  │
│  └───────────────────────┘  │
│  ┌───────────────────────┐  │
│  │ Continue with email   │  │
│  └───────────────────────┘  │
│                             │
│  By signing up, you agree   │
│  to our Terms and Privacy   │
│  Policy.                    │
│                             │
│  Already have an account?   │
│  Log in                     │
└─────────────────────────────┘

Step 2: Email Input (after clicking "Continue with email")
┌─────────────────────────────┐
│         [Logo]              │
│                             │
│  What's your email address? │
│                             │
│  ┌───────────────────────┐  │
│  │ Enter your email...   │  │
│  └───────────────────────┘  │
│  ┌───────────────────────┐  │
│  │ Continue with email   │  │
│  └───────────────────────┘  │
│                             │
│  By signing up, you agree   │
│  to our Terms and Privacy   │
│  Policy.                    │
│                             │
│  ← Back to sign up          │
└─────────────────────────────┘

Step 3: OTP Verification
┌─────────────────────────────┐
│         [Logo]              │
│                             │
│  Check your email           │
│  We sent a code to          │
│  user@example.com           │
│                             │
│  ┌─┬─┬─┬─┬─┬─┐              │
│  │ │ │ │ │ │ │  (6 digits)  │
│  └─┴─┴─┴─┴─┴─┘              │
│                             │
│  Resend code                │
│  ← Back to email            │
└─────────────────────────────┘
```

Note: No passkey option on signup (passkeys require existing account).

## Third-Party Auth Behavior

* **Google**: On failure or user cancel, return to method selection with inline error.
* **Passkey**: On failure (not supported, no credential, user cancel), return to method selection with inline error and a short hint to use email instead.
* **Network/system errors**: Show a non-blocking toast and keep the user on the current step.

## Key Differences from Current Implementation

| Aspect       | Current                           | Target                                    |
| ------------ | --------------------------------- | ----------------------------------------- |
| Initial view | All methods + email input visible | Method selection buttons only             |
| Email input  | Always visible with divider       | Separate step after clicking email button |
| Layout       | Card with optional right panel    | Centered content, no card                 |
| Headings     | "Welcome" / "Welcome back"        | "Create your account" / "Log in to \[App]" |
| Navigation   | None                              | "Back to login" link between steps        |
| Terms        | Footer on both pages              | Inline on signup only                     |

## Copy & Labels

| Screen        | Heading                    | CTA                                                              | Helper                                                                                    |
| ------------- | -------------------------- | ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Login method  | Log in to \[App Name]       | Continue with Google / Continue with email / Log in with passkey | Don't have an account? Sign up                                                            |
| Login email   | What's your email address? | Continue with email                                              | ← Back to login                                                                           |
| Login OTP     | Check your email           | Verify code                                                      | Resend code / ← Back to email                                                             |
| Signup method | Create your account        | Continue with Google / Continue with email                       | By signing up, you agree to our Terms and Privacy Policy. Already have an account? Log in |
| Signup email  | What's your email address? | Continue with email                                              | By signing up, you agree to our Terms and Privacy Policy. ← Back to sign up               |
| Signup OTP    | Check your email           | Verify code                                                      | Resend code / ← Back to email                                                             |

## Component Architecture

### State Machine

```text
┌─────────────┐     click email      ┌───────────┐    submit email    ┌──────────────┐
│   METHOD    │ ──────────────────→  │   EMAIL   │ ────────────────→  │     OTP      │
│  SELECTION  │                      │   INPUT   │                    │ VERIFICATION │
└─────────────┘  ←───────────────    └───────────┘  ←───────────────  └──────────────┘
                       back                            back/cancel
```

### Suggested Step Type

```ts
type AuthStep = "method" | "email" | "otp";
```

### Props

```ts
interface AuthFormProps {
  mode: "login" | "signup";
  onSuccess?: () => void;
}
```

## Visual Design

* **Layout**: Centered, max-width ~400px, no card wrapper
* **Logo**: Centered above heading
* **Buttons**: Full-width, stacked vertically with consistent spacing
* **Typography**: Clear hierarchy – heading (h1), body text, links
* **Back link**: Left-aligned, subtle styling, positioned below form

## Transitions

* Smooth fade/slide between steps (optional enhancement)
* Maintain scroll position when navigating back

## Error Handling

* Inline error messages below relevant input
* Clear error state when user modifies input
* Specific messages for common errors (invalid email, expired OTP, rate limit)
* Third-party auth error surfaced on method selection with a one-line explanation

## Loading & Empty States

* Method selection: disable buttons and show spinner during third-party auth initiation
* Email input: disable CTA while sending code; show spinner inside button
* OTP: disable inputs while verifying; show progress indicator
* Resend: disabled until cooldown expires; show countdown

## OTP Constraints

* 6 digits, numeric only
* Expires after 10 minutes
* Resend cooldown: 30 seconds
* Rate limit: 5 attempts per hour per email

## Accessibility

* Focus management: auto-focus first input when entering email/OTP steps
* Keyboard navigation: Enter to submit, Escape to go back (optional)
* Screen reader announcements for step changes

## Open Questions

* \[ ] Should the logo link to home or be static?
* \[ ] Add "Remember me" checkbox?
* \[ ] Show password option as alternative to OTP?
* \[ ] Magic link option in addition to OTP?
* \[ ] Should login email step include a short notice about email delivery/usage?
