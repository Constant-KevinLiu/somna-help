/**
 * Sleep Diary v2.3 - Authentication API Handlers
 * 
 * Progressive Authentication endpoints for passwordless OTP login.
 * Security: Rate limiting, generic error messages, no email enumeration.
 */

import type { D1Database } from "@cloudflare/workers-types";
import {
  createUser,
  findUserByEmail,
  updateUserLastLogin,
  createSession,
  findSessionByTokenHash,
  updateSessionLastUsed,
  revokeSession,
  createOTPChallenge,
  findLatestOTPChallenge,
  incrementOTPAttempts,
  markOTPConsumed,
  countRecentOTPRequests,
} from "./auth-db";
import {
  normalizeEmail,
  hashEmail,
  hashSecret,
  hashIp,
  generateOTP,
  generateSessionToken,
  getOTPExpiry,
  isValidEmail,
  isValidOTPCode,
  isExpired,
} from "./auth-utils";
import { sendOTPEmail } from "./auth-mailer";
import type { Locale, AuthIntent, SessionState } from "./auth-types";
import { AUTH_COOKIE_NAME, COOKIE_OPTIONS, OTP_CONFIG } from "./auth-types";

// =============================================================================
// Types
// =============================================================================

interface AuthEnv {
  DB?: D1Database;
  RESEND_API_KEY?: string;
}

type RequestContext = {
  request: Request;
  env: AuthEnv;
  ctx: unknown;
};

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

// =============================================================================
// Request Helpers
// =============================================================================

function getClientIp(request: Request): string {
  return (
    request.headers.get("CF-Connecting-IP") ||
    request.headers.get("X-Forwarded-For") ||
    request.headers.get("X-Real-IP") ||
    "unknown"
  );
}

function getLocaleFromRequest(request: Request): Locale {
  const acceptLanguage = request.headers.get("Accept-Language") || "";
  const cookie = request.headers.get("cookie") || "";
  
  // Check cookie first
  const langMatch = /somna-language=([^;]+)/.exec(cookie);
  if (langMatch) {
    const locale = langMatch[1] as Locale;
    if (["en", "es", "pt-BR", "pl"].includes(locale)) {
      return locale;
    }
  }

  // Check Accept-Language header
  const preferred = acceptLanguage.split(",")[0]?.toLowerCase();
  if (preferred?.startsWith("es")) return "es";
  if (preferred?.startsWith("pt")) return "pt-BR";
  if (preferred?.startsWith("pl")) return "pl";
  
  return "en";
}

function getSessionCookie(request: Request): string | null {
  const cookie = request.headers.get("cookie") || "";
  const match = new RegExp(`${AUTH_COOKIE_NAME}=([^;]+)`).exec(cookie);
  return match?.[1] ?? null;
}

function setSessionCookie(response: Response, token: string): void {
  const cookie = `${AUTH_COOKIE_NAME}=${token}; HttpOnly; ${
    COOKIE_OPTIONS.secure ? "Secure; " : ""
  }SameSite=${COOKIE_OPTIONS.sameSite}; Path=${COOKIE_OPTIONS.path}; Max-Age=${COOKIE_OPTIONS.maxAge}`;
  response.headers.append("Set-Cookie", cookie);
}

function clearSessionCookie(response: Response): void {
  const cookie = `${AUTH_COOKIE_NAME}=; HttpOnly; SameSite=${COOKIE_OPTIONS.sameSite}; Path=${COOKIE_OPTIONS.path}; Max-Age=0`;
  response.headers.append("Set-Cookie", cookie);
}

// =============================================================================
// POST /api/auth/request-code
// =============================================================================

export async function handleRequestCode({ request, env }: RequestContext): Promise<Response> {
  if (request.method !== "POST") {
    return json(405, { success: false, error: "method_not_allowed" });
  }

  let payload: { email?: string; intent?: AuthIntent; locale?: string };
  try {
    payload = (await request.json()) as { email?: string; intent?: AuthIntent; locale?: string };
  } catch {
    return json(400, { success: false, error: "invalid_json" });
  }

  const { email, intent = "general" } = payload;
  
  // Validate email format
  if (!email || !isValidEmail(email)) {
    return json(400, { success: false, error: "invalid_email" });
  }

  const emailNormalized = normalizeEmail(email);
  const locale = (payload.locale as Locale) || getLocaleFromRequest(request);
  const ipHash = hashIp(getClientIp(request));

  // Rate limiting: Max 10 requests per email per day
  const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const recentRequests = await countRecentOTPRequests(env, emailNormalized, dayAgo);
  if (recentRequests >= OTP_CONFIG.MAX_DAILY_REQUESTS) {
    return json(429, { success: false, error: "rate_limited" });
  }

  // Check if there's a recent unexpired challenge
  const existingChallenge = await findLatestOTPChallenge(env, emailNormalized);
  if (existingChallenge) {
    const createdAt = new Date(existingChallenge.createdAt);
    const cooldownEnd = new Date(createdAt.getTime() + OTP_CONFIG.MIN_REQUEST_INTERVAL_SECONDS * 1000);
    if (cooldownEnd > new Date()) {
      const waitSeconds = Math.ceil((cooldownEnd.getTime() - Date.now()) / 1000);
      return json(429, {
        success: false,
        error: "cooldown",
        waitSeconds,
      });
    }
  }

  // Generate OTP
  const code = generateOTP();
  const codeHash = hashSecret(code);
  const expiresAt = getOTPExpiry();

  // Store challenge
  try {
    await createOTPChallenge(env, emailNormalized, codeHash, ipHash, expiresAt);
  } catch (error) {
    console.error("Failed to create OTP challenge:", error);
    // Don't leak database errors to client
    return json(500, { success: false, error: "server_error" });
  }

  // Send email
  const resendApiKey = env.RESEND_API_KEY || process.env.RESEND_API_KEY || "";
  const emailResult = await sendOTPEmail({
    to: email,
    code,
    locale,
    resendApiKey,
  });

  if (!emailResult.success) {
    console.error("Failed to send OTP email:", emailResult.error);
    // Still return success to avoid email enumeration
    return json(200, { success: true });
  }

  return json(200, { success: true });
}

