/**
 * Sleep Diary v2.3 - Authentication Types
 * 
 * Types for passwordless OTP authentication and session management.
 * All content follows multi-native language principles - no English fallback.
 */

export type Locale = "en" | "es" | "pt-BR" | "pl";

// =============================================================================
// User Types
// =============================================================================

export interface User {
  id: string;
  emailNormalized: string;
  emailHash: string;
  preferredLocale: Locale;
  timezone: string;
  createdAt: string;
  lastLoginAt?: string;
  deletedAt?: string;
}

export interface PublicUserProfile {
  id: string;
  preferredLocale: Locale;
  timezone: string;
  createdAt: string;
}

// =============================================================================
// Session Types
// =============================================================================

export interface Session {
  id: string;
  userId: string;
  tokenHash: string;
  createdAt: string;
  expiresAt: string;
  lastUsedAt: string;
  revokedAt?: string;
}

export interface SessionState {
  isAuthenticated: boolean;
  user?: PublicUserProfile;
  sessionId?: string;
  expiresAt?: string;
}

// =============================================================================
// OTP Types
// =============================================================================

export interface OTPChallenge {
  id: string;
  emailNormalized: string;
  codeHash: string;
  expiresAt: string;
  attemptCount: number;
  createdAt: string;
  consumedAt?: string;
  requestIpHash: string;
}

export interface OTPRequestData {
  email: string;
  intent?: AuthIntent;
  turnstileToken?: string;
}

export interface OTPVerifyData {
  email: string;
  code: string;
  intent?: AuthIntent;
}

export type AuthIntent = 
  | "sync_diary"
  | "save_reflection" 
  | "enable_reminders"
  | "restore_history"
  | "export_data"
  | "general";

// =============================================================================
// API Response Types
// =============================================================================

export interface AuthResponse {
  success: boolean;
  message?: string;
  session?: SessionState;
  redirectTo?: string;
  resumeAction?: PendingAction;
}

export interface OTPRequestResponse {
  success: boolean;
  message: string;
  rateLimit?: {
    remainingRequests: number;
    nextRequestAfter: number;
  };
}

export interface PendingAction {
  type: AuthIntent;
  payload: Record<string, unknown>;
  timestamp: string;
}

// =============================================================================
// Cookie Constants
// =============================================================================

export const AUTH_COOKIE_NAME = "somna_session";
export const PENDING_ACTION_COOKIE = "somna_pending";

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "Lax" as const,
  path: "/",
  maxAge: 30 * 24 * 60 * 60, // 30 days
} as const;

// =============================================================================
// OTP Constants
// =============================================================================

export const OTP_CONFIG = {
  CODE_LENGTH: 6,
  EXPIRY_MINUTES: 10,
  MAX_ATTEMPTS: 5,
  MIN_REQUEST_INTERVAL_SECONDS: 60,
  MAX_DAILY_REQUESTS: 10,
} as const;

// =============================================================================
// Error Types
// =============================================================================

export type AuthErrorCode = 
  | "invalid_email"
  | "code_expired"
  | "code_invalid"
  | "max_attempts_exceeded"
  | "rate_limited"
  | "session_expired"
  | "session_invalid"
  | "user_not_found"
  | "user_deleted"
  | "network_error"
  | "unknown_error";

export interface AuthError {
  code: AuthErrorCode;
  message: string;
  locale: Locale;
}
