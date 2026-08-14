import { auth } from "@/lib/auth";
import { authConfig } from "@/lib/auth-config";
import { Button } from "@repo/ui";
import { KeyRound } from "lucide-react";
import { useCallback, useState } from "react";

interface PasskeyLoginProps {
  onSuccess: () => void;
  onError: (error: string | null) => void;
  onLoadingChange?: (loading: boolean) => void;
  isDisabled?: boolean;
}

/**
 * Passkey sign-in component using WebAuthn.
 *
 * WebAuthn handles credential discovery - no email input needed.
 * The browser prompts the user to select from their available passkeys.
 *
 * Sign-in is explicit rather than autofill-driven. Conditional mediation needs
 * a mounted input whose `autocomplete` ends in `webauthn`, and this form shows
 * no input until the user has already chosen the email method.
 */
export function PasskeyLogin({
  onSuccess,
  onError,
  onLoadingChange,
  isDisabled,
}: PasskeyLoginProps) {
  const [isLoading, setIsLoading] = useState(false);

  const setLoading = useCallback(
    (loading: boolean) => {
      setIsLoading(loading);
      onLoadingChange?.(loading);
    },
    [onLoadingChange],
  );

  const handlePasskeyLogin = async () => {
    // Check WebAuthn support before attempting
    if (!window.PublicKeyCredential) {
      onError(authConfig.errors.passkeyNotSupported);
      return;
    }

    setLoading(true);
    onError(null);

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
      setLoading(false);
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
      Log in with passkey
    </Button>
  );
}
