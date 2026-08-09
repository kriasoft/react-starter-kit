---
outline: [2, 3]
---

# Social Providers

Google OAuth ships wired up but **off** until you supply credentials. The flow redirects users to Google's consent screen, then back to your app where Better Auth creates or links the account.

Set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` together or not at all. With neither, the provider stays disabled and the sign-in form hides its button; with only one, `createAuth` throws naming the missing variable, because a half-configured provider is a mistake rather than a choice.

## Server Configuration

Google OAuth credentials are set in `apps/api/lib/auth.ts`:

```ts
// Returns {} when neither credential is set, so Better Auth registers no
// social provider at all.
socialProviders: googleProvider(env),
```

The same function backs the `config.socialProviders` tRPC query, which the sign-in form reads to decide which buttons to render. The client still needs a button for each supported provider, but it does not maintain a second enabled-provider list that can drift from server credentials.

### Setting Up Google OAuth

1. Go to the [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create an OAuth 2.0 Client ID (Web application type)
3. Add authorized redirect URI: `https://your-domain.com/api/auth/callback/google`
   - For local development: `http://localhost:5173/api/auth/callback/google`
4. Copy the client ID and secret to your `.env.local`:

```sh
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-client-secret
```

## Client Component

The `GoogleLogin` component in `apps/app/components/auth/google-login.tsx` handles the OAuth redirect:

```ts
const handleGoogleLogin = async () => {
  // Clear stale session before OAuth redirect
  queryClient.removeQueries({ queryKey: sessionQueryKey });

  // OAuth redirects to /login which validates session and redirects to returnTo
  const callbackURL = returnTo
    ? `/login?returnTo=${encodeURIComponent(returnTo)}`
    : "/login";

  const result = await auth.signIn.social({
    provider: "google",
    callbackURL,
  });
};
```

The flow works as follows:

1. User clicks "Continue with Google"
2. Stale session cache is cleared (prevents showing old data after redirect)
3. `auth.signIn.social()` redirects to Google's consent screen
4. After consent, Google redirects back to `/api/auth/callback/google`
5. Better Auth creates/links the account and sets the session cookie
6. The callback redirects to `callbackURL` (`/login?returnTo=...`)
7. The login page detects the active session and redirects to `returnTo`

### Preserving Return URL

The `returnTo` parameter survives the OAuth round-trip by being encoded into the `callbackURL`. When the user lands back on `/login`, the search params schema validates and sanitizes the URL:

```ts
const searchSchema = z.object({
  returnTo: z
    .string()
    .optional()
    .transform((val) => {
      const safe = getSafeRedirectUrl(val);
      return safe === "/" ? undefined : safe;
    })
    .catch(undefined),
});
```

Only same-origin relative paths are accepted – absolute URLs and protocol-relative URLs (`//evil.com`) are rejected.

## Adding Another Provider

Better Auth supports [30+ OAuth providers](https://www.better-auth.com/docs/concepts/oauth). To add one:

**1. Add both credentials** to `apps/api/lib/env.ts` and `.env.local`, keeping them optional so deployments that do not use the provider still work.

**2. Extend the server provider helper** in `apps/api/lib/auth.ts`, including the same both-or-neither check used for Google:

```ts
return {
  google: { ... },
  github: { clientId: githubId, clientSecret: githubSecret }, // [!code ++]
};
```

`config.socialProviders` returns the helper's keys, so there is no separate client-side provider list to update.

**3. Create a login button component** following the `GoogleLogin` pattern – clear session cache, call `auth.signIn.social({ provider: "github" })`, and handle errors.

**4. Render the button** in `MethodSelection` only when `socialProviders.includes("github")`.
