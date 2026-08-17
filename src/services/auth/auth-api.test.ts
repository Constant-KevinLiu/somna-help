/**
 * Tests for handleRequestCode — transactional semantics and email integration.
 *
 * Mocks both the D1 database and the EMAIL binding.
 * Verifies the required flow:
 *   validate → rate-limit → generate OTP → persist → send email → success
 * And rollback on email failure.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { handleRequestCode, handleVerifyCode } from "./auth-api";

// -----------------------------------------------------------------------------
// Mock auth-db
// -----------------------------------------------------------------------------

const mockCountRecentOTPRequests = vi.fn();
const mockFindLatestOTPChallenge = vi.fn();
const mockCreateOTPChallenge = vi.fn();
const mockDeleteOTPChallenge = vi.fn();
const mockIncrementOTPAttempts = vi.fn();
const mockMarkOTPConsumed = vi.fn();
const mockFindUserByEmail = vi.fn();
const mockFindUserById = vi.fn();
const mockCreateUser = vi.fn();
const mockCreateSession = vi.fn();
const mockFindSessionByTokenHash = vi.fn();
const mockUpdateSessionLastUsed = vi.fn();
const mockRevokeSession = vi.fn();
const mockUpdateUserLastLogin = vi.fn();

vi.mock("./auth-db", () => ({
  countRecentOTPRequests: (...args: unknown[]) => mockCountRecentOTPRequests(...args),
  findLatestOTPChallenge: (...args: unknown[]) => mockFindLatestOTPChallenge(...args),
  createOTPChallenge: (...args: unknown[]) => mockCreateOTPChallenge(...args),
  deleteOTPChallenge: (...args: unknown[]) => mockDeleteOTPChallenge(...args),
  incrementOTPAttempts: (...args: unknown[]) => mockIncrementOTPAttempts(...args),
  markOTPConsumed: (...args: unknown[]) => mockMarkOTPConsumed(...args),
  findUserByEmail: (...args: unknown[]) => mockFindUserByEmail(...args),
  findUserById: (...args: unknown[]) => mockFindUserById(...args),
  createUser: (...args: unknown[]) => mockCreateUser(...args),
  createSession: (...args: unknown[]) => mockCreateSession(...args),
  findSessionByTokenHash: (...args: unknown[]) => mockFindSessionByTokenHash(...args),
  updateSessionLastUsed: (...args: unknown[]) => mockUpdateSessionLastUsed(...args),
  revokeSession: (...args: unknown[]) => mockRevokeSession(...args),
  updateUserLastLogin: (...args: unknown[]) => mockUpdateUserLastLogin(...args),
}));

// -----------------------------------------------------------------------------
// Mock auth-mailer
// -----------------------------------------------------------------------------

const mockSendOTPEmail = vi.fn();

vi.mock("./auth-mailer", () => ({
  sendOTPEmail: (...args: unknown[]) => mockSendOTPEmail(...args),
}));

// -----------------------------------------------------------------------------
// Mock auth-utils (we need deterministic OTP for test assertions)
// -----------------------------------------------------------------------------

vi.mock("./auth-utils", async () => {
  const actual = await vi.importActual<typeof import("./auth-utils")>("./auth-utils");
  return {
    ...actual,
    generateOTP: () => "123456",
  };
});

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function makeRequest(body: unknown, method = "POST"): Request {
  return new Request("https://somna.help/api/auth/request-code", {
    method,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

function makeMockDB() {
  return {
    prepare: vi.fn(),
  };
}

function makeMockEmail() {
  return {
    send: vi.fn().mockResolvedValue({ messageId: "msg-test" }),
  };
}

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

describe("handleRequestCode", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default: no rate limit hit, no existing challenge
    mockCountRecentOTPRequests.mockResolvedValue(0);
    mockFindLatestOTPChallenge.mockResolvedValue(null);
    mockCreateOTPChallenge.mockResolvedValue({
      id: "otp_testchallenge",
      emailNormalized: "user@example.com",
      codeHash: "testhash",
      expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
      attemptCount: 0,
      createdAt: new Date().toISOString(),
      requestIpHash: "abcdef",
    });
    mockDeleteOTPChallenge.mockResolvedValue(true);
    // Default: email provider accepts
    mockSendOTPEmail.mockResolvedValue({ success: true });
  });

  it("returns success when provider accepts the message", async () => {
    const env = { DB: makeMockDB() as any, EMAIL: makeMockEmail() as any };
    const response = await handleRequestCode({
      request: makeRequest({ email: "user@example.com", locale: "en" }),
      env,
      ctx: {},
    });

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);

    // OTP challenge was persisted
    expect(mockCreateOTPChallenge).toHaveBeenCalledTimes(1);
    // Email was sent
    expect(mockSendOTPEmail).toHaveBeenCalledTimes(1);
    // Challenge was NOT deleted
    expect(mockDeleteOTPChallenge).not.toHaveBeenCalled();
  });

  it("calls sendOTPEmail with correct parameters", async () => {
    const env = { DB: makeMockDB() as any, EMAIL: makeMockEmail() as any };
    await handleRequestCode({
      request: makeRequest({ email: "User@Example.com", locale: "pt-BR" }),
      env,
      ctx: {},
    });

    expect(mockSendOTPEmail).toHaveBeenCalledTimes(1);
    const callArg = mockSendOTPEmail.mock.calls[0];
    // First arg is the resolved env (same bindings, possibly a new object)
    expect(callArg[0].DB).toBe(env.DB);
    expect(callArg[0].EMAIL).toBe(env.EMAIL);
    // Second arg has options
    const opts = callArg[1];
    expect(opts.to).toBe("User@Example.com"); // raw email, not normalized
    expect(opts.code).toBe("123456");
    expect(opts.locale).toBe("pt-BR");
    expect(opts.expiryMinutes).toBe(10);
  });

  it("persists OTP BEFORE calling the email provider", async () => {
    // Verify order: createOTPChallenge resolves, then sendOTPEmail is called
    const order: string[] = [];
    mockCreateOTPChallenge.mockImplementation(async () => {
      order.push("create");
      return {
        id: "otp_test",
        emailNormalized: "x",
        codeHash: "x",
        expiresAt: "x",
        attemptCount: 0,
        createdAt: "x",
        requestIpHash: "x",
      };
    });
    mockSendOTPEmail.mockImplementation(async () => {
      order.push("email");
      return { success: true };
    });

    const env = { DB: makeMockDB() as any, EMAIL: makeMockEmail() as any };
    await handleRequestCode({
      request: makeRequest({ email: "user@example.com" }),
      env,
      ctx: {},
    });

    expect(order).toEqual(["create", "email"]);
  });

  it("fails and deletes the OTP when provider is unavailable", async () => {
    mockSendOTPEmail.mockResolvedValue({
      success: false,
      errorCode: "AUTH_EMAIL_UNAVAILABLE",
    });

    const env = { DB: makeMockDB() as any, EMAIL: makeMockEmail() as any };
    const response = await handleRequestCode({
      request: makeRequest({ email: "user@example.com" }),
      env,
      ctx: {},
    });

    expect(response.status).toBe(503);
    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.error).toBe("email_send_failed");
    expect(body.code).toBe("AUTH_EMAIL_UNAVAILABLE");

    // Challenge was created, then deleted
    expect(mockCreateOTPChallenge).toHaveBeenCalledTimes(1);
    expect(mockDeleteOTPChallenge).toHaveBeenCalledTimes(1);
    expect(mockDeleteOTPChallenge).toHaveBeenCalledWith(env, "otp_testchallenge");
  });

  it("fails with 400 when provider rejects the message", async () => {
    mockSendOTPEmail.mockResolvedValue({
      success: false,
      errorCode: "AUTH_EMAIL_REJECTED",
    });

    const env = { DB: makeMockDB() as any, EMAIL: makeMockEmail() as any };
    const response = await handleRequestCode({
      request: makeRequest({ email: "user@example.com" }),
      env,
      ctx: {},
    });

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.code).toBe("AUTH_EMAIL_REJECTED");
    expect(mockDeleteOTPChallenge).toHaveBeenCalledTimes(1);
  });

  it("fails with 429 when provider rate-limits", async () => {
    mockSendOTPEmail.mockResolvedValue({
      success: false,
      errorCode: "AUTH_EMAIL_RATE_LIMITED",
    });

    const env = { DB: makeMockDB() as any, EMAIL: makeMockEmail() as any };
    const response = await handleRequestCode({
      request: makeRequest({ email: "user@example.com" }),
      env,
      ctx: {},
    });

    expect(response.status).toBe(429);
    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.code).toBe("AUTH_EMAIL_RATE_LIMITED");
    expect(mockDeleteOTPChallenge).toHaveBeenCalledTimes(1);
  });

  it("does not return success when EMAIL binding is missing", async () => {
    mockSendOTPEmail.mockResolvedValue({
      success: false,
      errorCode: "AUTH_EMAIL_NOT_CONFIGURED",
    });

    const env = { DB: makeMockDB() as any }; // no EMAIL binding
    const response = await handleRequestCode({
      request: makeRequest({ email: "user@example.com" }),
      env,
      ctx: {},
    });

    expect(response.status).toBe(503);
    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.code).toBe("AUTH_EMAIL_NOT_CONFIGURED");
  });

  it("does not advance to email send when rate limited", async () => {
    mockCountRecentOTPRequests.mockResolvedValue(10);

    const env = { DB: makeMockDB() as any, EMAIL: makeMockEmail() as any };
    const response = await handleRequestCode({
      request: makeRequest({ email: "user@example.com" }),
      env,
      ctx: {},
    });

    expect(response.status).toBe(429);
    expect(mockCreateOTPChallenge).not.toHaveBeenCalled();
    expect(mockSendOTPEmail).not.toHaveBeenCalled();
  });

  it("does not advance to email send during cooldown", async () => {
    mockFindLatestOTPChallenge.mockResolvedValue({
      id: "otp_existing",
      emailNormalized: "user@example.com",
      codeHash: "xxx",
      expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
      attemptCount: 0,
      createdAt: new Date(Date.now() - 30 * 1000).toISOString(), // 30 seconds ago
      requestIpHash: "xxx",
    });

    const env = { DB: makeMockDB() as any, EMAIL: makeMockEmail() as any };
    const response = await handleRequestCode({
      request: makeRequest({ email: "user@example.com" }),
      env,
      ctx: {},
    });

    expect(response.status).toBe(429);
    const body = await response.json();
    expect(body.error).toBe("cooldown");
    expect(body.waitSeconds).toBeGreaterThan(25); // ~30s left
    expect(mockCreateOTPChallenge).not.toHaveBeenCalled();
    expect(mockSendOTPEmail).not.toHaveBeenCalled();
  });

  it("returns 400 for invalid email", async () => {
    const env = { DB: makeMockDB() as any, EMAIL: makeMockEmail() as any };
    const response = await handleRequestCode({
      request: makeRequest({ email: "not-an-email" }),
      env,
      ctx: {},
    });

    expect(response.status).toBe(400);
    expect(mockSendOTPEmail).not.toHaveBeenCalled();
  });

  // ─── Runtime environment validation ────────────────────────────────────────

  describe("runtime environment validation", () => {
    it("does not throw when env is undefined (Vite dev scenario)", async () => {
      await expect(
        handleRequestCode({
          request: makeRequest({ email: "user@example.com" }),
          env: undefined as any,
          ctx: {},
        }),
      ).resolves.toBeInstanceOf(Response);
    });

    it("returns structured 503 AUTH_SERVICE_UNAVAILABLE when env is undefined", async () => {
      const response = await handleRequestCode({
        request: makeRequest({ email: "user@example.com" }),
        env: undefined as any,
        ctx: {},
      });

      expect(response.status).toBe(503);
      const body = await response.json();
      expect(body.success).toBe(false);
      expect(body.error).toBe("service_unavailable");
      expect(body.code).toBe("AUTH_SERVICE_UNAVAILABLE");
    });

    it("returns structured 503 when DB is missing", async () => {
      const response = await handleRequestCode({
        request: makeRequest({ email: "user@example.com" }),
        env: { EMAIL: makeMockEmail() as any },
        ctx: {},
      });

      expect(response.status).toBe(503);
      const body = await response.json();
      expect(body.success).toBe(false);
      expect(body.code).toBe("AUTH_SERVICE_UNAVAILABLE");
    });

    it("returns structured 503 when env is null", async () => {
      const response = await handleRequestCode({
        request: makeRequest({ email: "user@example.com" }),
        env: null as any,
        ctx: {},
      });

      expect(response.status).toBe(503);
      const body = await response.json();
      expect(body.code).toBe("AUTH_SERVICE_UNAVAILABLE");
    });

    it("proceeds to rate-limit lookup when DB is available", async () => {
      const env = { DB: makeMockDB() as any, EMAIL: makeMockEmail() as any };
      mockCountRecentOTPRequests.mockResolvedValue(0);

      await handleRequestCode({
        request: makeRequest({ email: "user@example.com" }),
        env,
        ctx: {},
      });

      expect(mockCountRecentOTPRequests).toHaveBeenCalledTimes(1);
    });

    it("does not advance to email send or OTP creation when DB is missing", async () => {
      await handleRequestCode({
        request: makeRequest({ email: "user@example.com" }),
        env: undefined as any,
        ctx: {},
      });

      expect(mockCountRecentOTPRequests).not.toHaveBeenCalled();
      expect(mockCreateOTPChallenge).not.toHaveBeenCalled();
      expect(mockSendOTPEmail).not.toHaveBeenCalled();
    });

    it("does not expose OTP codes or secrets in 503 response", async () => {
      const response = await handleRequestCode({
        request: makeRequest({ email: "user@example.com" }),
        env: undefined as any,
        ctx: {},
      });

      const bodyText = await response.text();
      // No numeric code that could be an OTP
      expect(bodyText).not.toMatch(/\b\d{6}\b/);
      // No hash / secret leakage
      expect(bodyText.toLowerCase()).not.toContain("secret");
      expect(bodyText.toLowerCase()).not.toContain("hash");
      expect(bodyText.toLowerCase()).not.toContain("token");
      expect(bodyText.toLowerCase()).not.toContain("password");
      // Sanitized — no stack traces or internal details
      expect(bodyText.toLowerCase()).not.toContain("stack");
      expect(bodyText.toLowerCase()).not.toContain("typeerror");
    });
  });
});

// =============================================================================
// handleVerifyCode — runtime environment tests
// =============================================================================

describe("handleVerifyCode — runtime env", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 503 AUTH_SERVICE_UNAVAILABLE when env is undefined", async () => {
    const response = await handleVerifyCode({
      request: new Request("https://somna.help/api/auth/verify-code", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: "user@example.com", code: "123456" }),
      }),
      env: undefined as any,
      ctx: {},
    });

    expect(response.status).toBe(503);
    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.code).toBe("AUTH_SERVICE_UNAVAILABLE");
  });

  it("does not query DB or create session when env is missing", async () => {
    await handleVerifyCode({
      request: new Request("https://somna.help/api/auth/verify-code", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: "user@example.com", code: "123456" }),
      }),
      env: undefined as any,
      ctx: {},
    });

    expect(mockFindLatestOTPChallenge).not.toHaveBeenCalled();
    expect(mockFindUserByEmail).not.toHaveBeenCalled();
    expect(mockCreateSession).not.toHaveBeenCalled();
  });
});

// =============================================================================
// handleGetSession tests
// =============================================================================

import { handleGetSession, getAuthenticatedUser } from "./auth-api";
import { hashSecret } from "./auth-utils";

describe("handleGetSession", () => {
  const VALID_TOKEN = "test_session_token_12345";
  const VALID_USER_ID = "user_abc123";
  const VALID_SESSION_ID = "sess_test123";

  function makeSessionRequest(token: string | null): Request {
    const headers: Record<string, string> = {};
    if (token) {
      headers["cookie"] = `somna_session=${token}`;
    }
    return new Request("https://somna.help/api/auth/session", {
      method: "GET",
      headers,
    });
  }

  beforeEach(() => {
    vi.clearAllMocks();
    mockFindSessionByTokenHash.mockResolvedValue(null);
    mockFindUserById.mockResolvedValue(null);
    mockUpdateSessionLastUsed.mockResolvedValue(undefined);
  });

  describe("anonymous / no session cookie", () => {
    it("returns { authenticated: false } when no cookie is present", async () => {
      const env = { DB: makeMockDB() as any };
      const response = await handleGetSession({
        request: makeSessionRequest(null),
        env,
        ctx: {},
      });

      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body.authenticated).toBe(false);
      // No session cookie should be cleared (none was sent)
      expect(response.headers.getSetCookie?.() ?? []).toEqual([]);
    });

    it("does not query the database when no cookie is present", async () => {
      const env = { DB: makeMockDB() as any };
      await handleGetSession({
        request: makeSessionRequest(null),
        env,
        ctx: {},
      });

      expect(mockFindSessionByTokenHash).not.toHaveBeenCalled();
      expect(mockFindUserById).not.toHaveBeenCalled();
    });
  });

  describe("invalid / expired session", () => {
    it("returns { authenticated: false } and clears cookie when session not found", async () => {
      mockFindSessionByTokenHash.mockResolvedValue(null);

      const env = { DB: makeMockDB() as any };
      const response = await handleGetSession({
        request: makeSessionRequest(VALID_TOKEN),
        env,
        ctx: {},
      });

      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body.authenticated).toBe(false);

      // Cookie should be cleared
      const setCookie = response.headers.getSetCookie?.() ?? [];
      expect(setCookie.some((c: string) => c.startsWith("somna_session="))).toBe(true);
      expect(setCookie.some((c: string) => c.includes("Max-Age=0"))).toBe(true);

      expect(mockFindUserById).not.toHaveBeenCalled();
    });

    it("returns { authenticated: false } and clears cookie when session is expired", async () => {
      mockFindSessionByTokenHash.mockResolvedValue({
        id: VALID_SESSION_ID,
        userId: VALID_USER_ID,
        tokenHash: "abc",
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        expiresAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // expired 1 day ago
        lastUsedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        revokedAt: undefined,
      });

      const env = { DB: makeMockDB() as any };
      const response = await handleGetSession({
        request: makeSessionRequest(VALID_TOKEN),
        env,
        ctx: {},
      });

      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body.authenticated).toBe(false);

      const setCookie = response.headers.getSetCookie?.() ?? [];
      expect(setCookie.some((c: string) => c.includes("Max-Age=0"))).toBe(true);

      expect(mockFindUserById).not.toHaveBeenCalled();
    });
  });

  describe("valid authenticated session", () => {
    beforeEach(() => {
      mockFindSessionByTokenHash.mockResolvedValue({
        id: VALID_SESSION_ID,
        userId: VALID_USER_ID,
        tokenHash: hashSecret(VALID_TOKEN),
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        lastUsedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        revokedAt: undefined,
      });
    });

    it("returns authenticated user data with findUserById (not findUserByEmail)", async () => {
      mockFindUserById.mockResolvedValue({
        id: VALID_USER_ID,
        emailNormalized: "user@example.com",
        emailHash: "hash123",
        preferredLocale: "en",
        timezone: "America/New_York",
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        deletedAt: undefined,
      });

      const env = { DB: makeMockDB() as any };
      const response = await handleGetSession({
        request: makeSessionRequest(VALID_TOKEN),
        env,
        ctx: {},
      });

      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body.authenticated).toBe(true);
      expect(body.user.id).toBe(VALID_USER_ID);
      expect(body.user.locale).toBe("en");
      expect(body.user.timezone).toBe("America/New_York");
      expect(body.session.expiresAt).toBeDefined();
      expect(body.session.lastUsedAt).toBeDefined();

      // CRITICAL: must use findUserById with session.userId, NOT findUserByEmail
      expect(mockFindUserById).toHaveBeenCalledTimes(1);
      expect(mockFindUserById).toHaveBeenCalledWith(env, VALID_USER_ID);
      // findUserByEmail must NOT be called for session lookup
      expect(mockFindUserByEmail).not.toHaveBeenCalled();
    });

    it("does NOT clear the session cookie for valid users", async () => {
      mockFindUserById.mockResolvedValue({
        id: VALID_USER_ID,
        emailNormalized: "user@example.com",
        emailHash: "hash123",
        preferredLocale: "en",
        timezone: "UTC",
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        deletedAt: undefined,
      });

      const env = { DB: makeMockDB() as any };
      const response = await handleGetSession({
        request: makeSessionRequest(VALID_TOKEN),
        env,
        ctx: {},
      });

      const setCookie = response.headers.getSetCookie?.() ?? [];
      // Session cookie should NOT be cleared (no Max-Age=0 for somna_session)
      const sessionCookies = setCookie.filter((c: string) => c.startsWith("somna_session="));
      const clearedCookies = sessionCookies.filter((c: string) => c.includes("Max-Age=0"));
      expect(clearedCookies).toHaveLength(0);
    });

    it("updates session last_used timestamp", async () => {
      mockFindUserById.mockResolvedValue({
        id: VALID_USER_ID,
        emailNormalized: "user@example.com",
        emailHash: "hash123",
        preferredLocale: "en",
        timezone: "UTC",
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        deletedAt: undefined,
      });

      const env = { DB: makeMockDB() as any };
      await handleGetSession({
        request: makeSessionRequest(VALID_TOKEN),
        env,
        ctx: {},
      });

      expect(mockUpdateSessionLastUsed).toHaveBeenCalledWith(env, VALID_SESSION_ID);
    });
  });

  describe("missing user (valid session but user deleted)", () => {
    beforeEach(() => {
      mockFindSessionByTokenHash.mockResolvedValue({
        id: VALID_SESSION_ID,
        userId: VALID_USER_ID,
        tokenHash: "abc",
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        lastUsedAt: new Date().toISOString(),
        revokedAt: undefined,
      });
      mockFindUserById.mockResolvedValue(null);
    });

    it("returns { authenticated: false } and clears cookie when user not found", async () => {
      const env = { DB: makeMockDB() as any };
      const response = await handleGetSession({
        request: makeSessionRequest(VALID_TOKEN),
        env,
        ctx: {},
      });

      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body.authenticated).toBe(false);

      const setCookie = response.headers.getSetCookie?.() ?? [];
      expect(setCookie.some((c: string) => c.includes("Max-Age=0"))).toBe(true);
    });

    it("uses findUserById for user lookup", async () => {
      const env = { DB: makeMockDB() as any };
      await handleGetSession({
        request: makeSessionRequest(VALID_TOKEN),
        env,
        ctx: {},
      });

      expect(mockFindUserById).toHaveBeenCalledWith(env, VALID_USER_ID);
      expect(mockFindUserByEmail).not.toHaveBeenCalled();
    });
  });

  describe("runtime environment validation", () => {
    it("returns { authenticated: false } with no cookie even when env is undefined", async () => {
      const response = await handleGetSession({
        request: makeSessionRequest(null),
        env: undefined as any,
        ctx: {},
      });

      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body.authenticated).toBe(false);
    });

    it("clears cookie and returns unauthenticated when DB is missing but cookie is present", async () => {
      const response = await handleGetSession({
        request: makeSessionRequest(VALID_TOKEN),
        env: undefined as any,
        ctx: {},
      });

      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body.authenticated).toBe(false);

      const setCookie = response.headers.getSetCookie?.() ?? [];
      expect(setCookie.some((c: string) => c.startsWith("somna_session="))).toBe(true);
      expect(setCookie.some((c: string) => c.includes("Max-Age=0"))).toBe(true);
    });

    it("does not call any DB functions when env is undefined", async () => {
      await handleGetSession({
        request: makeSessionRequest(VALID_TOKEN),
        env: undefined as any,
        ctx: {},
      });

      expect(mockFindSessionByTokenHash).not.toHaveBeenCalled();
      expect(mockFindUserById).not.toHaveBeenCalled();
      expect(mockUpdateSessionLastUsed).not.toHaveBeenCalled();
    });
  });
});

// =============================================================================
// getAuthenticatedUser tests
// =============================================================================

describe("getAuthenticatedUser", () => {
  const VALID_TOKEN = "auth_user_token_789";
  const VALID_USER_ID = "user_xyz789";
  const VALID_SESSION_ID = "sess_auth456";

  function makeAuthRequest(token: string | null): Request {
    const headers: Record<string, string> = {};
    if (token) {
      headers["cookie"] = `somna_session=${token}`;
    }
    return new Request("https://somna.help/api/protected", {
      method: "GET",
      headers,
    });
  }

  beforeEach(() => {
    vi.clearAllMocks();
    mockFindSessionByTokenHash.mockResolvedValue(null);
    mockFindUserById.mockResolvedValue(null);
    mockUpdateSessionLastUsed.mockResolvedValue(undefined);
  });

  it("returns null when no session cookie", async () => {
    const env = { DB: makeMockDB() as any };
    const result = await getAuthenticatedUser({
      request: makeAuthRequest(null),
      env,
      ctx: {},
    });

    expect(result).toBeNull();
    expect(mockFindSessionByTokenHash).not.toHaveBeenCalled();
  });

  it("returns null when session is expired", async () => {
    mockFindSessionByTokenHash.mockResolvedValue({
      id: VALID_SESSION_ID,
      userId: VALID_USER_ID,
      tokenHash: "abc",
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      expiresAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      lastUsedAt: new Date().toISOString(),
      revokedAt: undefined,
    });

    const env = { DB: makeMockDB() as any };
    const result = await getAuthenticatedUser({
      request: makeAuthRequest(VALID_TOKEN),
      env,
      ctx: {},
    });

    expect(result).toBeNull();
    expect(mockFindUserById).not.toHaveBeenCalled();
  });

  it("returns user session state when session and user are valid", async () => {
    mockFindSessionByTokenHash.mockResolvedValue({
      id: VALID_SESSION_ID,
      userId: VALID_USER_ID,
      tokenHash: "abc",
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      lastUsedAt: new Date().toISOString(),
      revokedAt: undefined,
    });
    mockFindUserById.mockResolvedValue({
      id: VALID_USER_ID,
      emailNormalized: "test@example.com",
      emailHash: "hash",
      preferredLocale: "pt-BR",
      timezone: "Europe/Lisbon",
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      lastLoginAt: new Date().toISOString(),
      deletedAt: undefined,
    });

    const env = { DB: makeMockDB() as any };
    const result = await getAuthenticatedUser({
      request: makeAuthRequest(VALID_TOKEN),
      env,
      ctx: {},
    });

    expect(result).not.toBeNull();
    if (!result) throw new Error("result should not be null");
    expect(result.isAuthenticated).toBe(true);
    if (!result.user) throw new Error("result.user should be present for authenticated session");
    expect(result.user.id).toBe(VALID_USER_ID);
    expect(result.user.preferredLocale).toBe("pt-BR");
    expect(result.user.timezone).toBe("Europe/Lisbon");
    expect(result.sessionId).toBe(VALID_SESSION_ID);
    expect(result.expiresAt).toBeDefined();

    // CRITICAL: must use findUserById, not findUserByEmail
    expect(mockFindUserById).toHaveBeenCalledTimes(1);
    expect(mockFindUserById).toHaveBeenCalledWith(env, VALID_USER_ID);
    expect(mockFindUserByEmail).not.toHaveBeenCalled();
  });

  it("returns null when user is not found (valid session but user missing)", async () => {
    mockFindSessionByTokenHash.mockResolvedValue({
      id: VALID_SESSION_ID,
      userId: VALID_USER_ID,
      tokenHash: "abc",
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      lastUsedAt: new Date().toISOString(),
      revokedAt: undefined,
    });
    mockFindUserById.mockResolvedValue(null);

    const env = { DB: makeMockDB() as any };
    const result = await getAuthenticatedUser({
      request: makeAuthRequest(VALID_TOKEN),
      env,
      ctx: {},
    });

    expect(result).toBeNull();
    expect(mockFindUserById).toHaveBeenCalledWith(env, VALID_USER_ID);
  });

  describe("runtime environment validation", () => {
    it("returns null when no cookie even with undefined env", async () => {
      const result = await getAuthenticatedUser({
        request: makeAuthRequest(null),
        env: undefined as any,
        ctx: {},
      });

      expect(result).toBeNull();
    });

    it("returns null when env is undefined but cookie is present (no DB)", async () => {
      const result = await getAuthenticatedUser({
        request: makeAuthRequest(VALID_TOKEN),
        env: undefined as any,
        ctx: {},
      });

      expect(result).toBeNull();
      expect(mockFindSessionByTokenHash).not.toHaveBeenCalled();
    });
  });
});
