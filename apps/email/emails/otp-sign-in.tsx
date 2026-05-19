import { OTPEmail } from "../templates/otp-email";

export default function OTPSignInPreview() {
  return (
    <OTPEmail
      otp="123456"
      type="sign-in"
      appName="Clara"
      appUrl="https://example.com"
    />
  );
}
