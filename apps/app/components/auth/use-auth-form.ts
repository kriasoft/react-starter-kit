import { auth } from "@/lib/auth";
import type { FormEvent } from "react";
import { useCallback, useRef, useState } from "react";

export type AuthStep = "method" | "email" | "otp";

// Minimal state machine for passwordless OTP flow. Intentionally shallow:
// - Errors are orthogonal to steps (can occur at any step)
// - No terminal state (component unmounts on success)
// Revisit if adding password fallback or MFA steps.
const VALID_TRANSITIONS: Record<AuthStep, AuthStep[]> = {
  method: ["email"],
  email: ["method", "otp"],
  otp: ["email"],
};

interface UseAuthFormOptions {
  /**
   * Called after successful authentication. Caller is responsible for
   * cache invalidation and navigation. Awaited before form state resets.
   */
  onSuccess: () => Promise<void>;
  isExternallyLoading?: boolean;
  /**
   * UI mode affecting copy, ToS display, and available methods.
   * Both modes use the same passwordless OTP flow that auto-creates accounts.
   */
  mode?: "login" | "signup";
}

export function useAuthForm({
  onSuccess,
  isExternallyLoading,
  mode = "login",
}: UseAuthFormOptions) {
  const [step, setStep] = useState<AuthStep>("method");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // Counter-based to handle overlapping child operations (e.g., rapid double-click)
  const [pendingOps, setPendingOps] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Guards against concurrent auth completion (e.g., passkey conditional UI + manual click).
  // Conditional passkey autofill intentionally doesn't block UI - it's passive/background.
  // Reset when returning to method step to allow retry after navigation back.
  const hasSucceededRef = useRef(false);
  // Ref provides current step to memoized transitionTo callback (avoids stale closure)
  const stepRef = useRef(step);
  stepRef.current = step;

  // Track child loading via counter to correctly handle overlapping operations
  const setChildBusy = useCallback((busy: boolean) => {
    setPendingOps((c) => (busy ? c + 1 : Math.max(0, c - 1)));
  }, []);

  // Unified busy state: disables navigation and other auth methods while any flow is active
  const isDisabled = isLoading || pendingOps > 0 || !!isExternallyLoading;

  const completeAuth = async () => {
    if (hasSucceededRef.current) return;
    hasSucceededRef.current = true;

    try {
      setIsLoading(true);
      await onSuccess();
    } catch (err) {
      console.error("Post-auth error:", err);
      setError("Something went wrong. Please try again.");
      hasSucceededRef.current = false; // Allow retry on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleError = (errorMessage: string | null) => {
    setError(errorMessage);
  };

  const clearError = () => {
    setError(null);
  };

  // Validates transitions to prevent invalid step jumps.
  // Returning to "method" resets the success guard to allow fresh auth attempts.
  const transitionTo = useCallback((next: AuthStep, clearErr = true) => {
    const current = stepRef.current;
    if (!VALID_TRANSITIONS[current].includes(next)) {
      return;
    }
    if (next === "method") {
      hasSucceededRef.current = false;
    }
    setStep(next);
    if (clearErr) setError(null);
  }, []);

  const goToEmailStep = () => transitionTo("email");
  const goToMethodStep = () => transitionTo("method");
  // Go back to email step, preserving error message
  const resetToEmail = () => transitionTo("email", false);

  const sendOtp = async (e?: FormEvent) => {
    e?.preventDefault();

    // Normalize before auth calls to prevent case/whitespace mismatches
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) return;
    setEmail(normalizedEmail);

    try {
      setIsLoading(true);
      setError(null);

      // "sign-in" type handles both login and signup (creates user if needed)
      const result = await auth.emailOtp.sendVerificationOtp({
        email: normalizedEmail,
        type: "sign-in",
      });

      if (result.data) {
        transitionTo("otp");
      } else if (result.error) {
        setError(result.error.message || "Failed to send OTP");
      }
    } catch (err) {
      console.error("Email OTP error:", err);
      setError("Failed to send verification code");
    } finally {
      setIsLoading(false);
    }
  };

  const changeEmail = (value: string) => {
    setEmail(value);
  };

  return {
    // State
    step,
    email,
    isLoading,
    isDisabled,
    error,
    mode,

    // Actions
    changeEmail,
    completeAuth,
    handleError,
    clearError,
    sendOtp,
    goToEmailStep,
    goToMethodStep,
    resetToEmail,
    setChildBusy,
  };
}
