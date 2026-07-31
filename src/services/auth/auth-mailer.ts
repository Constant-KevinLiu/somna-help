/**
 * Sleep Diary v2.3 - Authentication Mailer
 * 
 * OTP verification emails for passwordless authentication.
 * All emails are natively authored for each locale - no runtime translation.
 */

import type { Locale } from "./auth-types";

// =============================================================================
// Native Email Templates
// =============================================================================

interface EmailTemplate {
  subject: string;
  html: (code: string) => string;
  text: (code: string) => string;
}

const emailTemplates: Record<Locale, EmailTemplate> = {
  "en": {
    subject: "Your Somna verification code",
    html: (code) => `
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
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this code, you can safely ignore this email.</p>
        <div class="footer">
          <p>Somna — your sleep health companion</p>
        </div>
      </body>
      </html>
    `,
    text: (code) => `
Verify your email

Use this verification code to sign in to Somna:

${code}

This code will expire in 10 minutes.

If you didn't request this code, you can safely ignore this email.

---
Somna — your sleep health companion
    `.trim(),
  },

  "es": {
    subject: "Tu código de verificación de Somna",
    html: (code) => `
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
        <p>Este código caducará en 10 minutos.</p>
        <p>Si no solicitaste este código, puedes ignorar este correo con seguridad.</p>
        <div class="footer">
          <p>Somna — tu compañero de salud del sueño</p>
        </div>
      </body>
      </html>
    `,
    text: (code) => `
Verifica tu correo

Usa este código de verificación para iniciar sesión en Somna:

${code}

Este código caducará en 10 minutos.

Si no solicitaste este código, puedes ignorar este correo con seguridad.

---
Somna — tu compañero de salud del sueño
    `.trim(),
  },

  "pt-BR": {
    subject: "Seu código de verificação do Somna",
    html: (code) => `
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
        <p>Este código expirará em 10 minutos.</p>
        <p>Se você não solicitou este código, pode ignorar este e-mail com segurança.</p>
        <div class="footer">
          <p>Somna — seu companheiro de saúde do sono</p>
        </div>
      </body>
      </html>
    `,
    text: (code) => `
Verifique seu e-mail

Use este código de verificação para entrar no Somna:

${code}

Este código expirará em 10 minutos.

Se você não solicitou este código, pode ignorar este e-mail com segurança.

---
Somna — seu companheiro de saúde do sono
    `.trim(),
  },

  "pl": {
    subject: "Twój kod weryfikacyjny Somna",
    html: (code) => `
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
        <p>Ten kod wygaśnie za 10 minut.</p>
        <p>Jeśli nie prosiłeś o ten kod, możesz bezpiecznie zignorować tę wiadomość.</p>
        <div class="footer">
          <p>Somna — Twój towarzysz zdrowia snu</p>
        </div>
      </body>
      </html>
    `,
    text: (code) => `
Zweryfikuj swój adres e-mail

Użyj tego kodu weryfikacyjnego, aby zalogować się do Somna:

${code}

Ten kod wygaśnie za 10 minut.

Jeśli nie prosiłeś o ten kod, możesz bezpiecznie zignorować tę wiadomość.

---
Somna — Twój towarzysz zdrowia snu
    `.trim(),
  },
};

// =============================================================================
// Mailer
// =============================================================================

interface SendOTPEmailOptions {
  to: string;
  code: string;
  locale: Locale;
  resendApiKey: string;
}

interface SendResult {
  success: boolean;
  error?: string;
}

export async function sendOTPEmail({
  to,
  code,
  locale,
  resendApiKey,
}: SendOTPEmailOptions): Promise<SendResult> {
  if (!resendApiKey) {
    return { success: false, error: "RESEND_API_KEY not configured" };
  }

  const template = emailTemplates[locale];
  if (!template) {
    return { success: false, error: `No email template for locale: ${locale}` };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Somna <no-reply@somna.help>",
        to,
        subject: template.subject,
        html: template.html(code),
        text: template.text(code),
      }),
    });

    if (!response.ok) {
      const error = await response.text().catch(() => "Unknown error");
      console.error("Resend API error:", response.status, error);
      return { success: false, error: `Email service error: ${response.status}` };
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to send OTP email:", error);
    return { success: false, error: "Failed to send email" };
  }
}
