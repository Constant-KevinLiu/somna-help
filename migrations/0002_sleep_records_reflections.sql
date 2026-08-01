-- Sleep Diary v2.3 - Sleep Records and Reflections Schema
-- Phase C and D: Cloud persistence and migration

-- Sleep Records - validated sleep diary entries from each user
CREATE TABLE IF NOT EXISTS sleep_records (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  local_date TEXT NOT NULL,
  timezone TEXT NOT NULL,
  bedtime TEXT NOT NULL,
  wake_time TEXT NOT NULL,
  sleep_latency INTEGER NOT NULL,
  night_awakenings INTEGER NOT NULL,
  sleep_quality INTEGER NOT NULL,
  mood INTEGER NOT NULL,
  sleep_efficiency INTEGER NOT NULL,
  sleep_score INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),

  -- Ensure one record per user per date
  UNIQUE(user_id, local_date)
);

CREATE INDEX IF NOT EXISTS idx_sleep_records_user_id
  ON sleep_records(user_id);

CREATE INDEX IF NOT EXISTS idx_sleep_records_local_date
  ON sleep_records(local_date);

CREATE INDEX IF NOT EXISTS idx_sleep_records_updated_at
  ON sleep_records(updated_at);

-- Guided CBT-I Reflections - sensitive private journal content
CREATE TABLE IF NOT EXISTS reflections (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  local_date TEXT NOT NULL,
  timezone TEXT NOT NULL,
  locale TEXT NOT NULL,
  prompt_ids TEXT NOT NULL,
  prompt_categories TEXT NOT NULL,
  content TEXT NOT NULL,
  word_count INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  sync_status TEXT NOT NULL DEFAULT 'synced',

  -- Ensure one reflection per user per date
  UNIQUE(user_id, local_date)
);

CREATE INDEX IF NOT EXISTS idx_reflections_user_id
  ON reflections(user_id);

CREATE INDEX IF NOT EXISTS idx_reflections_local_date
  ON reflections(local_date);

CREATE INDEX IF NOT EXISTS idx_reflections_updated_at
  ON reflections(updated_at);

-- Sync Metadata - for conflict resolution and migration tracking
CREATE TABLE IF NOT EXISTS sync_metadata (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  entity_type TEXT NOT NULL,
  last_synced_at TEXT NOT NULL DEFAULT (datetime('now')),
  client_generation TEXT NOT NULL,

  UNIQUE(user_id, entity_type)
);

CREATE INDEX IF NOT EXISTS idx_sync_metadata_user_id
  ON sync_metadata(user_id);
