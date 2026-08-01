-- Sleep Diary v2.3 - Sync and Conflict Metadata Schema
-- Phase D: Cloud sync with idempotency and conflict resolution

-- Idempotency Keys - prevent duplicate sync operations
CREATE TABLE IF NOT EXISTS idempotency_keys (
  idempotency_key TEXT PRIMARY KEY,
  sync_id TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  expires_at TEXT NOT NULL,
  response_hash TEXT
);

CREATE INDEX IF NOT EXISTS idx_idempotency_keys_expires_at
  ON idempotency_keys(expires_at);

-- Sync Conflicts - track and resolve cross-device conflicts
CREATE TABLE IF NOT EXISTS sync_conflicts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  local_date TEXT,
  resolution_type TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  resolved_at TEXT,

  UNIQUE(user_id, entity_type, entity_id)
);

CREATE INDEX IF NOT EXISTS idx_sync_conflicts_user_id
  ON sync_conflicts(user_id);

CREATE INDEX IF NOT EXISTS idx_sync_conflicts_resolved_at
  ON sync_conflicts(resolved_at);

-- Sync Log - audit trail of sync operations
CREATE TABLE IF NOT EXISTS sync_log (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  sync_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'success',
  record_count INTEGER NOT NULL DEFAULT 0,
  conflict_count INTEGER NOT NULL DEFAULT 0,
  error TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_sync_log_user_id
  ON sync_log(user_id);

CREATE INDEX IF NOT EXISTS idx_sync_log_created_at
  ON sync_log(created_at);
