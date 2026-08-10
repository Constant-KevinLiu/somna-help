/**
 * Sleep Diary v2.3 - Authentication Database Operations
 *
 * D1 database queries for users, sessions, and OTP challenges.
 * Security: All queries use prepared statements to prevent SQL injection.
 */

import type { D1Database } from "@cloudflare/workers-types";
import type { User, Session, OTPChallenge } from "./auth-types";
import { generateUserId, generateId, hashSecret, getSessionExpiry } from "./auth-utils";

// =============================================================================
// Types
// =============================================================================

interface AuthEnv {
  DB?: D1Database;
}

// =============================================================================
// User Operations
// =============================================================================

export async function findUserByEmail(env: AuthEnv, emailNormalized: string): Promise<User | null> {
  const db = env.DB;
  if (!db) return null;

  const result = await db
    .prepare(
      `
      SELECT id, email_normalized, email_hash, preferred_locale, timezone, created_at, last_login_at, deleted_at
      FROM users
      WHERE email_normalized = ? AND deleted_at IS NULL
    `,
    )
    .bind(emailNormalized)
    .first();

  if (!result) return null;

  return {
    id: result.id as string,
    emailNormalized: result.email_normalized as string,
    emailHash: result.email_hash as string,
    preferredLocale: result.preferred_locale as "en" | "es" | "pt-BR" | "pl",
    timezone: result.timezone as string,
    createdAt: result.created_at as string,
    lastLoginAt: result.last_login_at as string | undefined,
    deletedAt: result.deleted_at as string | undefined,
  };
}

export async function findUserById(env: AuthEnv, userId: string): Promise<User | null> {
  const db = env.DB;
  if (!db) return null;

  const result = await db
    .prepare(
      `
      SELECT id, email_normalized, email_hash, preferred_locale, timezone, created_at, last_login_at, deleted_at
      FROM users
      WHERE id = ? AND deleted_at IS NULL
    `,
    )
    .bind(userId)
    .first();

  if (!result) return null;

  return {
    id: result.id as string,
    emailNormalized: result.email_normalized as string,
    emailHash: result.email_hash as string,
    preferredLocale: result.preferred_locale as "en" | "es" | "pt-BR" | "pl",
    timezone: result.timezone as string,
    createdAt: result.created_at as string,
    lastLoginAt: result.last_login_at as string | undefined,
    deletedAt: result.deleted_at as string | undefined,
  };
}

