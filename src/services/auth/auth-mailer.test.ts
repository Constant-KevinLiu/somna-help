/**
 * Tests for auth-mailer — Cloudflare Email Sending native binding.
 *
 * All tests mock the EMAIL binding — no real email is sent.
 * Privacy: verifies that OTP codes, full emails, and message bodies
 * never appear in logs.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { sendOTPEmail } from "./auth-mailer";

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function mockEmailBinding() {
  const send = vi.fn().mockResolvedValue({ messageId: "test-msg-123" });
  return { send };
}

function captureLogs() {
  const logs: string[] = [];
  const warnings: string[] = [];
  const origLog = console.log;
  const origWarn = console.warn;
  console.log = (...args: unknown[]) => logs.push(args.map(String).join(" "));
  console.warn = (...args: unknown[]) => warnings.push(args.map(String).join(" "));
  const restore = () => {
    console.log = origLog;
    console.warn = origWarn;
  };
  return { logs, warnings, restore };
}

const TEST_EMAIL = "alice@example.com";
const TEST_CODE = "123456";

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

describe("sendOTPEmail", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls EMAIL.send once with correct sender, recipient, and subject", async () => {
    const email = mockEmailBinding();
    const env = { EMAIL: email };

    const result = await sendOTPEmail(env, {
      to: TEST_EMAIL,
      code: TEST_CODE,
      locale: "en",
      expiryMinutes: 10,
      requestId: "test-req-1",
    });

    expect(result.success).toBe(true);
    expect(email.send).toHaveBeenCalledTimes(1);

    const callArg = email.send.mock.calls[0][0];
    // Sender
    expect(callArg.from).toEqual({ name: "Somna", email: "account@somna.help" });
    // Recipient
    expect(callArg.to).toBe(TEST_EMAIL);
    // Subject
    expect(callArg.subject).toBe("Your Somna verification code");
  });

  it("includes both text and HTML content", async () => {
    const email = mockEmailBinding();
    const env = { EMAIL: email };

    await sendOTPEmail(env, {
      to: TEST_EMAIL,
      code: TEST_CODE,
      locale: "en",
      expiryMinutes: 10,
    });

    const callArg = email.send.mock.calls[0][0];
    expect(typeof callArg.text).toBe("string");
    expect(callArg.text.length).toBeGreaterThan(0);
    expect(typeof callArg.html).toBe("string");
    expect(callArg.html.length).toBeGreaterThan(0);

    // Safe content checks: code present, expiry duration present, ignore note present
    expect(callArg.text).toContain(TEST_CODE);
    expect(callArg.text).toContain("10 minutes");
    expect(callArg.text).toContain("didn't request");
    expect(callArg.html).toContain(TEST_CODE);
    expect(callArg.html).toContain("10 minutes");
    expect(callArg.html).toContain("didn't request");
  });

  it("uses locale-specific subject and template", async () => {
    const email = mockEmailBinding();
    const env = { EMAIL: email };

    await sendOTPEmail(env, {
      to: TEST_EMAIL,
      code: TEST_CODE,
      locale: "es",
      expiryMinutes: 10,
    });

    const callArg = email.send.mock.calls[0][0];
    expect(callArg.subject).toBe("Tu código de verificación de Somna");
    // Spanish content marker
    expect(callArg.text).toContain("código de verificación");
  });

  it("returns AUTH_EMAIL_NOT_CONFIGURED when binding is missing", async () => {
    const env = {};
    const { warnings, restore } = captureLogs();

    const result = await sendOTPEmail(env, {
      to: TEST_EMAIL,
      code: TEST_CODE,
      locale: "en",
      expiryMinutes: 10,
    });

    expect(result.success).toBe(false);
    expect(result.errorCode).toBe("AUTH_EMAIL_NOT_CONFIGURED");
    expect(warnings.some((w) => w.includes("AUTH_EMAIL_NOT_CONFIGURED"))).toBe(true);
    restore();
  });

  it("returns AUTH_EMAIL_UNAVAILABLE on generic provider failure", async () => {
    const email = {
      send: vi.fn().mockRejectedValue(new Error("Internal provider error")),
    };
    const env = { EMAIL: email };
    const { warnings, restore } = captureLogs();

    const result = await sendOTPEmail(env, {
      to: TEST_EMAIL,
      code: TEST_CODE,
      locale: "en",
      expiryMinutes: 10,
    });

    expect(result.success).toBe(false);
    expect(result.errorCode).toBe("AUTH_EMAIL_UNAVAILABLE");
    expect(warnings.some((w) => w.includes("AUTH_EMAIL_UNAVAILABLE"))).toBe(true);
    restore();
  });

  it("returns AUTH_EMAIL_REJECTED when provider rejects the message", async () => {
    const email = {
      send: vi.fn().mockRejectedValue(new Error("Recipient address rejected")),
    };
    const env = { EMAIL: email };

    const result = await sendOTPEmail(env, {
      to: TEST_EMAIL,
      code: TEST_CODE,
      locale: "en",
      expiryMinutes: 10,
    });

    expect(result.success).toBe(false);
    expect(result.errorCode).toBe("AUTH_EMAIL_REJECTED");
  });

  it("returns AUTH_EMAIL_RATE_LIMITED when provider rate-limits", async () => {
    const email = {
      send: vi.fn().mockRejectedValue(new Error("Rate limit exceeded: too many requests")),
    };
    const env = { EMAIL: email };

    const result = await sendOTPEmail(env, {
      to: TEST_EMAIL,
      code: TEST_CODE,
      locale: "en",
      expiryMinutes: 10,
    });

    expect(result.success).toBe(false);
    expect(result.errorCode).toBe("AUTH_EMAIL_RATE_LIMITED");
  });

  it("never logs the OTP code or full email address", async () => {
    const email = mockEmailBinding();
    const env = { EMAIL: email };
    const { logs, warnings, restore } = captureLogs();

    await sendOTPEmail(env, {
      to: TEST_EMAIL,
      code: TEST_CODE,
      locale: "en",
      expiryMinutes: 10,
      requestId: "privacy-check",
    });

    const allOutput = [...logs, ...warnings].join("\n");
    // Must not contain the OTP code
    expect(allOutput).not.toContain(TEST_CODE);
    // Must not contain the full email address
    expect(allOutput).not.toContain(TEST_EMAIL);
    // Must contain a redacted recipient (e.g. "al...@example.com")
    expect(allOutput).toMatch(/\.\.\.@/);
    // Must contain provider name
    expect(allOutput).toContain("cloudflare-email");
    // Must contain request ID
    expect(allOutput).toContain("privacy-check");

    restore();
  });

  it("never logs the OTP code or full email on failure", async () => {
    const email = {
      send: vi.fn().mockRejectedValue(new Error("boom")),
    };
    const env = { EMAIL: email };
    const { logs, warnings, restore } = captureLogs();

    await sendOTPEmail(env, {
      to: TEST_EMAIL,
      code: TEST_CODE,
      locale: "en",
      expiryMinutes: 10,
      requestId: "fail-privacy-check",
    });

    const allOutput = [...logs, ...warnings].join("\n");
    expect(allOutput).not.toContain(TEST_CODE);
    expect(allOutput).not.toContain(TEST_EMAIL);
    expect(allOutput).toContain("AUTH_EMAIL_UNAVAILABLE");
    // Should not include the raw error message (provider internals)
    expect(allOutput).not.toContain("boom");

    restore();
  });
});
