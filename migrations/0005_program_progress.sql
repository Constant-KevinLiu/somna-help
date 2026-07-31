-- Sleep Diary v2.5 - Program Progress Schema
-- Phase G-0.1: Program Foundation Runtime Integration
--
-- Stores canonical CBT-I program progress per user.
-- Designed to match the ProgramProgress type in src/lib/program/types.ts.
--
-- One row per user per program (currently one program: "cbti-core").
-- JSON arrays for lesson IDs / milestones (flexible, no join tables needed
-- for the Phase G feature set; normalize later if query patterns demand it).
--
-- Indexes on user_id and updated_at support the sync endpoint hot path:
--   sync: SELECT * FROM program_progress WHERE user_id = ?
--   sync: UPSERT program_progress ... WHERE user_id = ? AND program_id = ?
--   export: SELECT ... FROM program_progress WHERE user_id = ?
--   delete: DELETE FROM program_progress WHERE user_id = ?

CREATE TABLE IF NOT EXISTS program_progress (
  -- Primary key (entity ID for sync tracking)
  id TEXT PRIMARY KEY,

  -- User ownership
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Program identity
  program_id TEXT NOT NULL DEFAULT 'cbti-core',
  program_version INTEGER NOT NULL DEFAULT 1,
  schema_version INTEGER NOT NULL DEFAULT 1,

  -- Program lifecycle
  status TEXT NOT NULL DEFAULT 'not_started',
  started_at TEXT,
  completed_at TEXT,
  current_week_id TEXT,

  -- Progress data (JSON arrays — flexible, queryable via JSON operators)
  completed_lesson_ids TEXT NOT NULL DEFAULT '[]',
  skipped_lesson_ids TEXT NOT NULL DEFAULT '[]',
  accepted_plan_ids TEXT NOT NULL DEFAULT '[]',
  dismissed_recommendation_ids TEXT NOT NULL DEFAULT '[]',
  milestones TEXT NOT NULL DEFAULT '[]',

  -- Sync metadata
  updated_at TEXT NOT NULL,
  client_id TEXT,

  -- One progress record per user per program
  UNIQUE(user_id, program_id),

  -- Indexes
  INDEX idx_program_progress_user_id (user_id),
  INDEX idx_program_progress_updated_at (updated_at),
  INDEX idx_program_progress_status (status)
);
