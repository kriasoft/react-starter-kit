import { Heading, Section, Text } from "@react-email/components";
import { BaseTemplate, colors } from "../components/BaseTemplate";

interface OTPEmailProps {
  otp: string;
  type: "sign-in" | "email-verification" | "forget-password";
  appName?: string;
  appUrl?: string;
  expiresInMinutes?: number;
}

export function OTPEmail({
  otp,
  type,
  appName,
  appUrl,
  expiresInMinutes = 5,
}: OTPEmailProps) {
  // [CONTENT_MAPPING] Maps type enum to user-facing labels and descriptions
  const typeLabels = {
    "sign-in": "Sign In",
    "email-verification": "Email Verification",
    "forget-password": "Password Reset",
  };

  const typeDescriptions = {
    "sign-in": "complete your sign in",
    "email-verification": "verify your email address",
    "forget-password": "reset your password",
  };

  const typeLabel = typeLabels[type];
  const typeDescription = typeDescriptions[type];
  const preview = `Your ${typeLabel} code: ${otp}`;

  return (
    <BaseTemplate preview={preview} appName={appName} appUrl={appUrl}>
      <Heading style={heading}>Your {typeLabel} Code</Heading>

      <Text style={paragraph}>
        Use the verification code below to {typeDescription}:
      </Text>

      <Section style={otpContainer}>
        <Text style={otpText}>{otp}</Text>
      </Section>

      <Text style={paragraph}>
        <strong>This code will expire in {expiresInMinutes} minutes</strong> for
        security reasons.
      </Text>

      <Text style={paragraph}>
        If you didn't request this code, you can safely ignore this email.
      </Text>

      {/* WARNING: Security notice shown only for password reset to emphasize risk */}
      {type === "forget-password" && (
        <Text style={securityNote}>
          <strong>Security tip:</strong> Never share this verification code with
          anyone. Our support team will never ask for your verification codes.
        </Text>
      )}
    </BaseTemplate>
  );
}

const heading = {
  fontSize: "24px",
  fontWeight: "600",
  color: colors.text,
  margin: "0 0 24px",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "24px",
  color: colors.textMuted,
  margin: "0 0 16px",
};

const otpContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
  padding: "24px",
  backgroundColor: "#f8f9fa",
  border: "2px solid #e9ecef",
  borderRadius: "8px",
};

const otpText = {
  fontSize: "36px",
  fontWeight: "bold",
  letterSpacing: "0.5em",
  color: colors.primary,
  fontFamily: "Monaco, Consolas, monospace",
  margin: "0",
  textAlign: "center" as const,
};

const securityNote = {
  fontSize: "14px",
  lineHeight: "20px",
  color: "#6c757d",
  margin: "24px 0 0",
  padding: "16px",
  backgroundColor: colors.warning,
  borderRadius: "4px",
  border: `1px solid ${colors.warningBorder}`,
};
