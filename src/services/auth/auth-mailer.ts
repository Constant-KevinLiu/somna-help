/**
 * Sleep Diary v2.3 - Authentication Mailer
 *
 * OTP verification emails for passwordless authentication.
 * Uses Cloudflare Email Sending native binding (env.EMAIL).
 * All emails are natively authored for each locale - no runtime translation.
 *
 * Privacy: never logs OTP codes, OTP hashes, or full email addresses.
 */

import type { Locale } from "./auth-types";
import type { SendEmail } from "@cloudflare/workers-types";

// =============================================================================
// Types
// =============================================================================

export type EmailSendErrorCode =
  | "AUTH_EMAIL_NOT_CONFIGURED"
  | "AUTH_EMAIL_REJECTED"
  | "AUTH_EMAIL_UNAVAILABLE"
  | "AUTH_EMAIL_RATE_LIMITED";

export interface SendOTPEmailResult {
  success: boolean;
  errorCode?: EmailSendErrorCode;
}

interface AuthMailerEnv {
  EMAIL?: SendEmail;
}

// =============================================================================
// Constants
// =============================================================================

const SENDER_EMAIL = "account@somna.help";
const SENDER_NAME = "Somna";

// =============================================================================
// Native Email Templates
// =============================================================================

interface EmailTemplate {
  subject: string;
  html: (code: string, expiryMinutes: number) => string;
  text: (code: string, expiryMinutes: number) => string;
}

