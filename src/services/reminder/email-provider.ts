/**
 * Email Provider — Phase 1 stub.
 *
 * This implements the `ReminderProvider` interface but performs NO network
 * requests. It validates the email, prepares a payload, and resolves `send()`
 * immediately with `success: true`.
 *
 * Future phases will replace `send()` with a real call to:
 *   POST /api/reminders/email
 * (endpoint reserved, not yet implemented).
 */
import type { ReminderPayload, ReminderProvider, ReminderSettings } from "./reminder-types";
import { isValidEmail, normalizeEmail } from "./reminder-validation";

/** Validate email settings for the email channel. */
function validateEmailSettings(settings: ReminderSettings): {
  valid: boolean;
  error?: string;
} {
  const email = normalizeEmail(settings.email);
  if (!email) return { valid: false, error: "reminder.error.emailEmpty" };
  if (!isValidEmail(email)) return { valid: false, error: "reminder.error.emailInvalid" };
  return { valid: true };
}

export const emailProvider: ReminderProvider = {
  id: "email",
  labelKey: "reminder.channel.email",

  validate(settings: ReminderSettings) {
    return validateEmailSettings(settings);
  },

  prepare(payload: ReminderPayload): ReminderPayload {
    // Phase 1: pass through. Future: localize subject/body, inject sleep data.
    return { ...payload };
  },

  async send(_payload: ReminderPayload): Promise<{ success: boolean; error?: string }> {
    // Phase 1 stub — no network. Future: POST /api/reminders/email
    return { success: true };
  },
};
