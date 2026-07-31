-- Sleep Diary v2.3 - Reminder Settings Schema
-- Phase E: Reminder integration

-- Reminder Settings - authenticated reminder preferences
CREATE TABLE IF NOT EXISTS reminder_settings (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  enabled INTEGER NOT NULL DEFAULT 0,
  morning_time TEXT NOT NULL DEFAULT '07:30',
  evening_time TEXT NOT NULL DEFAULT '22:00',
  weekly_day TEXT NOT NULL DEFAULT 'Sunday',
  reminder_time TEXT NOT NULL DEFAULT '22:00',
  timezone TEXT NOT NULL DEFAULT 'UTC',
  language TEXT NOT NULL DEFAULT 'en',
  reminder_type TEXT NOT NULL DEFAULT 'BEDTIME_REMINDER',
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  last_sent_at TEXT,
  
  UNIQUE(user_id),
  
  -- Indexes
  INDEX idx_reminder_settings_user_id (user_id),
  INDEX idx_reminder_settings_enabled (enabled)
);

-- Lesson Progress - authenticated CBT-I program progress
CREATE TABLE IF NOT EXISTS lesson_progress (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  lesson_id TEXT NOT NULL,
  completed_at TEXT NOT NULL DEFAULT (datetime('now')),
  locale TEXT NOT NULL DEFAULT 'en',
  
  UNIQUE(user_id, lesson_id),
  
  -- Indexes
  INDEX idx_lesson_progress_user_id (user_id)
);

-- User Preferences - general user settings
CREATE TABLE IF NOT EXISTS user_preferences (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  preference_key TEXT NOT NULL,
  preference_value TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  
  UNIQUE(user_id, preference_key),
  
  -- Indexes
  INDEX idx_user_preferences_user_id (user_id)
);