// =============================================================================
// POST /api/auth/verify-code
// =============================================================================

export async function handleVerifyCode({ request, env }: RequestContext): Promise<Response> {
  if (request.method !== "POST") {
    return json(405, { success: false, error: "method_not_allowed" });
  }

  let payload: { email?: string; code?: string; intent?: AuthIntent };
  try {
    payload = (await request.json()) as { email?: string; code?: string; intent?: AuthIntent };
  } catch {
    return json(400, { success: false, error: "invalid_json" });
  }

  const { email, code } = payload;
  
  if (!email || !isValidEmail(email)) {
    return json(400, { success: false, error: "invalid_email" });
  }
  
  if (!code || !isValidOTPCode(code)) {
    return json(400, { success: false, error: "invalid_code" });
  }

  const emailNormalized = normalizeEmail(email);

  // Find the latest challenge
  const challenge = await findLatestOTPChallenge(env, emailNormalized);
  if (!challenge) {
    return json(400, { success: false, error: "invalid_code" });
  }

  // Check if expired
  if (isExpired(challenge.expiresAt)) {
    return json(400, { success: false, error: "code_expired" });
  }

  // Check attempt count
  if (challenge.attemptCount >= OTP_CONFIG.MAX_ATTEMPTS) {
    await markOTPConsumed(env, challenge.id);
    return json(400, { success: false, error: "max_attempts" });
  }

  // Verify code
  const codeHash = hashSecret(code);
  if (codeHash !== challenge.codeHash) {
    await incrementOTPAttempts(env, challenge.id);
    return json(400, { success: false, error: "invalid_code" });
  }

  // Mark challenge as consumed
  await markOTPConsumed(env, challenge.id);

  // Find or create user
  let user = await findUserByEmail(env, emailNormalized);
  if (!user) {
    const locale = getLocaleFromRequest(request);
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    user = await createUser(env, emailNormalized, hashEmail(emailNormalized), locale, timezone);
  }

  // Update last login
  await updateUserLastLogin(env, user.id);

  // Create session
  const sessionToken = generateSessionToken();
  await createSession(env, user.id, sessionToken);

  // Prepare response
  const response = json(200, {
    success: true,
    user: {
      id: user.id,
      locale: user.preferredLocale,
      timezone: user.timezone,
    },
  });

  // Set session cookie
  setSessionCookie(response, sessionToken);

  return response;
}

// =============================================================================
// GET /api/auth/session
// =============================================================================

export async function handleGetSession({ request, env }: RequestContext): Promise<Response> {
  const sessionToken = getSessionCookie(request);
  
  if (!sessionToken) {
    return json(200, { authenticated: false });
  }

  const tokenHash = hashSecret(sessionToken);
  const session = await findSessionByTokenHash(env, tokenHash);

  if (!session || isExpired(session.expiresAt)) {
    const response = json(200, { authenticated: false });
    clearSessionCookie(response);
    return response;
  }

  // Update last used
  await updateSessionLastUsed(env, session.id);

  // Get user
  const user = await findUserByEmail(env, session.userId);
  if (!user) {
    const response = json(200, { authenticated: false });
    clearSessionCookie(response);
    return response;
  }

  return json(200, {
    authenticated: true,
    user: {
      id: user.id,
      locale: user.preferredLocale,
      timezone: user.timezone,
    },
    session: {
      expiresAt: session.expiresAt,
      lastUsedAt: session.lastUsedAt,
    },
  });
}

// =============================================================================
// POST /api/auth/logout
// =============================================================================

export async function handleLogout({ request, env }: RequestContext): Promise<Response> {
  const sessionToken = getSessionCookie(request);
  
  if (sessionToken) {
    const tokenHash = hashSecret(sessionToken);
    const session = await findSessionByTokenHash(env, tokenHash);
    if (session) {
      await revokeSession(env, session.id);
    }
  }

  const response = json(200, { success: true });
  clearSessionCookie(response);
  return response;
}

// =============================================================================
// Session Validation Middleware Helper
// =============================================================================

export async function getAuthenticatedUser({
  request,
  env,
}: RequestContext): Promise<SessionState | null> {
  const sessionToken = getSessionCookie(request);
  
  if (!sessionToken) {
    return null;
  }

  const tokenHash = hashSecret(sessionToken);
  const session = await findSessionByTokenHash(env, tokenHash);

  if (!session || isExpired(session.expiresAt)) {
    return null;
  }

  const user = await findUserByEmail(env, session.userId);
  if (!user) {
    return null;
  }

  // Update last used (don't await)
  updateSessionLastUsed(env, session.id).catch(() => {});

  return {
    isAuthenticated: true,
    user: {
      id: user.id,
      preferredLocale: user.preferredLocale,
      timezone: user.timezone,
      createdAt: user.createdAt,
    },
    sessionId: session.id,
    expiresAt: session.expiresAt,
  };
}