export async function createUser(
  env: AuthEnv,
  emailNormalized: string,
  emailHash: string,
  locale: string = "en",
  timezone: string = "UTC",
): Promise<User> {
  const db = env.DB;
  if (!db) throw new Error("Database not available");

  const userId = generateUserId();
  const now = new Date().toISOString();

  await db
    .prepare(
      `
      INSERT INTO users (id, email_normalized, email_hash, preferred_locale, timezone, created_at, last_login_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    )
    .bind(userId, emailNormalized, emailHash, locale, timezone, now, now)
    .run();

  return {
    id: userId,
    emailNormalized,
    emailHash,
    preferredLocale: locale as "en" | "es" | "pt-BR" | "pl",
    timezone,
    createdAt: now,
    lastLoginAt: now,
  };
}

export async function updateUserLastLogin(env: AuthEnv, userId: string): Promise<void> {
  const db = env.DB;
  if (!db) return;

  await db
    .prepare(
      `
      UPDATE users
      SET last_login_at = datetime('now')
      WHERE id = ?
    `,
    )
    .bind(userId)
    .run();
}

// =============================================================================
// Session Operations
// =============================================================================

export async function createSession(env: AuthEnv, userId: string, token: string): Promise<Session> {
  const db = env.DB;
  if (!db) throw new Error("Database not available");

  const sessionId = generateId("sess");
  const tokenHash = hashSecret(token);
  const now = new Date().toISOString();
  const expiresAt = getSessionExpiry().toISOString();

  await db
    .prepare(
      `
      INSERT INTO sessions (id, user_id, token_hash, created_at, expires_at, last_used_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `,
    )
    .bind(sessionId, userId, tokenHash, now, expiresAt, now)
    .run();

  return {
    id: sessionId,
    userId,
    tokenHash,
    createdAt: now,
    expiresAt,
    lastUsedAt: now,
  };
}

export async function findSessionByTokenHash(
  env: AuthEnv,
  tokenHash: string,
): Promise<Session | null> {
  const db = env.DB;
  if (!db) return null;

  const result = await db
    .prepare(
      `
      SELECT id, user_id, token_hash, created_at, expires_at, last_used_at, revoked_at
      FROM sessions
      WHERE token_hash = ? AND revoked_at IS NULL
    `,
    )
    .bind(tokenHash)
    .first();

  if (!result) return null;

  return {
    id: result.id as string,
    userId: result.user_id as string,
    tokenHash: result.token_hash as string,
    createdAt: result.created_at as string,
    expiresAt: result.expires_at as string,
    lastUsedAt: result.last_used_at as string,
    revokedAt: result.revoked_at as string | undefined,
  };
}

export async function updateSessionLastUsed(env: AuthEnv, sessionId: string): Promise<void> {
  const db = env.DB;
  if (!db) return;

  await db
    .prepare(
      `
      UPDATE sessions
      SET last_used_at = datetime('now')
      WHERE id = ?
    `,
    )
    .bind(sessionId)
    .run();
}

export async function revokeSession(env: AuthEnv, sessionId: string): Promise<boolean> {
  const db = env.DB;
  if (!db) return false;

  const result = await db
    .prepare(
      `
      UPDATE sessions
      SET revoked_at = datetime('now')
      WHERE id = ?
    `,
    )
    .bind(sessionId)
    .run();

  return result.meta.changes > 0;
}

export async function revokeAllUserSessions(env: AuthEnv, userId: string): Promise<void> {
  const db = env.DB;
  if (!db) return;

  await db
    .prepare(
      `
      UPDATE sessions
      SET revoked_at = datetime('now')
      WHERE user_id = ? AND revoked_at IS NULL
    `,
    )
    .bind(userId)
    .run();
}

export async function revokeAllSessions(env: AuthEnv, userId: string): Promise<number> {
  const db = env.DB;
  if (!db) return 0;

  const result = await db
    .prepare(
      `
      UPDATE sessions
      SET revoked_at = datetime('now')
      WHERE user_id = ? AND revoked_at IS NULL
    `,
    )
    .bind(userId)
    .run();

  return result.meta.changes;
}

// =============================================================================
// OTP Challenge Operations
// =============================================================================

export async function createOTPChallenge(
  env: AuthEnv,
  emailNormalized: string,
  codeHash: string,
  requestIpHash: string,
  expiresAt: Date,
): Promise<OTPChallenge> {
  const db = env.DB;
  if (!db) throw new Error("Database not available");

  const challengeId = generateId("otp");
  const now = new Date().toISOString();

  await db
    .prepare(
      `
      INSERT INTO otp_challenges (id, email_normalized, code_hash, expires_at, attempt_count, created_at, request_ip_hash)
      VALUES (?, ?, ?, ?, 0, ?, ?)
    `,
    )
    .bind(challengeId, emailNormalized, codeHash, expiresAt.toISOString(), now, requestIpHash)
    .run();

  return {
    id: challengeId,
    emailNormalized,
    codeHash,
    expiresAt: expiresAt.toISOString(),
    attemptCount: 0,
    createdAt: now,
    requestIpHash,
  };
}

export async function findLatestOTPChallenge(
  env: AuthEnv,
  emailNormalized: string,
): Promise<OTPChallenge | null> {
  const db = env.DB;
  if (!db) return null;

  const result = await db
    .prepare(
      `
      SELECT id, email_normalized, code_hash, expires_at, attempt_count, created_at, consumed_at, request_ip_hash
      FROM otp_challenges
      WHERE email_normalized = ? AND consumed_at IS NULL
      ORDER BY created_at DESC
      LIMIT 1
    `,
    )
    .bind(emailNormalized)
    .first();

  if (!result) return null;

  return {
    id: result.id as string,
    emailNormalized: result.email_normalized as string,
    codeHash: result.code_hash as string,
    expiresAt: result.expires_at as string,
    attemptCount: result.attempt_count as number,
    createdAt: result.created_at as string,
    consumedAt: result.consumed_at as string | undefined,
    requestIpHash: result.request_ip_hash as string,
  };
}

export async function incrementOTPAttempts(env: AuthEnv, challengeId: string): Promise<void> {
  const db = env.DB;
  if (!db) return;

  await db
    .prepare(
      `
      UPDATE otp_challenges
      SET attempt_count = attempt_count + 1
      WHERE id = ?
    `,
    )
    .bind(challengeId)
    .run();
}

export async function markOTPConsumed(env: AuthEnv, challengeId: string): Promise<void> {
  const db = env.DB;
  if (!db) return;

  await db
    .prepare(
      `
      UPDATE otp_challenges
      SET consumed_at = datetime('now')
      WHERE id = ?
    `,
    )
    .bind(challengeId)
    .run();
}

export async function countRecentOTPRequests(
  env: AuthEnv,
  emailNormalized: string,
  since: Date,
): Promise<number> {
  const db = env.DB;
  if (!db) return 0;

  const result = await db
    .prepare(
      `
      SELECT COUNT(*) as count
      FROM otp_challenges
      WHERE email_normalized = ? AND created_at >= ?
    `,
    )
    .bind(emailNormalized, since.toISOString())
    .first();

  return (result?.count as number) || 0;
}

export async function deleteOTPChallenge(
  env: AuthEnv,
  challengeId: string | null,
): Promise<boolean> {
  if (!challengeId) return false;
  const db = env.DB;
  if (!db) return false;

  const result = await db
    .prepare(
      `
      DELETE FROM otp_challenges
      WHERE id = ?
    `,
    )
    .bind(challengeId)
    .run();

  return result.meta.changes > 0;
}