const emailTemplates: Record<Locale, EmailTemplate> = {
  "en": {
    subject: "Your Somna verification code",
    html: (code, expiryMinutes) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .code { font-size: 32px; font-weight: bold; letter-spacing: 8px; text-align: center; padding: 20px; background: #f8f9fa; border-radius: 8px; margin: 20px 0; }
          .footer { font-size: 12px; color: #666; margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; }
        </style>
      </head>
      <body>
        <h2>Verify your email</h2>
        <p>Hello,</p>
        <p>Use this verification code to sign in to Somna:</p>
        <div class="code">${code}</div>
        <p>This code will expire in ${expiryMinutes} minutes.</p>
        <p>If you didn't request this code, you can safely ignore this email.</p>
        <div class="footer">
          <p>Somna — your sleep health companion</p>
        </div>
      </body>
      </html>
    `,
    text: (code, expiryMinutes) => `
Verify your email

Use this verification code to sign in to Somna:

${code}

This code will expire in ${expiryMinutes} minutes.

If you didn't request this code, you can safely ignore this email.

---
Somna — your sleep health companion
    `.trim(),
  },

  "es": {
    subject: "Tu código de verificación de Somna",
    html: (code, expiryMinutes) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .code { font-size: 32px; font-weight: bold; letter-spacing: 8px; text-align: center; padding: 20px; background: #f8f9fa; border-radius: 8px; margin: 20px 0; }
          .footer { font-size: 12px; color: #666; margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; }
        </style>
      </head>
      <body>
        <h2>Verifica tu correo</h2>
        <p>Hola,</p>
        <p>Usa este código de verificación para iniciar sesión en Somna:</p>
        <div class="code">${code}</div>
        <p>Este código caducará en ${expiryMinutes} minutos.</p>
        <p>Si no solicitaste este código, puedes ignorar este correo con seguridad.</p>
        <div class="footer">
          <p>Somna — tu compañero de salud del sueño</p>
        </div>
      </body>
      </html>
    `,
    text: (code, expiryMinutes) => `
Verifica tu correo

Usa este código de verificación para iniciar sesión en Somna:

${code}

Este código caducará en ${expiryMinutes} minutos.

Si no solicitaste este código, puedes ignorar este correo con seguridad.

---
Somna — tu compañero de salud del sueño
    `.trim(),
  },

  "pt-BR": {
    subject: "Seu código de verificação do Somna",
    html: (code, expiryMinutes) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .code { font-size: 32px; font-weight: bold; letter-spacing: 8px; text-align: center; padding: 20px; background: #f8f9fa; border-radius: 8px; margin: 20px 0; }
          .footer { font-size: 12px; color: #666; margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; }
        </style>
      </head>
      <body>
        <h2>Verifique seu e-mail</h2>
        <p>Olá,</p>
        <p>Use este código de verificação para entrar no Somna:</p>
        <div class="code">${code}</div>
        <p>Este código expirará em ${expiryMinutes} minutos.</p>
        <p>Se você não solicitou este código, pode ignorar este e-mail com segurança.</p>
        <div class="footer">
          <p>Somna — seu companheiro de saúde do sono</p>
        </div>
      </body>
      </html>
    `,
    text: (code, expiryMinutes) => `
Verifique seu e-mail

Use este código de verificação para entrar no Somna:

${code}

Este código expirará em ${expiryMinutes} minutos.

Se você não solicitou este código, pode ignorar este e-mail com segurança.

---
Somna — seu companheiro de saúde do sono
    `.trim(),
  },

  "pl": {
    subject: "Twój kod weryfikacyjny Somna",
    html: (code, expiryMinutes) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .code { font-size: 32px; font-weight: bold; letter-spacing: 8px; text-align: center; padding: 20px; background: #f8f9fa; border-radius: 8px; margin: 20px 0; }
          .footer { font-size: 12px; color: #666; margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; }
        </style>
      </head>
      <body>
        <h2>Zweryfikuj swój adres e-mail</h2>
        <p>Cześć,</p>
        <p>Użyj tego kodu weryfikacyjnego, aby zalogować się do Somna:</p>
        <div class="code">${code}</div>
        <p>Ten kod wygaśnie za ${expiryMinutes} minut.</p>
        <p>Jeśli nie prosiłeś o ten kod, możesz bezpiecznie zignorować tę wiadomość.</p>
        <div class="footer">
          <p>Somna — Twój towarzysz zdrowia snu</p>
        </div>
      </body>
      </html>
    `,
    text: (code, expiryMinutes) => `
Zweryfikuj swój adres e-mail

Użyj tego kodu weryfikacyjnego, aby zalogować się do Somna:

${code}

Ten kod wygaśnie za ${expiryMinutes} minut.

Jeśli nie prosiłeś o ten kod, możesz bezpiecznie zignorować tę wiadomość.

---
Somna — Twój towarzysz zdrowia snu
    `.trim(),
  },
};

// =============================================================================
// Privacy-safe logging
// =============================================================================

/**
 * Produce a redacted recipient identifier safe for logs.
 * Shows only first 2 chars of the local part and the domain.
 * e.g. "jo...@example.com"
 */
function redactRecipient(email: string): string {
  const atIndex = email.indexOf("@");
  if (atIndex <= 2) return "...@" + email.slice(atIndex + 1);
  return email.slice(0, 2) + "..." + email.slice(atIndex);
}

// =============================================================================
// Mailer — Cloudflare Email Sending native binding
// =============================================================================

export interface SendOTPEmailOptions {
  to: string;
  code: string;
  locale: Locale;
  expiryMinutes: number;
  requestId?: string;
}

/**
 * Send an OTP verification email via Cloudflare Email Sending binding.
 *
 * Returns { success: true } when the provider accepts the message.
 * Returns { success: false, errorCode } with a stable error code otherwise.
 *
 * Never throws. Never logs OTP codes or full email addresses.
 */
export async function sendOTPEmail(
  env: AuthMailerEnv,
  { to, code, locale, expiryMinutes, requestId }: SendOTPEmailOptions
): Promise<SendOTPEmailResult> {
  const provider = "cloudflare-email";
  const recipient = redactRecipient(to);

  // 1. Binding check
  if (!env.EMAIL || typeof env.EMAIL.send !== "function") {
    console.warn(
      JSON.stringify({
        stage: "email_send",
        provider,
        status: "not_configured",
        errorCode: "AUTH_EMAIL_NOT_CONFIGURED",
        requestId: requestId || "unknown",
        recipient,
      })
    );
    return { success: false, errorCode: "AUTH_EMAIL_NOT_CONFIGURED" };
  }

  // 2. Template resolution
  const template = emailTemplates[locale] || emailTemplates["en"];

  // 3. Send
  try {
    const result = await env.EMAIL.send({
      from: { name: SENDER_NAME, email: SENDER_EMAIL },
      to,
      subject: template.subject,
      text: template.text(code, expiryMinutes),
      html: template.html(code, expiryMinutes),
    });

    console.log(
      JSON.stringify({
        stage: "email_send",
        provider,
        status: "accepted",
        requestId: requestId || "unknown",
        recipient,
        hasMessageId: Boolean(result?.messageId),
      })
    );

    return { success: true };
  } catch (error: unknown) {
    // Classify the error without leaking provider internals
    const message = error instanceof Error ? error.message : String(error);
    let errorCode: EmailSendErrorCode = "AUTH_EMAIL_UNAVAILABLE";

    // Heuristic classification based on common Cloudflare Email Sending errors
    const lowerMsg = message.toLowerCase();
    if (
      lowerMsg.includes("rate limit") ||
      lowerMsg.includes("ratelimit") ||
      lowerMsg.includes("too many")
    ) {
      errorCode = "AUTH_EMAIL_RATE_LIMITED";
    } else if (
      lowerMsg.includes("rejected") ||
      lowerMsg.includes("invalid") ||
      lowerMsg.includes("not allowed") ||
      lowerMsg.includes("forbidden")
    ) {
      errorCode = "AUTH_EMAIL_REJECTED";
    } else if (
      lowerMsg.includes("not configured") ||
      lowerMsg.includes("not found") ||
      lowerMsg.includes("not bound")
    ) {
      errorCode = "AUTH_EMAIL_NOT_CONFIGURED";
    }

    console.warn(
      JSON.stringify({
        stage: "email_send",
        provider,
        status: "failed",
        errorCode,
        requestId: requestId || "unknown",
        recipient,
      })
    );

    return { success: false, errorCode };
  }
}
