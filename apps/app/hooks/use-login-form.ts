import { auth } from "@/lib/auth";
import { queryClient } from "@/lib/query";
import { sessionQueryOptions } from "@/lib/queries/session";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import type { FormEvent } from "react";

interface UseLoginFormOptions {
  onSuccess?: () => void;
  isExternallyLoading?: boolean;
}

export function useLoginForm({
  onSuccess,
  isExternallyLoading,
}: UseLoginFormOptions = {}) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showOtpInput, setShowOtpInput] = useState(false);

  // Combine internal and external loading states
  const isDisabled = isLoading || isExternallyLoading;

  const handleSuccess = async () => {
    // First, fetch the fresh session to ensure it's in the cache
    await queryClient.fetchQuery(sessionQueryOptions());

    // Then invalidate all queries to refresh session state
    await queryClient.invalidateQueries();

    // Call custom success handler or navigate to home
    if (onSuccess) {
      onSuccess();
    } else {
      navigate({ to: "/" });
    }
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

      // Send OTP to the user's email
      const result = await auth.emailOtp.sendVerificationOtp({
        email,
        type: "sign-in",
      });

      if (result.data) {
        setShowOtpInput(true);
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

  const resetOtpFlow = () => {
    setShowOtpInput(false);
    setError(null);
  };

  return {
    // State
    email,
    isLoading,
    isDisabled,
    error,
    showOtpInput,

    // Setters
    setEmail,
    setIsLoading,
    setError,
    setShowOtpInput,

    // Handlers
    handleSuccess,
    handleError,
    clearError,
    sendOtp,
    resetOtpFlow,
  };
}
