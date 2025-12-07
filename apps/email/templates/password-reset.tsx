import { Button, Heading, Section, Text } from "@react-email/components";
import { BaseTemplate, colors } from "../components/BaseTemplate";

interface PasswordResetProps {
  userName?: string;
  resetUrl: string;
  appName?: string;
  appUrl?: string;
}

export function PasswordReset({
  userName,
  resetUrl,
  appName,
  appUrl,
}: PasswordResetProps) {
  const preview = `Reset your password for ${appName || "your account"}`;

  return (
    <BaseTemplate preview={preview} appName={appName} appUrl={appUrl}>
      <Heading style={heading}>Reset your password</Heading>

      <Text style={paragraph}>Hi{userName ? ` ${userName}` : ""},</Text>

      <Text style={paragraph}>
        We received a request to reset your password. Click the button below to
        choose a new password.
      </Text>

      <Section style={buttonContainer}>
        <Button href={resetUrl} style={button}>
          Reset Password
        </Button>
      </Section>

      <Text style={paragraph}>
        Or copy and paste this URL into your browser:
      </Text>

      <Text style={linkText}>{resetUrl}</Text>

      {/* NOTE: 1-hour expiration balances security vs user convenience */}
      <Text style={paragraph}>
        <strong>This password reset link will expire in 1 hour</strong> for
        security reasons.
      </Text>

      <Text style={paragraph}>
        If you didn't request a password reset, you can safely ignore this
        email. Your password will remain unchanged.
      </Text>

      <Text style={securityNote}>
        <strong>Security tip:</strong> Never share this reset link with anyone.
        Our support team will never ask for your password or login credentials.
      </Text>
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

const buttonContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
};

// Uses danger color (red) to emphasize the security-sensitive nature of password resets
const button = {
  backgroundColor: colors.danger,
  borderRadius: "6px",
  color: colors.white,
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 24px",
  lineHeight: "20px",
};

const linkText = {
  fontSize: "14px",
  color: colors.textLight,
  wordBreak: "break-all" as const,
  margin: "0 0 16px",
  padding: "12px",
  backgroundColor: "#f8f9fa",
  borderRadius: "4px",
  border: "1px solid #e9ecef",
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
