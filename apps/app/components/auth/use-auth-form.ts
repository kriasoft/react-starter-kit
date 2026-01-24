import { auth } from "@/lib/auth";
import type { FormEvent } from "react";
import { useCallback, useRef, useState } from "react";

export type AuthStep = "method" | "email" | "otp";

/** Child component identifiers for tracking concurrent loading states */
export type AuthChildKey = "social" | "passkey" | "otp";

// Minimal state machine for passwordless OTP flow. Intentionally shallow:
// - Errors are orthogonal to steps (can occur at any step)
// - Loading states handled by isLoading/isChildLoading
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
   * UI variant affecting copy, ToS display, and available methods.
   * Both variants use the same passwordless OTP flow that auto-creates accounts.
   */
  variant?: "login" | "signup";
}

export function useAuthForm({
  onSuccess,
  isExternallyLoading,
  variant = "login",
}: UseAuthFormOptions) {
  const [step, setStep] = useState<AuthStep>("method");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // Tracks loading state per child component to handle concurrent auth methods
  const [loadingChildren, setLoadingChildren] = useState<Set<AuthChildKey>>(
    () => new Set(),
  );
  const [error, setError] = useState<string | null>(null);

  const isChildLoading = loadingChildren.size > 0;
  // Guards against concurrent auth completion (e.g., passkey conditional UI + manual OTP).
  // Reset when returning to method step to allow retry after navigation back.
  const hasSucceededRef = useRef(false);
  // Sync ref for checking current step in transitionTo without stale closure
  const stepRef = useRef(step);
  stepRef.current = step;

  // Unified busy state: parent loading, child loading, or external loading
  const isDisabled = isLoading || isChildLoading || !!isExternallyLoading;

  // Keyed loading tracker - idempotent to handle redundant calls from children
  const setChildLoading = useCallback((key: AuthChildKey, loading: boolean) => {
    setLoadingChildren((prev) => {
      const has = prev.has(key);
      if (loading ? has : !has) return prev; // No logical change
      const next = new Set(prev);
      if (loading) next.add(key);
      else next.delete(key);
      return next;
    });
  }, []);

  const handleSuccess = async () => {
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
    stepRef.current = next; // Sync immediately for potential same-tick calls
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
    variant,

    // Actions
    changeEmail,
    handleSuccess,
    handleError,
    clearError,
    sendOtp,
    goToEmailStep,
    goToMethodStep,
    resetToEmail,
    setChildLoading,
  };
}
