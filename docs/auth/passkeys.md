---
outline: [2, 3]
---

# Passkeys

Passkey authentication uses the [WebAuthn](https://webauthn.io/) standard to provide phishing-resistant sign-in with device biometrics or hardware security keys. The server stores a public key rather than a reusable password.

::: info

Passkeys are available for **login only** in the starter UI. Users must first create an account through email OTP or Google OAuth. Better Auth exposes the registration API, but this starter does not include passkey-management settings; add that authenticated UI before relying on passkeys as an end-user method. The sign-up form does not show the passkey option.

:::

## Server Configuration

The passkey plugin is configured in `apps/api/lib/auth.ts`:

```ts
passkey({
  rpID,         // Domain name (e.g., "example.com" or "localhost")
  rpName: env.APP_NAME,  // Human-readable name shown in browser prompts
  origin: env.APP_ORIGIN,
}),
```

The `rpID` (Relying Party ID) is extracted from `APP_ORIGIN`:

```ts
const appUrl = new URL(env.APP_ORIGIN);
const rpID = appUrl.hostname;
```

This means passkeys are bound to the domain – a passkey registered on `example.com` won't work on `staging.example.com`. The `rpName` appears in the browser's passkey dialog (e.g., "Sign in to My App").

### Database Table

Passkey credentials are stored in `db/schema/passkey.ts`:

| Column         | Description                                             |
| -------------- | ------------------------------------------------------- |
| `publicKey`    | WebAuthn public key                                     |
| `credentialID` | Unique credential identifier                            |
| `counter`      | Signature counter (replay protection)                   |
| `deviceType`   | `"singleDevice"` or `"multiDevice"`                     |
| `backedUp`     | Whether the credential is synced across devices         |
| `transports`   | Communication methods (USB, BLE, NFC, internal)         |
| `lastUsedAt`   | Last successful use, for security review                |
| `deviceName`   | User-friendly label (e.g., "MacBook Pro")               |
| `platform`     | `"platform"` (built-in) or `"cross-platform"` (USB key) |

## Client Component

The `PasskeyLogin` component in `apps/app/components/auth/passkey-login.tsx` handles two modes:

### Explicit Login

When the user clicks "Log in with passkey", the component checks for WebAuthn support and triggers the browser's credential picker:

```ts
const handlePasskeyLogin = async () => {
  if (!window.PublicKeyCredential) {
    onError(authConfig.errors.passkeyNotSupported);
    return;
  }

  const result = await auth.signIn.passkey();

  if (result.data) {
    onSuccess();
  } else if (result.error) {
    const errorCode = "code" in result.error ? result.error.code : undefined;
    if (errorCode === "AUTH_CANCELLED") {
      onError("Passkey authentication was cancelled.");
    } else {
      onError(result.error.message || authConfig.errors.genericError);
    }
  }
};
```

### Conditional Mediation

When enabled, the component requests conditional mediation on mount in browsers that support it. The attempt is passive and does not surface errors because the user did not explicitly start authentication:

```ts
useEffect(() => {
  if (!authConfig.passkey.enableConditionalUI) return;

  const setupConditionalUI = async () => {
    if (!window.PublicKeyCredential?.isConditionalMediationAvailable) return;

    const isAvailable =
      await window.PublicKeyCredential.isConditionalMediationAvailable();
    if (!isAvailable) return;

    const result = await auth.signIn.passkey({ autoFill: true });
    if (result.data && !aborted) {
      onSuccessRef.current();
    }
  };

  setupConditionalUI();
}, []);
```

Conditional UI is controlled by the `authConfig.passkey.enableConditionalUI` flag (default: `true`). Errors from conditional UI are silently ignored since the user hasn't explicitly requested authentication.

## Client Configuration

Passkey behavior is configured in `apps/app/lib/auth-config.ts`:

```ts
passkey: {
  enableConditionalUI: true,
},
```

`enableConditionalUI` controls whether the component attempts conditional mediation. Other WebAuthn behavior uses Better Auth's defaults; configure the plugin or client explicitly if your application needs different verification requirements.

## Error Handling

| Error | Cause | Behavior |
| --- | --- | --- |
| `AUTH_CANCELLED` | User dismissed the WebAuthn prompt or it timed out | Shows cancellation message |
| `passkeyNotSupported` | `window.PublicKeyCredential` is undefined | Shows browser support message |
| Network error | Offline or DNS failure | Shows network error message |
| Server error | No passkey found, invalid credential | Shows server error message |

## Browser Support

Passkeys require WebAuthn support. The component checks `window.PublicKeyCredential` before explicit authentication and checks conditional-mediation support before starting autofill. Unsupported browsers keep the email and configured social-provider paths available.
