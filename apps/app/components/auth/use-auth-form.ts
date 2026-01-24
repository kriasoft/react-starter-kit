import { auth } from "@/lib/auth";
import { useState } from "react";
import type { FormEvent } from "react";

export type AuthStep = "method" | "email" | "otp";

interface UseAuthFormOptions {
  /**
   * Called after successful authentication. Caller is responsible for
   * cache invalidation and navigation.
   */
  onSuccess: () => void;
  isExternallyLoading?: boolean;
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
  const [error, setError] = useState<string | null>(null);

  // Combine internal and external loading states
  const isDisabled = isLoading || !!isExternallyLoading;

  const handleSuccess = () => {
    onSuccess();
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage || null);
  };

  const clearError = () => {
    setError(null);
  };

  const sendOtp = async (e?: FormEvent) => {
    e?.preventDefault();
    if (!email) return;

    try {
      setIsLoading(true);
      setError(null);

      // Send OTP - "sign-in" type handles both login and signup (creates user if needed)
      const result = await auth.emailOtp.sendVerificationOtp({
        email,
        type: "sign-in",
      });

      if (result.data) {
        setStep("otp");
        setError(null);
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

  const goToEmailStep = () => {
    setStep("email");
    setError(null);
  };

  const goToMethodStep = () => {
    setStep("method");
    setError(null);
  };

  // Go back to email step, preserving any error message
  const resetToEmail = () => {
    setStep("email");
  };

  return {
    // State
    step,
    email,
    isLoading,
    isDisabled,
    error,
    mode,

    // Setters
    setEmail,
    setIsLoading,
    setError,
    setStep,

    // Handlers
    handleSuccess,
    handleError,
    clearError,
    sendOtp,
    goToEmailStep,
    goToMethodStep,
    resetToEmail,
  };
}
