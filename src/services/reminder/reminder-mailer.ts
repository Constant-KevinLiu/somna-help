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

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY ?? ""}`,
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
      return {
        success: false,
        status: "FAILED",
        provider: "resend",
        error: `email_provider_failed:${response.status}:${text}`,
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
