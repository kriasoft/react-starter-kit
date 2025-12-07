import { auth } from "@/lib/auth";
import { authConfig } from "@/lib/auth-config";
import { Button } from "@repo/ui";
import { KeyRound } from "lucide-react";
import { useEffect, useState } from "react";

interface PasskeyLoginProps {
  onSuccess: () => void;
  onError: (error: string) => void;
  isDisabled?: boolean;
}

/**
 * Passkey sign-in component using WebAuthn.
 *
 * WebAuthn handles credential discovery - no email input needed.
 * The browser prompts the user to select from their available passkeys.
 */
export function PasskeyLogin({
  onSuccess,
  onError,
  isDisabled,
}: PasskeyLoginProps) {
  const [isLoading, setIsLoading] = useState(false);

  // Set up conditional UI for passkey autofill (gated by config)
  useEffect(() => {
    if (!authConfig.passkey.enableConditionalUI) return;

    const setupConditionalUI = async () => {
      try {
        if (!window.PublicKeyCredential?.isConditionalMediationAvailable)
          return;

        const isAvailable =
          await window.PublicKeyCredential.isConditionalMediationAvailable();
        if (!isAvailable) return;

        // Enable autofill for passkeys on input fields with autocomplete="webauthn"
        const result = await auth.signIn.passkey({ autoFill: true });
        if (result.data) {
          onSuccess();
        }
      } catch {
        // Silently ignore errors from conditional UI (user hasn't explicitly requested auth)
      }
    };

    setupConditionalUI();
  }, [onSuccess]);

  const handlePasskeyLogin = async () => {
    // Check WebAuthn support before attempting
    if (!window.PublicKeyCredential) {
      onError(authConfig.errors.passkeyNotSupported);
      return;
    }

    setIsLoading(true);
    onError("");

    try {
      // Better Auth passkey client returns errors via result.error for HTTP/WebAuthn errors,
      // but network failures (offline, DNS) can still reject
      const result = await auth.signIn.passkey();

      if (result.data) {
        onSuccess();
      } else if (result.error) {
        // AUTH_CANCELLED: user dismissed prompt, timed out, or WebAuthn not supported
        // Server errors (e.g., no passkey found) have different codes
        const errorCode =
          "code" in result.error ? result.error.code : undefined;
        if (errorCode === "AUTH_CANCELLED") {
          onError("Passkey authentication was cancelled.");
        } else {
          onError(result.error.message || authConfig.errors.genericError);
        }
      }
    } catch {
      // Network-level failures (offline, DNS, connection refused)
      onError(authConfig.errors.networkError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="default"
      className="w-full"
      onClick={handlePasskeyLogin}
      disabled={isDisabled || isLoading}
    >
      <KeyRound className="mr-2 h-4 w-4" />
      Sign in with passkey
    </Button>
  );
}
