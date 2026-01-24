import { invalidateSession, sessionQueryOptions } from "@/lib/queries/session";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@repo/ui";
import { useState } from "react";
import { AuthForm } from "./auth-form";

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Login dialog component for modal authentication.
 * Use with useLoginDialog hook for programmatic control.
 */
export function LoginDialog({ open, onOpenChange }: LoginDialogProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  async function handleSuccess() {
    await queryClient.fetchQuery(sessionQueryOptions());
    await invalidateSession(queryClient);
    await router.invalidate();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="sr-only">
          <DialogTitle>Sign in to your account</DialogTitle>
          <DialogDescription>
            Choose your preferred sign in method
          </DialogDescription>
        </DialogHeader>
        <AuthForm mode="login" onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}

/**
 * Hook for programmatically controlling the login dialog.
 *
 * @example
 * ```tsx
 * function App() {
 *   const loginDialog = useLoginDialog();
 *
 *   return (
 *     <>
 *       <button onClick={loginDialog.open}>Sign In</button>
 *       <LoginDialog {...loginDialog.props} />
 *     </>
 *   );
 * }
 * ```
 */
export function useLoginDialog() {
  const [isOpen, setIsOpen] = useState(false);

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    props: {
      open: isOpen,
      onOpenChange: setIsOpen,
    },
  };
}
