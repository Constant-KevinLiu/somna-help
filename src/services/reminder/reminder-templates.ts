import { reminderEmailEn } from "@/emails/reminder-en";
import { reminderEmailEs } from "@/emails/reminder-es";
import { reminderEmailPt } from "@/emails/reminder-pt";

export function getReminderTemplate(language: string) {
  const normalized = language.toLowerCase();
  if (normalized.startsWith("es")) return reminderEmailEs;
  if (normalized.startsWith("pt")) return reminderEmailPt;
  return reminderEmailEn;
}
