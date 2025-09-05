import { PasswordReset } from "../templates/password-reset";

export default function PasswordResetPreview() {
  return (
    <PasswordReset
      userName="John Doe"
      resetUrl="https://example.com/reset?token=xyz789"
      appName="React Starter Kit"
      appUrl="https://example.com"
    />
  );
}
