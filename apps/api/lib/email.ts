/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

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

/**
 * Email options for sending emails via Resend API.
 * HTML content is required; text fallback is auto-generated if not provided.
 */
export interface EmailOptions {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  from?: string;
}

/**
 * Create a Resend client instance with the provided API key.
 *
 * @param apiKey Resend API key
 * @returns Resend client instance
 * @throws Error if API key is not provided
 */
export function createResendClient(apiKey: string): Resend {
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is required");
  }
  return new Resend(apiKey);
}

/**
 * Send an email using the Resend client.
 * Validates recipients and uses configured FROM address.
 *
 * [VALIDATION] Validates all recipient emails before attempting send.
 * [FALLBACK] Auto-strips HTML tags for text version if not provided.
 *
 * @param env Environment variables containing Resend configuration
 * @param options Email configuration
 * @returns Promise resolving to Resend response
 * @throws Error if email validation fails or sending fails
 */
export async function sendEmail(
  env: Pick<Env, "RESEND_API_KEY" | "RESEND_EMAIL_FROM">,
  options: EmailOptions,
) {
  // Email validation schema using Zod (only validates format, not deliverability)
  const emailSchema = z.email();

  // [VALIDATION] Pre-validate all recipients to fail fast before API call
  const recipients = Array.isArray(options.to) ? options.to : [options.to];
  for (const email of recipients) {
    const result = emailSchema.safeParse(email);
    if (!result.success) {
      throw new Error(`Invalid email address: ${email}`);
    }
  }

  // [CONFIG] FROM address must be configured for compliance and deliverability
  if (!env.RESEND_EMAIL_FROM) {
    throw new Error("RESEND_EMAIL_FROM environment variable is required");
  }

  const resend = createResendClient(env.RESEND_API_KEY);

  try {
    const result = await resend.emails.send({
      ...options,
      from: options.from || env.RESEND_EMAIL_FROM,
      text: options.text || options.html?.replace(/<[^>]*>/g, "") || "", // NOTE: Basic HTML stripping; consider html-to-text for complex content
    });

    // Check if Resend returned an error in the response
    if (result.error) {
      throw new Error(
        `Resend API error: ${result.error.message || result.error.name || "Unknown error"}`,
      );
    }

    return result;
  } catch (error) {
    throw new Error(
      `Failed to send email: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * Send email verification message.
 *
 * [SECURITY] URL should contain time-limited, signed token.
 * [PERFORMANCE] Component rendering deferred until send to minimize cold start impact.
 *
 * @example
 * ```typescript
 * import { sendVerificationEmail } from "./lib/email";
 * await sendVerificationEmail(env, { user, url });
 * ```
 */
export async function sendVerificationEmail(
  env: Pick<
    Env,
    "RESEND_API_KEY" | "RESEND_EMAIL_FROM" | "APP_NAME" | "APP_ORIGIN"
  >,
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
 * [SECURITY] URL must contain single-use token with short expiration.
 *
 * @example
 * ```typescript
 * import { sendPasswordReset } from "./lib/email";
 * await sendPasswordReset(env, { user, url });
 * ```
 */
export async function sendPasswordReset(
  env: Pick<
    Env,
    "RESEND_API_KEY" | "RESEND_EMAIL_FROM" | "APP_NAME" | "APP_ORIGIN"
  >,
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
 * [SECURITY] OTP should be rate-limited, time-bound (5-10 min), and single-use.
 * [UX] Subject line varies by type to help users identify purpose.
 *
 * @example
 * ```typescript
 * import { sendOTP } from "./lib/email";
 * await sendOTP(env, { email, otp, type: "sign-in" });
 * ```
 */
export async function sendOTP(
  env: Pick<
    Env,
    "RESEND_API_KEY" | "RESEND_EMAIL_FROM" | "APP_NAME" | "APP_ORIGIN"
  >,
  options: {
    email: string;
    otp: string;
    type: "sign-in" | "email-verification" | "forget-password";
  },
) {
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
  };

  return sendEmail(env, {
    to: options.email,
    subject: `Your ${typeLabels[options.type]} code`,
    html,
    text,
  });
}
