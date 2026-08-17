/**
 * Sleep Diary v2.3 - Runtime Environment Validation
 *
 * Safely narrows the raw Worker `env` argument to a typed `AuthEnv` and
 * validates that required bindings are present.
 *
 * Why this exists:
 *   In production, the Cloudflare Worker runtime calls fetch(request, env, ctx)
 *   with a populated env containing D1, R2, and SendEmail bindings.
 *   In Vite local dev (TanStack Start), the dev-server plugin calls fetch(req)
 *   with only one argument — env is undefined. This module provides a single
 *   typed acquisition path so auth handlers degrade gracefully with structured
 *   503 responses instead of throwing unhandled TypeErrors.
 *
 * Production bindings and names are unchanged — this is purely defensive.
 */

import type { D1Database, SendEmail } from "@cloudflare/workers-types";
import type { AuthEnv } from "./auth-types";

// =============================================================================
// Types
// =============================================================================

export interface RuntimeValidationResult {
  ok: true;
  env: AuthEnv;
}

export interface RuntimeValidationFailure {
  ok: false;
  code: string;
  detail: string;
}

// =============================================================================
// Helpers
// =============================================================================

/**
 * Return true when `value` looks like a D1Database binding.
 * Structural check — we don't import the type at runtime.
 */
function isD1Like(value: unknown): value is D1Database {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.prepare === "function";
}

/**
 * Return true when `value` looks like a SendEmail binding.
 */
function isEmailLike(value: unknown): value is SendEmail {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.send === "function";
}

// =============================================================================
// Public API
// =============================================================================

/**
 * Safely coerce the raw Worker `env` argument to a typed AuthEnv.
 *
 * Always returns a well-formed AuthEnv object — never undefined, never throws.
 * Missing bindings are left undefined so downstream callers can decide how to
 * handle the absence (graceful degradation vs. hard error).
 *
 * @param rawEnv - The second argument to the Worker fetch handler. May be
 *   undefined in Vite local development.
 */
export function resolveAuthEnv(rawEnv: unknown): AuthEnv {
  if (!rawEnv || typeof rawEnv !== "object") {
    return { DB: undefined, EMAIL: undefined };
  }

  const rec = rawEnv as Record<string, unknown>;

  const DB = isD1Like(rec.DB) ? (rec.DB as D1Database) : undefined;
  const EMAIL = isEmailLike(rec.EMAIL) ? (rec.EMAIL as SendEmail) : undefined;

  return { DB, EMAIL };
}

/**
 * Validate that the DB binding is available.
 * Returns ok:true with the env when available, or a failure descriptor otherwise.
 *
 * The failure descriptor contains a server-side detail message suitable for
 * logging. Client responses should use the stable `code` field only.
 */
export function requireDB(env: AuthEnv): RuntimeValidationResult | RuntimeValidationFailure {
  if (!env.DB) {
    return {
      ok: false,
      code: "AUTH_DB_UNAVAILABLE",
      detail:
        "D1 database binding (DB) is not available. In local dev, env is not " +
        "injected by the Vite dev-server plugin. Real D1 is only available in " +
        "the Cloudflare Worker runtime or via wrangler dev / @cloudflare/vite-plugin.",
    };
  }
  return { ok: true, env };
}

/**
 * Validate that the EMAIL binding is available.
 * Returns ok:true with the env when available, or a failure descriptor otherwise.
 */
export function requireEmail(env: AuthEnv): RuntimeValidationResult | RuntimeValidationFailure {
  if (!env.EMAIL) {
    return {
      ok: false,
      code: "AUTH_EMAIL_NOT_CONFIGURED",
      detail:
        "SendEmail binding (EMAIL) is not available. Cloudflare Email Sending " +
        "is only available in the deployed Worker runtime.",
    };
  }
  return { ok: true, env };
}
