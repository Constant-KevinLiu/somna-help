/**
 * Habit Engine — Domain Models
 *
 * Follows Somna repository conventions.
 * All timestamps are ISO strings, timezone-aware.
 */

// ============================================
// Reminder Status
// ============================================
export type ReminderStatus =
  | "active"
  | "paused"
  | "archived";

// ============================================
// Delivery Channels
// ============================================
export type ReminderChannel =
  | "in_app"
  | "browser_notification";

// ============================================
// Reminder Schedule
// ============================================
export type ScheduleType =
  | "daily"
  | "weekdays";

export interface ReminderSchedule {
  type: ScheduleType;
  time: string;           // "HH:MM" in 24h format
  days?: number[];        // 0 = Sunday, 1 = Monday, ..., 6 = Saturday (for weekdays type)
  startDate?: string;     // YYYY-MM-DD
  endDate?: string;       // YYYY-MM-DD (optional)
}

// ============================================
// Reminder Occurrence Status
// ============================================
export type ReminderOccurrenceStatus =
  | "scheduled"
  | "due"
  | "delivered"
  | "completed"
  | "snoozed"
  | "dismissed"
  | "missed"
  | "cancelled"
  | "completed_by_related_action";

// ============================================
// Reminder Event Types
// ============================================
export type ReminderEventType =
  | "created"
  | "updated"
  | "scheduled"
  | "delivered"
  | "completed"
  | "snoozed"
  | "dismissed"
  | "missed"
  | "paused"
  | "resumed"
  | "archived"
  | "permission_granted"
  | "permission_denied";

// ============================================
// Habit State
// ============================================
export type HabitState =
  | "candidate"
  | "planned"
  | "active"
  | "maintained"
  | "paused"
  | "archived";

// ============================================
// Main Reminder Interface
// ============================================
export interface Reminder {
  id: string;
  ownerId: string;         // User ID or anonymous session ID
  habitId?: string;        // For future habit association
  title: string;
  message?: string;
  status: ReminderStatus;
  channels: ReminderChannel[];
  schedule: ReminderSchedule;
  timezone: string;        // IANA timezone
  snoozeOptionsMinutes: number[];
  createdAt: string;
  updatedAt: string;
  archivedAt?: string;
  relatedAction?: "diary_morning" | "diary_evening" | "wind_down" | "relaxation";
}

// ============================================
// Reminder Occurrence
// ============================================
export interface ReminderOccurrence {
  id: string;
  reminderId: string;
  scheduledAt: string;     // ISO timestamp (original scheduled time)
  dueAt: string;           // ISO timestamp (current due time, may differ after snooze)
  status: ReminderOccurrenceStatus;
  deliveredVia?: ReminderChannel;
  snoozeCount: number;
  timezone: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// Reminder Event (Append-Only)
// ============================================
export interface ReminderEvent {
  id: string;
  reminderId: string;
  occurrenceId?: string;
  type: ReminderEventType;
  timestamp: string;
  timezone: string;
  channel?: ReminderChannel;
  source: "user" | "system" | "browser" | "diary_integration";
  metadata?: Record<string, unknown>;
}

// ============================================
// Habit Progress
// ============================================
export interface HabitProgress {
  reminderId: string;
  completionCount: number;
  opportunityCount: number;
  consistencyRate: number;      // 0-100
  currentStreak: number;
  longestStreak: number;
  lastCompletedAt?: string;
  currentState: HabitState;
  calculatedAt: string;
}

// ============================================
// Notification Preferences
// ============================================
export interface NotificationPreferences {
  permission: NotificationPermission;
  lastRequestedAt?: string;
  userExplicitlyDenied: boolean;
  quietHoursStart?: string;     // "HH:MM"
  quietHoursEnd?: string;       // "HH:MM"
  showSensitiveContent: boolean;
}

// ============================================
// Delivery Result
// ============================================
export interface DeliveryResult {
  success: boolean;
  channel: ReminderChannel;
  error?: string;
  fallbackToInApp?: boolean;
}

// ============================================
// Default Values
// ============================================
export const DEFAULT_SNOOZE_OPTIONS: number[] = [5, 10, 15];

export const DEFAULT_REMINDER: Partial<Reminder> = {
  status: "active",
  channels: ["in_app"],
  snoozeOptionsMinutes: DEFAULT_SNOOZE_OPTIONS,
  timezone: "UTC",
};

export const DEFAULT_NOTIFICATION_PREFS: NotificationPreferences = {
  permission: "default",
  userExplicitlyDenied: false,
  showSensitiveContent: false,
};

// ============================================
// Reminder Presets for Sleep Diary Integration
// ============================================
export const REMINDER_PRESETS = {
  MORNING_DIARY: {
    title: "Morning Diary",
    message: "Time to log your sleep from last night.",
    relatedAction: "diary_morning" as const,
    schedule: { type: "daily" as const, time: "07:30" },
  },
  EVENING_DIARY: {
    title: "Evening Check-in",
    message: "Ready to prepare for restful sleep?",
    relatedAction: "diary_evening" as const,
    schedule: { type: "daily" as const, time: "22:00" },
  },
  WIND_DOWN: {
    title: "Wind Down Routine",
    message: "Start your pre-sleep routine now.",
    relatedAction: "wind_down" as const,
    schedule: { type: "daily" as const, time: "21:30" },
  },
  RELAXATION: {
    title: "Relaxation Practice",
    message: "Take a moment for breathing or meditation.",
    relatedAction: "relaxation" as const,
    schedule: { type: "daily" as const, time: "12:00" },
  },
} as const;
