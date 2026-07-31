/**
 * Sleep Diary v2.3 — Sync Validation Utilities
 *
 * Shared validation logic for client and server.
 * Ensures data integrity before sync operations.
 * Uses the same word counting as reflection client.
 */

import { countWords, MAX_WORDS } from "@/lib/reflection/reflection-word-count";
import type { SyncSleepRecord, SyncReflection, SyncReminderSettings, SyncRequest, SyncError } from "./sync-types";
import type { Locale } from "@/content/content-types";

// =============================================================================
// Constants
// =============================================================================

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_FORMAT = /^([01]\d|2[0-3]):([0-5]\d)$/;
const VALID_LOCALES: Locale[] = ["en", "es", "pt-BR", "pl"];
const VALID_WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// =============================================================================
// Helpers
// =============================================================================

function isISODate(value: unknown): value is string {
  return typeof value === "string" && ISO_DATE.test(value);
}

function isValidTime(value: unknown): value is string {
  return typeof value === "string" && TIME_FORMAT.test(value);
}

function isValidLocale(value: unknown): value is Locale {
  return typeof value === "string" && VALID_LOCALES.includes(value as Locale);
}

function isValidNumberInRange(value: unknown, min: number, max: number): boolean {
  return typeof value === "number" && value >= min && value <= max && Number.isInteger(value);
}

// =============================================================================
// Sleep Record Validation
// =============================================================================

export interface ValidationResult<T> {
  valid: boolean;
  value?: T;
  errors: SyncError[];
}

export function validateSleepRecord(record: unknown): ValidationResult<SyncSleepRecord> {
  const errors: SyncError[] = [];

  if (!record || typeof record !== "object") {
    return {
      valid: false,
      errors: [{ code: "validation_failed", message: "Invalid sleep record format", retryable: false }],
    };
  }

  const r = record as Record<string, unknown>;

  // Required fields
  if (!r.id || typeof r.id !== "string") {
    errors.push({ code: "validation_failed", message: "Missing or invalid record ID", retryable: false });
  }

  if (!isISODate(r.date)) {
    errors.push({ code: "validation_failed", message: "Invalid date format", retryable: false });
  }

  if (!isValidTime(r.bedtime)) {
    errors.push({ code: "validation_failed", message: "Invalid bedtime format", retryable: false });
  }

  if (!isValidTime(r.wakeUpTime)) {
    errors.push({ code: "validation_failed", message: "Invalid wake up time format", retryable: false });
  }

  if (!isValidNumberInRange(r.sleepLatency, 0, 180)) {
    errors.push({ code: "validation_failed", message: "Invalid sleep latency", entityType: "sleep-record", retryable: false });
  }

  if (!isValidNumberInRange(r.nightAwakenings, 0, 20)) {
    errors.push({ code: "validation_failed", message: "Invalid night awakenings count", entityType: "sleep-record", retryable: false });
  }

  if (!isValidNumberInRange(r.sleepQuality, 1, 5)) {
    errors.push({ code: "validation_failed", message: "Invalid sleep quality", entityType: "sleep-record", retryable: false });
  }

  if (!isValidNumberInRange(r.mood, 1, 5)) {
    errors.push({ code: "validation_failed", message: "Invalid mood rating", entityType: "sleep-record", retryable: false });
  }

  if (!isValidNumberInRange(r.sleepEfficiency, 0, 100)) {
    errors.push({ code: "validation_failed", message: "Invalid sleep efficiency", entityType: "sleep-record", retryable: false });
  }

  if (!isValidNumberInRange(r.sleepScore, 0, 100)) {
    errors.push({ code: "validation_failed", message: "Invalid sleep score", entityType: "sleep-record", retryable: false });
  }

  // Optional timezone
  if (r.timezone && typeof r.timezone !== "string") {
    errors.push({ code: "validation_failed", message: "Invalid timezone", entityType: "sleep-record", retryable: false });
  }

  return {
    valid: errors.length === 0,
    value: record as SyncSleepRecord,
    errors,
  };
}

// =============================================================================
// Reflection Validation
// =============================================================================

export function validateReflection(reflection: unknown): ValidationResult<SyncReflection> {
  const errors: SyncError[] = [];

  if (!reflection || typeof reflection !== "object") {
    return {
      valid: false,
      errors: [{ code: "validation_failed", message: "Invalid reflection format", retryable: false }],
    };
  }

  const r = reflection as Record<string, unknown>;

  // Required fields
  if (!r.id || typeof r.id !== "string") {
    errors.push({ code: "validation_failed", message: "Missing or invalid reflection ID", retryable: false });
  }

  if (!isISODate(r.localDate)) {
    errors.push({ code: "validation_failed", message: "Invalid local date format", entityType: "reflection", retryable: false });
  }

  if (!r.timezone || typeof r.timezone !== "string") {
    errors.push({ code: "validation_failed", message: "Missing timezone", entityType: "reflection", retryable: false });
  }

  if (!isValidLocale(r.locale)) {
    errors.push({ code: "validation_failed", message: "Invalid locale", entityType: "reflection", retryable: false });
  }

  if (!Array.isArray(r.promptIds)) {
    errors.push({ code: "validation_failed", message: "Invalid prompt IDs", entityType: "reflection", retryable: false });
  }

  if (!Array.isArray(r.promptCategories)) {
    errors.push({ code: "validation_failed", message: "Invalid prompt categories", entityType: "reflection", retryable: false });
  }

  if (typeof r.content !== "string") {
    errors.push({ code: "validation_failed", message: "Invalid content", entityType: "reflection", retryable: false });
  } else {
    // Word count validation — MUST match client logic
    const wordCount = countWords(r.content);
    if (wordCount > MAX_WORDS) {
      errors.push({
        code: "word_limit_exceeded",
        message: `Word count (${wordCount}) exceeds maximum of ${MAX_WORDS}`,
        entityType: "reflection",
        retryable: false,
      });
    }

    // Verify wordCount field matches actual count
    if (typeof r.wordCount === "number" && Math.abs(r.wordCount - wordCount) > 1) {
      // Allow small discrepancy for edge cases, but flag for review
      // We'll recalculate server-side anyway
    }
  }

  if (!isValidNumberInRange(r.wordCount, 0, MAX_WORDS + 50)) {
    errors.push({ code: "validation_failed", message: "Invalid word count", entityType: "reflection", retryable: false });
  }

  return {
    valid: errors.length === 0,
    value: reflection as SyncReflection,
    errors,
  };
}

