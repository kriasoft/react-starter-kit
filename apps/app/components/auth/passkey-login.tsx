/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { auth } from "@/lib/auth";
import { Button, Input } from "@repo/ui";
import { KeyRound } from "lucide-react";
import { useEffect, useState } from "react";

interface PasskeyLoginProps {
  onSuccess: () => void;
  onError: (error: string) => void;
  isDisabled?: boolean;
}

export function PasskeyLogin({
  onSuccess,
  onError,
  isDisabled,
}: PasskeyLoginProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showEmailInput, setShowEmailInput] = useState(false);

  // Set up conditional UI for passkey autofill when component mounts
  useEffect(() => {
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
      if (!email && !showEmailInput) {
        setShowEmailInput(true);
        onError(""); // Clear any previous errors
        return;
      }

      setIsLoading(true);
      onError(""); // Clear any previous errors

      // Check if browser supports WebAuthn
      if (!window.PublicKeyCredential) {
        throw new Error("Your browser doesn't support passkeys");
      }

      // Email is required for passkey sign-in
      if (!email) {
        onError("Email is required for passkey sign-in");
        return;
      }

      // Attempt passkey sign-in with the provided email
      const result = await auth.signIn.passkey({ email });

      if (result.data) {
        onSuccess();
      } else if (result.error) {
        // Handle specific error cases based on error message
        const errorMessage = result.error.message || "";
        if (
          errorMessage.includes("not found") ||
          errorMessage.includes("No passkey")
        ) {
          if (!showEmailInput) {
            // Show email input for passkey
            setShowEmailInput(true);
            onError("Please enter your email to sign in with passkey.");
          } else {
            onError(
              "No passkey found for this email. Please sign in with Google first, then register a passkey from your account settings.",
            );
          }
        } else if (
          errorMessage.includes("cancelled") ||
          errorMessage.includes("aborted")
        ) {
          onError("Passkey authentication was cancelled.");
        } else {
          onError(errorMessage || "Failed to sign in with passkey");
        }
      }
    } catch (err) {
      console.error("Passkey login error:", err);
      // Provide helpful error messages
      if (err instanceof Error) {
        if (err.message.includes("NotAllowedError")) {
          onError(
            "Passkey operation was cancelled or timed out. Please try again.",
          );
        } else if (err.message.includes("NotSupportedError")) {
          onError("Passkeys are not supported on this device or browser.");
        } else {
          onError(err.message);
        }
      } else {
        onError("An unexpected error occurred during passkey authentication.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setShowEmailInput(false);
    setEmail("");
    onError("");
  };

  const disabled = isDisabled || isLoading;

  if (showEmailInput) {
    return (
      <div className="grid gap-3">
        <Input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={disabled}
          autoComplete="email webauthn"
          required
          autoFocus
        />
        <Button
          type="button"
          variant="default"
          className="w-full"
          onClick={handlePasskeyLogin}
          disabled={disabled || !email}
        >
          <KeyRound className="mr-2 h-4 w-4" />
          Continue with passkey
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="w-full text-sm"
          onClick={handleReset}
          disabled={disabled}
        >
          Try a different method
        </Button>
      </div>
    );
  }

  return (
    <Button
      type="button"
      variant="default"
      className="w-full"
      onClick={handlePasskeyLogin}
      disabled={disabled}
    >
      <KeyRound className="mr-2 h-4 w-4" />
      Sign in with passkey
    </Button>
  );
}
