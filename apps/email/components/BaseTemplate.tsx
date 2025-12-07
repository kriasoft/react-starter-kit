import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type { ReactNode } from "react";

interface BaseTemplateProps {
  preview: string;
  children: ReactNode;
  appName?: string;
  appUrl?: string;
}

// Color constants for consistent styling
const colors = {
  primary: "#007bff",
  danger: "#dc3545",
  text: "#32325d",
  textMuted: "#525f7f",
  textLight: "#8898aa",
  border: "#e6e8eb",
  background: "#f6f9fc",
  white: "#ffffff",
  warning: "#fff3cd",
  warningBorder: "#ffeaa7",
} as const;

export function BaseTemplate({
  preview,
  children,
  appName = "React Starter Kit",
  appUrl = "https://example.com",
}: BaseTemplateProps) {
  // Embedded SVG logo as data URI for better email compatibility
  const logoDataUri =
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIyMCIgZmlsbD0iIzAwN2JmZiIvPgogIDx0ZXh0IHg9IjIwIiB5PSIyNiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiIGZvbnQtZmFtaWx5PSItYXBwbGUtc3lzdGVtLEJsaW5rTWFjU3lzdGVtRm9udCwnU2Vnb2UgVUknLFJvYm90bywnSGVsdmV0aWNhIE5ldWUnLFVidW50dSxzYW5zLXNlcmlmIiBmb250LXNpemU9IjE4IiBmb250LXdlaWdodD0iNjAwIj5SPC90ZXh0Pgo8L3N2Zz4K";

  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Img
              src={logoDataUri}
              width="40"
              height="40"
              alt={appName}
              style={logo}
            />
            <Text style={headerText}>{appName}</Text>
          </Section>

          {/* Main Content */}
          <Section style={content}>{children}</Section>

          {/* Footer */}
          <Hr style={hr} />
          <Section style={footer}>
            <Text style={footerText}>
              This email was sent by {appName}. If you didn't expect this email,
              you can safely ignore it.
            </Text>
            {/* NOTE: Links assume standard /unsubscribe and /privacy routes exist */}
            {appUrl && (
              <Text style={footerText}>
                <Link href={`${appUrl}/unsubscribe`} style={footerLink}>
                  Unsubscribe
                </Link>{" "}
                |{" "}
                <Link href={`${appUrl}/privacy`} style={footerLink}>
                  Privacy Policy
                </Link>
              </Text>
            )}
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: colors.background,
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: colors.white,
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  maxWidth: "600px",
};

const header = {
  padding: "0 48px",
  textAlign: "center" as const,
  borderBottom: `1px solid ${colors.border}`,
  paddingBottom: "20px",
  marginBottom: "32px",
};

const logo = {
  margin: "0 auto 8px auto",
  display: "block",
};

const headerText = {
  fontSize: "24px",
  fontWeight: "600",
  color: colors.text,
  margin: "0",
  textAlign: "center" as const,
};

const content = {
  padding: "0 48px",
};

const hr = {
  borderColor: colors.border,
  margin: "20px 0",
};

const footer = {
  padding: "0 48px",
};

const footerText = {
  color: colors.textLight,
  fontSize: "12px",
  lineHeight: "16px",
  textAlign: "center" as const,
  margin: "0 0 8px 0",
};

const footerLink = {
  color: colors.primary,
  textDecoration: "underline",
};

export { colors };
