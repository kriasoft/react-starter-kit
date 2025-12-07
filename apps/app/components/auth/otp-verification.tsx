import { auth } from "@/lib/auth";
import { Button, Input } from "@repo/ui";
import { useState } from "react";
import type { FormEvent } from "react";

interface OtpVerificationProps {
  email: string;
  onSuccess: () => void;
  onError: (error: string) => void;
  onCancel: () => void;
  isDisabled?: boolean;
}

export function OtpVerification({
  email,
  onSuccess,
  onError,
  onCancel,
  isDisabled,
}: OtpVerificationProps) {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleOtpVerification = async (e: FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!email || !otp) return;

    try {
      setIsLoading(true);
      onError(""); // Clear any previous errors

      // Sign in with OTP
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
          onCancel(); // Reset to email input
        } else if (errorMessage.includes("expired")) {
          onError("Code has expired. Please request a new one.");
          onCancel(); // Reset to email input
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

  const handleResendOtp = async () => {
    setOtp("");
    onError("");

    try {
      setIsLoading(true);

      // Send new OTP to the user's email
      const result = await auth.emailOtp.sendVerificationOtp({
        email,
        type: "sign-in",
      });

      if (result.error) {
        onError(result.error.message || "Failed to send OTP");
      }
    } catch (err) {
      console.error("Email OTP error:", err);
      onError("Failed to send verification code");
    } finally {
      setIsLoading(false);
    }
  };

  const disabled = isDisabled || isLoading;

  return (
    <form onSubmit={handleOtpVerification} className="grid gap-3">
      <div className="text-sm text-muted-foreground">
        We've sent a verification code to <strong>{email}</strong>
      </div>
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
      />
      <Button
        type="submit"
        variant="default"
        className="w-full"
        disabled={disabled || otp.length !== 6}
      >
        Verify code
      </Button>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="ghost"
          className="flex-1 text-sm"
          onClick={onCancel}
          disabled={disabled}
        >
          Change email
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="flex-1 text-sm"
          onClick={handleResendOtp}
          disabled={disabled}
        >
          Resend code
        </Button>
      </div>
      <div className="text-xs text-muted-foreground text-center">
        Code expires in 5 minutes
      </div>
    </form>
  );
}
