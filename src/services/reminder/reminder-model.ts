import { createHash } from "node:crypto";

export type ReminderType =
  | "BEDTIME_REMINDER"
  | "WIND_DOWN_REMINDER"
  | "DIARY_REMINDER"
  | "CBTI_LESSON_REMINDER"
  | "SLEEP_CHECKIN";

export interface ReminderRecord {
  id: string;
  email: string;
  emailHash: string;
  enabled: boolean;
  reminderTime: string;
  timezone: string;
  language: string;
  reminderType: ReminderType;
  createdAt: string;
  updatedAt: string;
  lastSentAt: string | null;
}

export interface ReminderCreateInput {
  email: string;
  enabled: boolean;
  time: string;
  timezone?: string;
  language?: string;
  reminderType?: ReminderType;
}

export function normalizeReminderLanguage(value?: string): string {
  if (!value) return "en";
  const normalized = value.trim().toLowerCase();
  if (normalized === "pt" || normalized === "pt-br") return "pt-BR";
  if (normalized === "es") return "es";
  if (normalized === "zh" || normalized === "zh-cn") return "zh";
  return normalized;
}

export function buildReminderRecord(input: ReminderCreateInput): ReminderRecord {
  const email = input.email.trim().toLowerCase();
  const now = new Date().toISOString();
  return {
    id: `rem_${createHash("sha256").update(`${email}:${now}`).digest("hex").slice(0, 16)}`,
    email,
    emailHash: createHash("sha256").update(email).digest("hex"),
    enabled: input.enabled,
    reminderTime: input.time,
    timezone: input.timezone?.trim() || "UTC",
    language: normalizeReminderLanguage(input.language),
    reminderType: input.reminderType ?? "BEDTIME_REMINDER",
    createdAt: now,
    updatedAt: now,
    lastSentAt: null,
  };
}
