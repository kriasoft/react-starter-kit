---
outline: [2, 3]
---

# Social Providers

Google OAuth is configured out of the box. The flow redirects users to Google's consent screen, then back to your app where Better Auth creates or links the account.

## Server Configuration

Google OAuth credentials are set in `apps/api/lib/auth.ts`:

```ts
socialProviders: {
  google: {
    clientId: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
  },
},
```

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

**1. Add server config** in `apps/api/lib/auth.ts`:

```ts
socialProviders: {
  google: { ... },
  github: {  // [!code ++]
    clientId: env.GITHUB_CLIENT_ID,  // [!code ++]
    clientSecret: env.GITHUB_CLIENT_SECRET,  // [!code ++]
  },  // [!code ++]
},
```

**2. Add env vars** to `apps/api/lib/env.ts` and your `.env.local`.

**3. Update the providers list** in `apps/app/lib/auth-config.ts`:

```ts
oauth: {
  providers: ["google", "github"] as const,  // [!code ++]
},
```

**4. Create a login button component** following the `GoogleLogin` pattern – clear session cache, call `auth.signIn.social({ provider: "github" })`, handle errors.

**5. Add the button** to the `MethodSelection` component in `auth-form.tsx`.
