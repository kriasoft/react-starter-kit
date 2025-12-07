import { useLoginForm } from "@/hooks/use-login-form";
import { Button, Card, CardContent, Input, cn } from "@repo/ui";
import { Mail } from "lucide-react";
import type { ComponentProps } from "react";
import { OtpVerification } from "./otp-verification";
import { PasskeyLogin } from "./passkey-login";
import { SocialLogin } from "./social-login";

interface AuthFormContentProps {
  onSuccess?: () => void;
  className?: string;
  isExternallyLoading?: boolean;
}

function AuthFormContent({
  onSuccess,
  className,
  isExternallyLoading,
}: AuthFormContentProps) {
  const {
    email,
    isDisabled,
    error,
    showOtpInput,
    setEmail,
    handleSuccess,
    handleError,
    sendOtp,
    resetOtpFlow,
  } = useLoginForm({
    onSuccess,
    isExternallyLoading,
  });

  return (
    <div className={cn("flex flex-col gap-6", className)}>
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
      <PasskeyLogin
        onSuccess={handleSuccess}
        onError={handleError}
        isDisabled={isDisabled}
      />

      {/* Google OAuth - Works for both new and existing accounts */}
      <SocialLogin onError={handleError} isDisabled={isDisabled} />

      {/* Divider - Uses pseudo-element for line-through effect */}
      <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
        <span className="relative z-10 bg-background px-2 text-muted-foreground">
          Or continue with email
        </span>
      </div>

      {/* Email Form - OTP authentication flow */}
      {!showOtpInput ? (
        <form onSubmit={sendOtp} className="grid gap-3">
          <Input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isDisabled}
            autoComplete="email webauthn"
            required
          />
          <Button
            type="submit"
            variant="secondary"
            className="w-full"
            disabled={isDisabled || !email}
          >
            <Mail className="mr-2 h-4 w-4" />
            Continue with email
          </Button>
        </form>
      ) : (
        <OtpVerification
          email={email}
          onSuccess={handleSuccess}
          onError={handleError}
          onCancel={resetOtpFlow}
          isDisabled={isDisabled}
        />
      )}
    </div>
  );
}

interface LoginFormProps extends ComponentProps<"div"> {
  variant?: "page" | "modal";
  showTerms?: boolean;
  onSuccess?: () => void;
  isLoading?: boolean;
}

export function LoginForm({
  className,
  variant = "page",
  showTerms,
  onSuccess,
  isLoading,
  ...props
}: LoginFormProps) {
  // Default: Show terms on full page, hide in modals (unless overridden)
  const shouldShowTerms = showTerms ?? variant === "page";

  if (variant === "modal") {
    return (
      <div className={cn("flex flex-col gap-4", className)} {...props}>
        <AuthFormContent
          onSuccess={onSuccess}
          isExternallyLoading={isLoading}
        />
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
            <AuthFormContent
              onSuccess={onSuccess}
              isExternallyLoading={isLoading}
            />
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
