import { auth } from "@/lib/auth";
import { Button, Input } from "@repo/ui";
import type { FormEvent } from "react";
import { useCallback, useEffect, useState } from "react";

const RESEND_COOLDOWN_SECONDS = 30;

interface OtpVerificationProps {
  email: string;
  onSuccess: () => void;
  onError: (error: string | null) => void;
  onCancel: () => void;
  isDisabled?: boolean;
  onLoadingChange?: (loading: boolean) => void;
}

export function OtpVerification({
  email,
  onSuccess,
  onError,
  onCancel,
  isDisabled,
  onLoadingChange,
}: OtpVerificationProps) {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Sync loading state to parent
  useEffect(() => {
    onLoadingChange?.(isLoading);
  }, [isLoading, onLoadingChange]);

  // Countdown timer for resend cooldown
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleOtpVerification = async (e: FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!email || !otp) return;

    try {
      setIsLoading(true);
      onError(null);

      const result = await auth.signIn.emailOtp({
        email,
        otp,
      });

      if (result.data) {
        onSuccess();
      } else if (result.error) {
        const errorMessage = result.error.message || "";
        if (errorMessage.includes("TOO_MANY_ATTEMPTS")) {
          onError("Too many failed attempts. Please request a new code.");
          onCancel();
        } else if (errorMessage.includes("expired")) {
          onError("Code has expired. Please request a new one.");
          onCancel();
        } else {
          onError(errorMessage || "Invalid verification code");
        }
      }
    } catch (err) {
      console.error("OTP verification error:", err);
      onError("Failed to verify code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = useCallback(async () => {
    if (resendCooldown > 0) return;

    setOtp("");
    onError(null);

    try {
      setIsLoading(true);

      // "sign-in" type handles both login and signup (creates user if needed)
      const result = await auth.emailOtp.sendVerificationOtp({
        email,
        type: "sign-in",
      });

      if (result.error) {
        onError(result.error.message || "Failed to send OTP");
      } else {
        setResendCooldown(RESEND_COOLDOWN_SECONDS);
      }
    } catch (err) {
      console.error("Email OTP error:", err);
      onError("Failed to send verification code");
    } finally {
      setIsLoading(false);
    }
  }, [email, onError, resendCooldown]);

  const disabled = isDisabled || isLoading;

  return (
    <form onSubmit={handleOtpVerification} className="flex flex-col gap-3">
      <Input
        type="text"
        placeholder="Enter 6-digit code"
        value={otp}
        onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
        disabled={disabled}
        autoComplete="one-time-code"
        required
        autoFocus
        maxLength={6}
        pattern="[0-9]{6}"
        inputMode="numeric"
        className="text-center text-lg tracking-widest"
      />
      <Button
        type="submit"
        variant="default"
        className="w-full"
        disabled={disabled || otp.length !== 6}
      >
        Verify code
      </Button>
      <Button
        type="button"
        variant="ghost"
        className="w-full text-sm"
        onClick={handleResendOtp}
        disabled={disabled || resendCooldown > 0}
      >
        {resendCooldown > 0
          ? `Resend code in ${resendCooldown}s`
          : "Resend code"}
      </Button>
    </form>
  );
}
