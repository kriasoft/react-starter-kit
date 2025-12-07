import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui";
import * as React from "react";
import { LoginForm } from "./login-form";

/**
 * LoginDialog component - Renders login form in a dialog.
 * Self-contained with trigger button. For programmatic control, use useLoginDialog hook.
 *
 * NOTE: This component doesn't handle post-auth navigation since it's typically used
 * in contexts where the user should stay on the current page after signing in.
 */
export function LoginDialog() {
  const [open, setOpen] = React.useState(false);

  const handleSuccess = () => {
    // Close modal on success - navigation not needed as user typically wants
    // to continue on the same page that triggered the login requirement.
    // React Query will automatically refetch protected data after auth state changes.
    setOpen(false);
    // TODO: Consider invalidating specific queries if immediate data refresh needed:
    // queryClient.invalidateQueries({ queryKey: ["protected-data"] })
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Sign In</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="sr-only">
          <DialogTitle>Sign in to your account</DialogTitle>
          <DialogDescription>
            Choose your preferred sign in method
          </DialogDescription>
        </DialogHeader>
        <LoginForm
          variant="modal"
          onSuccess={handleSuccess}
          showTerms={true} // Override default (false for modals) to show terms
        />
      </DialogContent>
    </Dialog>
  );
}

/**
 * Hook for programmatically controlling a login dialog.
 * Returns dialog component and control functions.
 *
 * USAGE: Place LoginDialog component at app root, then call openLoginDialog()
 * from any component that detects auth is required (e.g., after 401 response).
 *
 * WARNING: Only one instance should be mounted to avoid conflicts.
 */
export function useLoginDialog() {
  const [open, setOpen] = React.useState(false);

  const LoginDialog = React.useCallback(() => {
    const handleSuccess = () => {
      setOpen(false);
      // Post-auth behavior handled by React Query's automatic refetching
      // and the auth error boundary's session invalidation
    };

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="sr-only">
            <DialogTitle>Sign in to your account</DialogTitle>
            <DialogDescription>
              Choose your preferred sign in method
            </DialogDescription>
          </DialogHeader>
          <LoginForm
            variant="modal"
            onSuccess={handleSuccess}
            // showTerms defaults to false for modals per LoginForm implementation
          />
        </DialogContent>
      </Dialog>
    );
  }, [open]);

  return {
    LoginDialog,
    openLoginDialog: () => setOpen(true),
    closeLoginDialog: () => setOpen(false),
    isOpen: open,
  };
}
