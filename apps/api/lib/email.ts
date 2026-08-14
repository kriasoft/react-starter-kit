import {
  EmailVerification,
  OTPEmail,
  PasswordReset,
  renderEmailToHtml,
  renderEmailToText,
} from "@repo/email";
import { Resend } from "resend";
import { z } from "zod";
import type { Env } from "./env";

export interface EmailOptions {
  to: string | string[];
  subject: string;
  /** Required so every email has a plain-text alternative. */
  text: string;
  html?: string;
  from?: string;
}

type EmailEnv = Pick<Env, "RESEND_API_KEY" | "RESEND_EMAIL_FROM">;

type TemplateEnv = EmailEnv & Pick<Env, "APP_NAME" | "APP_ORIGIN">;

/**
 * Send an email using the Resend client.
 *
 * @param env Environment variables containing Resend configuration
 * @param options Email configuration
 */
export async function sendEmail(env: EmailEnv, options: EmailOptions) {
  const emailSchema = z.email();

  // Validate all recipients before sending
  const recipients = Array.isArray(options.to) ? options.to : [options.to];
  for (const email of recipients) {
    const result = emailSchema.safeParse(email);
    if (!result.success) {
      throw new Error(`Invalid email address: ${email}`);
    }
  }

  if (!env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY environment variable is required");
  }

  if (!env.RESEND_EMAIL_FROM) {
    throw new Error("RESEND_EMAIL_FROM environment variable is required");
  }

  // A fresh client per send: the Workers runtime reuses an isolate across
  // requests, and a module-level client would outlive the env it was built from.
  const resend = new Resend(env.RESEND_API_KEY);

  try {
    const result = await resend.emails.send({
      from: options.from || env.RESEND_EMAIL_FROM,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });

    if (result.error) {
      throw new Error(
        `Resend API error: ${result.error.message || result.error.name || "Unknown error"}`,
      );
    }

    return result;
  } catch (error) {
    throw new Error(
      `Failed to send email: ${error instanceof Error ? error.message : "Unknown error"}`,
      { cause: error },
    );
  }
}

/**
 * Send email verification message.
 *
 * @param env Environment variables
 * @param options User and verification URL (should be time-limited, signed token)
 */
export async function sendVerificationEmail(
  env: TemplateEnv,
  options: {
    user: { email: string; name?: string };
    url: string;
  },
) {
  const component = EmailVerification({
    userName: options.user.name,
    verificationUrl: options.url,
    appName: env.APP_NAME,
    appUrl: env.APP_ORIGIN,
  });

  const html = await renderEmailToHtml(component);
  const text = await renderEmailToText(component);

  return sendEmail(env, {
    to: options.user.email,
    subject: "Verify your email address",
    html,
    text,
  });
}

/**
 * Send password reset email.
 *
 * @param env Environment variables
 * @param options User and reset URL (must be single-use token with short expiration)
 */
export async function sendPasswordReset(
  env: TemplateEnv,
  options: {
    user: { email: string; name?: string };
    url: string;
  },
) {
  const component = PasswordReset({
    userName: options.user.name,
    resetUrl: options.url,
    appName: env.APP_NAME,
    appUrl: env.APP_ORIGIN,
  });

  const html = await renderEmailToHtml(component);
  const text = await renderEmailToText(component);

  return sendEmail(env, {
    to: options.user.email,
    subject: "Reset your password",
    html,
    text,
  });
}

/**
 * Send OTP email for authentication.
 *
 * @param env Environment variables
 * @param options Email, OTP code (must be rate-limited, time-bound, single-use), and type
 */
export async function sendOTP(
  env: TemplateEnv & Pick<Env, "ENVIRONMENT">,
  options: {
    email: string;
    otp: string;
    type: "sign-in" | "email-verification" | "forget-password" | "change-email";
  },
) {
  if (env.ENVIRONMENT === "development") {
    console.log(`OTP code for ${options.email}: ${options.otp}`);
  }

  const component = OTPEmail({
    otp: options.otp,
    type: options.type,
    appName: env.APP_NAME,
    appUrl: env.APP_ORIGIN,
  });

  const html = await renderEmailToHtml(component);
  const text = await renderEmailToText(component);

  const typeLabels = {
    "sign-in": "Sign In",
    "email-verification": "Email Verification",
    "forget-password": "Password Reset",
    "change-email": "Email Change",
  };

  return sendEmail(env, {
    to: options.email,
    subject: `Your ${typeLabels[options.type]} code`,
    html,
    text,
  });
}
