/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { auth } from "@/lib/auth";
import { queryClient } from "@/lib/query";
import { Button, Card, CardContent, Input, cn } from "@repo/ui";
import { useNavigate } from "@tanstack/react-router";
import { KeyRound } from "lucide-react";
import * as React from "react";

interface AuthFormContentProps {
  onSuccess?: () => void;
  className?: string;
}

function AuthFormContent({ onSuccess, className }: AuthFormContentProps) {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [showPasskeyEmail, setShowPasskeyEmail] = React.useState(false);

  // Set up conditional UI for passkey autofill when component mounts
  React.useEffect(() => {
    let abortController: AbortController | null = null;

    const setupConditionalUI = async () => {
      // Check if browser supports conditional UI
      if (!window.PublicKeyCredential?.isConditionalMediationAvailable) {
        return;
      }

      const isAvailable =
        await window.PublicKeyCredential.isConditionalMediationAvailable();
      if (!isAvailable) {
        return;
      }

      // Create abort controller for cleanup
      abortController = new AbortController();

      // This enables autofill for passkeys on input fields with autocomplete="webauthn"
      // It runs silently in the background and doesn't show any UI unless user interacts with an input
      try {
        await auth.signIn.passkey({
          autoFill: true,
        });
      } catch (err) {
        // Only log if not aborted
        if (err instanceof Error && !err.message.includes("abort")) {
          console.debug("Passkey autofill setup failed:", err);
        }
      }
    };

    setupConditionalUI();

    // Cleanup function to abort passkey operation
    return () => {
      if (abortController) {
        abortController.abort();
      }
    };
  }, []);

  const handlePasskeyLogin = async () => {
    try {
      // If no email provided yet, show the email input
      if (!email && !showPasskeyEmail) {
        setShowPasskeyEmail(true);
        setError(null); // Clear any previous errors
        return;
      }

      setIsLoading(true);
      setError(null);

      // Check if browser supports WebAuthn
      if (!window.PublicKeyCredential) {
        throw new Error("Your browser doesn't support passkeys");
      }

      // Email is required for passkey sign-in
      if (!email) {
        setError("Email is required for passkey sign-in");
        return;
      }

      // Attempt passkey sign-in with the provided email
      const result = await auth.signIn.passkey({ email });

      if (result.data) {
        // Invalidate all queries to refresh session state
        await queryClient.invalidateQueries();

        // Successful authentication
        if (onSuccess) {
          onSuccess();
        } else {
          navigate({ to: "/" });
        }
      } else if (result.error) {
        // Handle specific error cases based on error message
        const errorMessage = result.error.message || "";
        if (
          errorMessage.includes("not found") ||
          errorMessage.includes("No passkey")
        ) {
          if (!showPasskeyEmail) {
            // Show email input for passkey
            setShowPasskeyEmail(true);
            setError("Please enter your email to sign in with passkey.");
          } else {
            setError(
              "No passkey found for this email. Please sign in with Google first, then register a passkey from your account settings.",
            );
          }
        } else if (
          errorMessage.includes("cancelled") ||
          errorMessage.includes("aborted")
        ) {
          setError("Passkey authentication was cancelled.");
        } else {
          setError(errorMessage || "Failed to sign in with passkey");
        }
      }
    } catch (err) {
      console.error("Passkey login error:", err);
      // Provide helpful error messages
      if (err instanceof Error) {
        if (err.message.includes("NotAllowedError")) {
          setError(
            "Passkey operation was cancelled or timed out. Please try again.",
          );
        } else if (err.message.includes("NotSupportedError")) {
          setError("Passkeys are not supported on this device or browser.");
        } else {
          setError(err.message);
        }
      } else {
        setError("An unexpected error occurred during passkey authentication.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Clear any stale session data before OAuth redirect
      queryClient.removeQueries();

      // Initiate Google OAuth flow
      await auth.signIn.social({
        provider: "google",
        callbackURL: "/", // Redirect to dashboard after successful auth
      });

      // Note: This code won't execute as OAuth redirects the page
      // The onSuccess callback won't fire for OAuth flows
    } catch (err) {
      console.error("Google login error:", err);
      setError("Failed to sign in with Google");
      setIsLoading(false);
    }
  };

  const handleEmailContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      setIsLoading(true);
      setError(null);

      // For now, using email/password flow
      // TODO: Implement magic link when available
      setError("Please use Google sign-in or passkey authentication");

      // Note: Better Auth supports email/password but not magic links by default
      // Would need to add magic-link plugin for that functionality
    } catch (err) {
      console.error("Email login error:", err);
      setError("Failed to send magic link");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleEmailContinue}
      className={cn("flex flex-col gap-6", className)}
    >
      <div className="flex flex-col items-center text-center">
        <h1 className="text-2xl font-bold">Welcome</h1>
        <p className="text-muted-foreground text-balance">
          Sign in or create your account
        </p>
      </div>

      {/* Error message */}
      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Passkey Login - Primary CTA for returning users with passkeys */}
      {showPasskeyEmail ? (
        <div className="grid gap-3">
          <Input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            autoComplete="email webauthn"
            required
            autoFocus
          />
          <Button
            type="button"
            variant="default"
            className="w-full"
            onClick={handlePasskeyLogin}
            disabled={isLoading || !email}
          >
            <KeyRound className="mr-2 h-4 w-4" />
            Continue with passkey
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="w-full text-sm"
            onClick={() => {
              setShowPasskeyEmail(false);
              setError(null);
              setEmail("");
            }}
            disabled={isLoading}
          >
            Try a different method
          </Button>
        </div>
      ) : (
        <Button
          type="button"
          variant="default"
          className="w-full"
          onClick={handlePasskeyLogin}
          disabled={isLoading}
        >
          <KeyRound className="mr-2 h-4 w-4" />
          Sign in with passkey
        </Button>
      )}

      {/* Google OAuth - Works for both new and existing accounts */}
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleGoogleLogin}
        disabled={isLoading}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="mr-2 h-4 w-4"
        >
          <path
            d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
            fill="currentColor"
          />
        </svg>
        Continue with Google
      </Button>

      {/* Divider - Uses pseudo-element for line-through effect */}
      <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
        <span className="relative z-10 bg-background px-2 text-muted-foreground">
          Or continue with email
        </span>
      </div>

      {/* Email Form - Unified flow for sign in/sign up via magic link */}
      <div className="grid gap-3">
        <Input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading || showPasskeyEmail}
          autoComplete="email webauthn"
          required
        />
        <Button
          type="submit"
          variant="secondary"
          className="w-full"
          disabled={isLoading || !email}
        >
          Continue with email
        </Button>
      </div>
    </form>
  );
}

