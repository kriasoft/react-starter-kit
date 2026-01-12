import { useAuthForm } from "@/hooks/use-auth-form";
import { Button, Card, CardContent, Input, cn } from "@repo/ui";
import { Mail } from "lucide-react";
import type { ComponentProps } from "react";
import { OtpVerification } from "./otp-verification";
import { PasskeyLogin } from "./passkey-login";
import { SocialLogin } from "./social-login";
import { Link } from "@tanstack/react-router";

interface AuthFormContentProps {
  onSuccess?: () => void;
  className?: string;
  isExternallyLoading?: boolean;
  mode?: "login" | "signup";
}

function AuthFormContent({
  onSuccess,
  className,
  isExternallyLoading,
  mode = "login",
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
    mode: formMode,
  } = useAuthForm({
    onSuccess,
    isExternallyLoading,
    mode,
  });

  const isSignup = formMode === "signup";
  const heading = isSignup ? "Welcome" : "Welcome back";
  const subheading = isSignup
    ? "Create your account"
    : "Sign in to your account";
  const emailButtonText = isSignup
    ? "Sign up with email"
    : "Sign in with email";

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <div className="flex flex-col items-center text-center">
        <h1 className="text-2xl font-bold">{heading}</h1>
        <p className="text-muted-foreground text-balance">{subheading}</p>
      </div>

      {/* Error message */}
      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Passkey Login - Only show for login mode (requires existing account) */}
      {!isSignup && (
        <PasskeyLogin
          onSuccess={handleSuccess}
          onError={handleError}
          isDisabled={isDisabled}
        />
      )}

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
            {emailButtonText}
          </Button>
          {/* Account Link - Show link to switch between login/signup */}
          <div className="text-center text-sm text-muted-foreground">
            {isSignup ? (
              <>
                Already have an account?{" "}
                <Link
                  to="/login"
                  activeProps={{
                    className:
                      "font-medium text-primary underline-offset-4 hover:underline",
                  }}
                >
                  Sign in
                </Link>
              </>
            ) : (
              <>
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  activeProps={{
                    className:
                      "font-medium text-primary underline-offset-4 hover:underline",
                  }}
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </form>
      ) : (
        <OtpVerification
          email={email}
          onSuccess={handleSuccess}
          onError={handleError}
          onCancel={resetOtpFlow}
          isDisabled={isDisabled}
          mode={formMode}
        />
      )}
    </div>
  );
}

interface AuthFormProps extends ComponentProps<"div"> {
  variant?: "page" | "modal";
  showTerms?: boolean;
  onSuccess?: () => void;
  isLoading?: boolean;
  mode?: "login" | "signup";
  /**
   * Optional image path (svg, jpg, or png) to display in right panel.
   * When provided, layout becomes two-column on md+.
   * If empty/undefined, only single card is shown.
   */
  rightPanelImage?: string;
}

export function AuthForm({
  className,
  variant = "page",
  showTerms,
  onSuccess,
  isLoading,
  mode = "login",
  rightPanelImage,
  ...props
}: AuthFormProps) {
  // Default: Show terms on full page, hide in modals (unless overridden)
  const shouldShowTerms = showTerms ?? variant === "page";
  const hasRightPanel = Boolean(rightPanelImage);

  if (variant === "modal") {
    return (
      <div className={cn("flex flex-col gap-4", className)} {...props}>
        <AuthFormContent
          onSuccess={onSuccess}
          isExternallyLoading={isLoading}
          mode={mode}
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
      <Card
        className={cn(
          "overflow-hidden p-0 mx-auto w-full",
          hasRightPanel ? "max-w-3xl" : "max-w-md",
        )}
      >
        <CardContent
          className={cn("p-0", hasRightPanel ? "grid md:grid-cols-2" : "block")}
        >
          <div className="p-6 md:p-8">
            <AuthFormContent
              onSuccess={onSuccess}
              isExternallyLoading={isLoading}
              mode={mode}
            />
          </div>
          {hasRightPanel && (
            <div className="relative hidden bg-muted md:flex md:items-center md:justify-center">
              <img
                src={rightPanelImage}
                alt="descriptive text about the image card"
                className="h-full w-full object-cover"
              />
            </div>
          )}
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
