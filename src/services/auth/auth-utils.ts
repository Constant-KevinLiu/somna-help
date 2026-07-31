/**
 * Sleep Diary v2.3 - Authentication Utilities
 * 
 * OTP generation, hashing, and email normalization.
 * Security-first implementation.
 */

import { createHash, randomBytes } from "node:crypto";
import { OTP_CONFIG } from "./auth-types";

// =============================================================================
// Email Normalization
// =============================================================================

/**
 * Normalize email address to prevent duplicate accounts.
 * - Lowercase
 * - Remove dots from Gmail username (but not from other domains)
 * - Remove + suffix
 */
export function normalizeEmail(email: string): string {
  const normalized = email.toLowerCase().trim();
  const [username, domain] = normalized.split("@");
  
  if (!username || !domain) {
    return normalized;
  }

  // Remove + suffix
  const cleanUsername = username.split("+")[0];

  // Remove dots for Gmail and Google Workspace accounts
  if (domain === "gmail.com" || domain === "googlemail.com") {
    return `${cleanUsername.replace(/\./g, "")}@${domain}`;
  }

  return `${cleanUsername}@${domain}`;
}

// =============================================================================
// Hashing
// =============================================================================

/**
 * Hash email for privacy-preserving lookups.
 * Uses SHA-256 - not reversible without rainbow tables (which we won't have).
 */
export function hashEmail(email: string): string {
  return createHash("sha256")
    .update(email.normalize())
    .digest("hex");
}

/**
 * Hash OTP code or session token.
 * Uses SHA-256 with a fixed salt for deterministic verification.
 * In production, consider using a proper KDF like PBKDF2 or Argon2.
 */
export function hashSecret(secret: string): string {
  // For OTP codes which are short-lived and low-entropy,
  // we use a server-side pepper combined with the code
  const pepper = process.env.OTP_PEPPER || "somna-pepper-change-in-production";
  return createHash("sha256")
    .update(`${pepper}${secret}`)
    .digest("hex");
}

/**
 * Hash IP address for rate limiting without storing raw IPs.
 */
export function hashIp(ip: string): string {
  return createHash("sha256")
    .update(ip)
    .digest("hex")
    .slice(0, 16); // Shorten to reduce storage
}

// =============================================================================
// OTP Generation
// =============================================================================

/**
 * Generate a 6-digit OTP code.
 * Uses cryptographically secure random number generation.
 */
export function generateOTP(): string {
  const buffer = randomBytes(3); // 24 bits = 0-16777215
  const value = buffer.readUIntBE(0, 3);
  // Map to 6-digit range, pad with leading zeros
  return (value % 1000000).toString().padStart(6, "0");
}

/**
 * Generate a secure random session token.
 */
export function generateSessionToken(): string {
  return randomBytes(32).toString("hex");
}

/**
 * Generate a stable user ID.
 */
export function generateUserId(): string {
  return `usr_${randomBytes(16).toString("hex")}`;
}

/**
 * Generate a stable ID for database records.
 */
export function generateId(prefix: string): string {
  return `${prefix}_${randomBytes(16).toString("hex")}`;
}

// =============================================================================
// Time Helpers
// =============================================================================

export function getOTPExpiry(): Date {
  return new Date(Date.now() + OTP_CONFIG.EXPIRY_MINUTES * 60 * 1000);
}

export function getSessionExpiry(): Date {
  return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
}

export function isExpired(timestamp: string): boolean {
  return new Date(timestamp) < new Date();
}

// =============================================================================
// Validation
// =============================================================================

export function isValidEmail(email: string): boolean {
  // Simple but effective email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidOTPCode(code: string): boolean {
  return /^\d{6}$/.test(code);
}
