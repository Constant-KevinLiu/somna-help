/**
 * Tests for handleRequestCode — transactional semantics and email integration.
 *
 * Mocks both the D1 database and the EMAIL binding.
 * Verifies the required flow:
 *   validate → rate-limit → generate OTP → persist → send email → success
 * And rollback on email failure.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { handleRequestCode } from "./auth-api";

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
    // First arg is env
    expect(callArg[0]).toBe(env);
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
      return { id: "otp_test", emailNormalized: "x", codeHash: "x", expiresAt: "x", attemptCount: 0, createdAt: "x", requestIpHash: "x" };
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
});
