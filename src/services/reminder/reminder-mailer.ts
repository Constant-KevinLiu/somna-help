import { createHash } from "node:crypto";
import type { ReminderRecord } from "./reminder-model";
import { getReminderTemplate } from "./reminder-templates";

export interface ReminderMailResult {
  success: boolean;
  status: "SUCCESS" | "FAILED" | "RETRY";
  provider: string;
  error?: string;
}

function hashEmail(email: string): string {
  return createHash("sha256").update(email).digest("hex");
}

export async function sendReminderEmail(record: ReminderRecord): Promise<ReminderMailResult> {
  const { subject, html } = getReminderTemplate(record.language);
  const to = record.email;
  const apiKey = process.env.RESEND_API_KEY?.trim();

  if (!apiKey) {
    return {
      success: false,
      status: "FAILED",
      provider: "resend",
      error: "invalid_api_key",
    };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Somna <no-reply@somna.help>",
        to: [to],
        subject,
        html,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      const errorCode =
        response.status === 401 || text.includes("API key is invalid")
          ? "invalid_api_key"
          : `email_provider_failed:${response.status}:${text}`;
      return {
        success: false,
        status: "FAILED",
        provider: "resend",
        error: errorCode,
      };
    }

    return {
      success: true,
      status: "SUCCESS",
      provider: "resend",
    };
  } catch (error) {
    return {
      success: false,
      status: "RETRY",
      provider: "resend",
      error: error instanceof Error ? error.message : "unknown_error",
    };
  }
}

export async function sendReminderTestEmail(email: string, language = "en") {
  const record: ReminderRecord = {
    id: "test",
    email,
    emailHash: hashEmail(email),
    enabled: true,
    reminderTime: "22:00",
    timezone: "UTC",
    language,
    reminderType: "BEDTIME_REMINDER",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastSentAt: null,
  };
  return sendReminderEmail(record);
}
