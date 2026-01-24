import { Button, Input, cn } from "@repo/ui";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Mail } from "lucide-react";
import type { ComponentProps } from "react";
import { OtpVerification } from "./otp-verification";
import { PasskeyLogin } from "./passkey-login";
import { SocialLogin } from "./social-login";
import { useAuthForm, type AuthChildKey } from "./use-auth-form";

const APP_NAME = import.meta.env.VITE_APP_NAME || "your account";

function SignupTerms() {
  return (
    <p className="text-xs text-muted-foreground text-center text-balance">
      By signing up, you agree to our{" "}
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
    </p>
  );
}

interface AuthFormProps extends ComponentProps<"div"> {
  /**
   * UI variant affecting copy, ToS display, and available methods.
   * Both variants use the same passwordless OTP flow that auto-creates accounts.
   */
  variant?: "login" | "signup";
  /** Called after successful auth. Awaited before UI progresses. Caller handles cache invalidation and navigation. */
  onSuccess: () => Promise<void>;
  isLoading?: boolean;
  /** Post-auth redirect destination. Must be a safe relative path (validated by caller). */
  returnTo?: string;
}

export function AuthForm({
  className,
  onSuccess,
  isLoading,
  variant = "login",
  returnTo,
  ...props
}: AuthFormProps) {
  const {
    step,
    email,
    isDisabled,
    error,
    changeEmail,
    handleSuccess,
    handleError,
    clearError,
    sendOtp,
    goToEmailStep,
    goToMethodStep,
    resetToEmail,
    setChildLoading,
    variant: formVariant,
  } = useAuthForm({
    onSuccess,
    isExternallyLoading: isLoading,
    variant,
  });

  // Clear error when user changes email
  const handleEmailChange = (value: string) => {
    if (error) clearError();
    changeEmail(value);
  };

  // Voluntary back from OTP clears error; forced back (via onCancel) preserves it
  const handleOtpBack = () => {
    clearError();
    resetToEmail();
  };

  const isSignup = formVariant === "signup";

  return (
    <div className={cn("flex flex-col gap-6 w-full", className)} {...props}>
      {/* Logo */}
      <div className="flex justify-center">
        <Link to="/" aria-label="Go to homepage">
          <img src="/logo512.png" alt="" className="h-10 w-10" />
        </Link>
      </div>

      {/* Error message - role="alert" ensures screen readers announce it */}
      {error && (
        <div
          role="alert"
          className="rounded-md bg-destructive/10 p-3 text-sm text-destructive"
        >
          {error}
        </div>
      )}

      {/* Step: Method Selection */}
      {step === "method" && (
        <MethodSelection
          isSignup={isSignup}
          isDisabled={isDisabled}
          onEmailClick={goToEmailStep}
          onSuccess={handleSuccess}
          onError={handleError}
          setChildLoading={setChildLoading}
          returnTo={returnTo}
        />
      )}

      {/* Step: Email Input */}
      {step === "email" && (
        <EmailInput
          email={email}
          isSignup={isSignup}
          isDisabled={isDisabled}
          onEmailChange={handleEmailChange}
          onSubmit={sendOtp}
          onBack={goToMethodStep}
        />
      )}

      {/* Step: OTP Verification */}
      {step === "otp" && (
        <OtpStep
          email={email}
          isDisabled={isDisabled}
          onSuccess={handleSuccess}
          onError={handleError}
          setChildLoading={setChildLoading}
          onBack={handleOtpBack}
          onCancel={resetToEmail}
        />
      )}
    </div>
  );
}

// Step 1: Method Selection
interface MethodSelectionProps {
  isSignup: boolean;
  isDisabled: boolean;
  onEmailClick: () => void;
  onSuccess: () => void;
  onError: (error: string | null) => void;
  setChildLoading: (key: AuthChildKey, loading: boolean) => void;
  returnTo?: string;
}

function MethodSelection({
  isSignup,
  isDisabled,
  onEmailClick,
  onSuccess,
  onError,
  setChildLoading,
  returnTo,
}: MethodSelectionProps) {
  const heading = isSignup ? "Create your account" : `Log in to ${APP_NAME}`;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-center">{heading}</h1>

      <div className="flex flex-col gap-3">
        <SocialLogin
          onError={onError}
          isDisabled={isDisabled}
          onLoadingChange={(loading) => setChildLoading("social", loading)}
          returnTo={returnTo}
        />

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={onEmailClick}
          disabled={isDisabled}
        >
          <Mail className="mr-2 h-4 w-4" />
          Continue with email
        </Button>

        {/* Passkey only available for login (requires existing account) */}
        {!isSignup && (
          <PasskeyLogin
            onSuccess={onSuccess}
            onError={onError}
            onLoadingChange={(loading) => setChildLoading("passkey", loading)}
            isDisabled={isDisabled}
          />
        )}
      </div>

      {isSignup && <SignupTerms />}

      {/* Account switch link */}
      <p className="text-sm text-muted-foreground text-center">
        {isSignup ? (
          <>
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Log in
            </Link>
          </>
        ) : (
          <>
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Sign up
            </Link>
          </>
        )}
      </p>
    </div>
  );
}

// Step 2: Email Input
interface EmailInputProps {
  email: string;
  isSignup: boolean;
  isDisabled: boolean;
  onEmailChange: (email: string) => void;
  onSubmit: (e?: React.FormEvent) => void;
  onBack: () => void;
}

function EmailInput({
  email,
  isSignup,
  isDisabled,
  onEmailChange,
  onSubmit,
  onBack,
}: EmailInputProps) {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-center">
        What's your email address?
      </h1>

      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <Input
          type="email"
          placeholder="Enter your email address..."
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          disabled={isDisabled}
          autoComplete="email"
          autoFocus
          required
        />
        <Button
          type="submit"
          variant="default"
          className="w-full"
          disabled={isDisabled || !email.trim()}
        >
          Continue with email
        </Button>
      </form>

      {isSignup && <SignupTerms />}

      {/* Back link */}
      <button
        type="button"
        onClick={onBack}
        disabled={isDisabled}
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to {isSignup ? "sign up" : "login"}
      </button>
    </div>
  );
}

// Step 3: OTP Verification
interface OtpStepProps {
  email: string;
  isDisabled: boolean;
  onSuccess: () => void;
  onError: (error: string | null) => void;
  setChildLoading: (key: AuthChildKey, loading: boolean) => void;
  onBack: () => void;
  onCancel: () => void;
}

function OtpStep({
  email,
  isDisabled,
  onSuccess,
  onError,
  setChildLoading,
  onBack,
  onCancel,
}: OtpStepProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Check your email</h1>
        <p className="text-muted-foreground mt-1">
          We sent a code to <strong>{email}</strong>
        </p>
      </div>

      <OtpVerification
        email={email}
        onSuccess={onSuccess}
        onError={onError}
        onLoadingChange={(loading) => setChildLoading("otp", loading)}
        onCancel={onCancel}
        isDisabled={isDisabled}
      />

      {/* Back link */}
      <button
        type="button"
        onClick={onBack}
        disabled={isDisabled}
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to email
      </button>
    </div>
  );
}