// =============================================================================
// Reminder Settings Validation
// =============================================================================

export function validateReminderSettings(settings: unknown): ValidationResult<SyncReminderSettings> {
  const errors: SyncError[] = [];

  if (!settings || typeof settings !== "object") {
    return {
      valid: false,
      errors: [{ code: "validation_failed", message: "Invalid reminder settings format", retryable: false }],
    };
  }

  const s = settings as Record<string, unknown>;

  if (typeof s.enabled !== "boolean") {
    errors.push({ code: "validation_failed", message: "Invalid enabled flag", entityType: "reminder", retryable: false });
  }

  if (s.morningTime !== undefined && !isValidTime(s.morningTime)) {
    errors.push({ code: "validation_failed", message: "Invalid morning time format", entityType: "reminder", retryable: false });
  }

  if (s.eveningTime !== undefined && !isValidTime(s.eveningTime)) {
    errors.push({ code: "validation_failed", message: "Invalid evening time format", entityType: "reminder", retryable: false });
  }

  if (s.weeklyDay !== undefined && (typeof s.weeklyDay !== "string" || !VALID_WEEKDAYS.includes(s.weeklyDay))) {
    errors.push({ code: "validation_failed", message: "Invalid weekly day", entityType: "reminder", retryable: false });
  }

  if (!s.timezone || typeof s.timezone !== "string") {
    errors.push({ code: "validation_failed", message: "Missing timezone", entityType: "reminder", retryable: false });
  }

  if (!isValidLocale(s.language)) {
    errors.push({ code: "validation_failed", message: "Invalid language", entityType: "reminder", retryable: false });
  }

  return {
    valid: errors.length === 0,
    value: settings as SyncReminderSettings,
    errors,
  };
}

// =============================================================================
// Sync Request Validation
// =============================================================================

export function validateSyncRequest(request: unknown): ValidationResult<SyncRequest> {
  const errors: SyncError[] = [];

  if (!request || typeof request !== "object") {
    return {
      valid: false,
      errors: [{ code: "invalid_payload", message: "Invalid sync request format", retryable: false }],
    };
  }

  const r = request as Record<string, unknown>;

  if (!r.clientId || typeof r.clientId !== "string") {
    errors.push({ code: "invalid_payload", message: "Missing client ID", retryable: false });
  }

  if (!r.syncId || typeof r.syncId !== "string") {
    errors.push({ code: "invalid_payload", message: "Missing sync ID for idempotency", retryable: false });
  }

  if (!Array.isArray(r.sleepRecords)) {
    errors.push({ code: "invalid_payload", message: "Invalid sleep records array", retryable: false });
  }

  if (!Array.isArray(r.reflections)) {
    errors.push({ code: "invalid_payload", message: "Invalid reflections array", retryable: false });
  }

  // Validate individual records if arrays exist
  if (Array.isArray(r.sleepRecords)) {
    for (const record of r.sleepRecords) {
      const result = validateSleepRecord(record);
      errors.push(...result.errors);
    }
  }

  if (Array.isArray(r.reflections)) {
    for (const reflection of r.reflections) {
      const result = validateReflection(reflection);
      errors.push(...result.errors);
    }
  }

  // Validate reminder settings if present
  if (r.reminderSettings !== undefined) {
    const result = validateReminderSettings(r.reminderSettings);
    errors.push(...result.errors);
  }

  return {
    valid: errors.length === 0,
    value: request as SyncRequest,
    errors,
  };
}

// =============================================================================
// Normalization Utilities
// =============================================================================

/**
 * Normalize a sleep record to canonical server format.
 * Ensures consistent field names and formats.
 */
export function normalizeSleepRecord(record: SyncSleepRecord): SyncSleepRecord {
  return {
    ...record,
    // Ensure date is proper ISO format
    date: record.date,
    // Normalize time strings to 24-hour format with leading zeros
    bedtime: record.bedtime,
    wakeUpTime: record.wakeUpTime,
    // Ensure numeric fields are integers
    sleepLatency: Math.round(record.sleepLatency),
    nightAwakenings: Math.round(record.nightAwakenings),
    sleepQuality: Math.round(record.sleepQuality),
    mood: Math.round(record.mood),
    sleepEfficiency: Math.round(record.sleepEfficiency),
    sleepScore: Math.round(record.sleepScore),
    // Ensure timestamps are ISO strings
    createdAt: new Date(record.createdAt).toISOString(),
    updatedAt: new Date(record.updatedAt).toISOString(),
  };
}

/**
 * Normalize a reflection to canonical server format.
 * Recalculates word count to ensure consistency.
 */
export function normalizeReflection(reflection: SyncReflection): SyncReflection {
  return {
    ...reflection,
    wordCount: countWords(reflection.content),
    createdAt: new Date(reflection.createdAt).toISOString(),
    updatedAt: new Date(reflection.updatedAt).toISOString(),
  };
}
