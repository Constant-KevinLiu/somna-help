-- Sleep Diary v2.3 - Initial Authentication Schema
-- Phase B: Authentication foundation

-- Users table - minimal profile for passwordless auth
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email_normalized TEXT NOT NULL UNIQUE,
  email_hash TEXT NOT NULL UNIQUE,
  preferred_locale TEXT NOT NULL DEFAULT 'en',
  timezone TEXT NOT NULL DEFAULT 'UTC',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  last_login_at TEXT,
  deleted_at TEXT,
  
  -- Indexes
  INDEX idx_users_email_normalized (email_normalized),
  INDEX idx_users_email_hash (email_hash),
  INDEX idx_users_deleted_at (deleted_at)
);

-- Sessions table - secure HttpOnly cookie-based sessions
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  token_hash TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  expires_at TEXT NOT NULL,
  last_used_at TEXT NOT NULL DEFAULT (datetime('now')),
  revoked_at TEXT,
  
  -- Indexes
  INDEX idx_sessions_user_id (user_id),
  INDEX idx_sessions_token_hash (token_hash),
  INDEX idx_sessions_expires_at (expires_at),
  INDEX idx_sessions_revoked_at (revoked_at)
);

-- OTP Challenges - one-time password verification codes
CREATE TABLE IF NOT EXISTS otp_challenges (
  id TEXT PRIMARY KEY,
  email_normalized TEXT NOT NULL,
  code_hash TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  attempt_count INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  consumed_at TEXT,
  request_ip_hash TEXT NOT NULL,
  
  -- Indexes
  INDEX idx_otp_challenges_email_normalized (email_normalized),
  INDEX idx_otp_challenges_expires_at (expires_at),
  INDEX idx_otp_challenges_consumed_at (consumed_at)
);
