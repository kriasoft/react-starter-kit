import { OTPEmail } from "../templates/otp-email";

export default function OTPVerificationPreview() {
  return (
    <OTPEmail
      otp="789012"
      type="email-verification"
      appName="Clara"
      appUrl="https://example.com"
    />
  );
}
