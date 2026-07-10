import { appendReminderLog, getReminderSettingsServer, saveReminderSettingsServer } from "./reminder-storage-server";
import { sendReminderEmail } from "./reminder-mailer";

export async function runReminderCron(env: Record<string, unknown>) {
  const record = await getReminderSettingsServer(env);
  if (!record || !record.enabled) return { ok: true, skipped: true };

  const now = new Date();
  const [hours, minutes] = record.reminderTime.split(":").map(Number);
  const target = new Date(now);
  target.setHours(hours, minutes, 0, 0);

  if (Math.abs(now.getTime() - target.getTime()) > 15 * 60 * 1000) {
    return { ok: true, skipped: true, reason: "outside_window" };
  }

  const result = await sendReminderEmail(record);
  await appendReminderLog(env, record, result.status, result.provider, result.error);
  if (result.success) {
    const updated = {
      ...record,
      lastSentAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await saveReminderSettingsServer(env, {
      email: updated.email,
      enabled: updated.enabled,
      time: updated.reminderTime,
      timezone: updated.timezone,
      language: updated.language,
    });
  }
  return { ok: result.success, result };
}
