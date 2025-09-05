import { EmailVerification } from "../templates/email-verification";

export default function EmailVerificationPreview() {
  return (
    <EmailVerification
      userName="John Doe"
      verificationUrl="https://example.com/verify?token=abc123"
      appName="React Starter Kit"
      appUrl="https://example.com"
    />
  );
}
