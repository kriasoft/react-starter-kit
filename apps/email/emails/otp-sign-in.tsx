import { OTPEmail } from "../templates/otp-email";

export default function OTPSignInPreview() {
  return (
    <OTPEmail
      otp="123456"
      type="sign-in"
      appName="React Starter Kit"
      appUrl="https://example.com"
    />
  );
}