interface LoginFormProps extends React.ComponentProps<"div"> {
  variant?: "page" | "modal";
  showTerms?: boolean;
  onSuccess?: () => void;
}

export function LoginForm({
  className,
  variant = "page",
  showTerms,
  onSuccess,
  ...props
}: LoginFormProps) {
  // Default: Show terms on full page, hide in modals (unless overridden)
  const shouldShowTerms = showTerms ?? variant === "page";

  if (variant === "modal") {
    return (
      <div className={cn("flex flex-col gap-4", className)} {...props}>
        <AuthFormContent onSuccess={onSuccess} />
        {shouldShowTerms && (
          <div className="text-center text-xs text-muted-foreground text-balance">
            By clicking continue, you agree to our{" "}
            <a
              href="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="/privacy"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </a>
            .
          </div>
        )}
      </div>
    );
  }

  // Default page variant with card layout
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="p-6 md:p-8">
            <AuthFormContent onSuccess={onSuccess} />
          </div>

          {/* Right panel - Hidden on mobile, provides visual balance on desktop */}
          <div className="relative hidden bg-muted md:block">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/10" />
          </div>
        </CardContent>
      </Card>

      {/* Terms Footer - Required for compliance, configurable via showTerms prop */}
      {shouldShowTerms && (
        <div className="text-center text-xs text-muted-foreground text-balance">
          By clicking continue, you agree to our{" "}
          <a
            href="/terms"
            className="underline underline-offset-4 hover:text-primary"
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="/privacy"
            className="underline underline-offset-4 hover:text-primary"
          >
            Privacy Policy
          </a>
          .
        </div>
      )}
    </div>
  );
}
