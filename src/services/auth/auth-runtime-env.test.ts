/**
 * Tests for auth-runtime-env.ts — runtime environment validation.
 *
 * Covers:
 *   1. Missing / undefined runtime env does not throw.
 *   2. resolveAuthEnv safely narrows unknown → AuthEnv.
 *   3. requireDB returns structured failure when DB missing.
 *   4. requireEmail returns structured failure when EMAIL missing.
 *   5. Production-style env (both bindings present) passes validation.
 *   6. Non-object env values are handled gracefully.
 */

import { describe, it, expect } from "vitest";
import type { D1Database, SendEmail } from "@cloudflare/workers-types";
import { resolveAuthEnv, requireDB, requireEmail } from "./auth-runtime-env";

function makeMockDB() {
  return { prepare: () => ({ bind: () => ({ first: () => Promise.resolve(null) }) }) };
}

function makeMockEmail() {
  return { send: () => Promise.resolve({ messageId: "test" }) };
}

describe("resolveAuthEnv", () => {
  it("returns empty env when given undefined (Vite dev scenario)", () => {
    const result = resolveAuthEnv(undefined);
    expect(result).toEqual({ DB: undefined, EMAIL: undefined });
    // Must not throw on property access
    expect(result.DB).toBeUndefined();
    expect(result.EMAIL).toBeUndefined();
  });

  it("returns empty env when given null", () => {
    const result = resolveAuthEnv(null);
    expect(result.DB).toBeUndefined();
    expect(result.EMAIL).toBeUndefined();
  });

  it("returns empty env when given a non-object (string)", () => {
    const result = resolveAuthEnv("not-an-object");
    expect(result.DB).toBeUndefined();
    expect(result.EMAIL).toBeUndefined();
  });

  it("returns empty env when given an empty object", () => {
    const result = resolveAuthEnv({});
    expect(result.DB).toBeUndefined();
    expect(result.EMAIL).toBeUndefined();
  });

  it("extracts DB when binding is present and D1-like", () => {
    const db = makeMockDB() as unknown as D1Database;
    const result = resolveAuthEnv({ DB: db });
    expect(result.DB).toBe(db);
    expect(result.EMAIL).toBeUndefined();
  });

  it("extracts EMAIL when binding is present and SendEmail-like", () => {
    const email = makeMockEmail() as unknown as SendEmail;
    const result = resolveAuthEnv({ EMAIL: email });
    expect(result.EMAIL).toBe(email);
    expect(result.DB).toBeUndefined();
  });

  it("extracts both DB and EMAIL from production-style env", () => {
    const db = makeMockDB() as unknown as D1Database;
    const email = makeMockEmail() as unknown as SendEmail;
    const result = resolveAuthEnv({ DB: db, EMAIL: email });
    expect(result.DB).toBe(db);
    expect(result.EMAIL).toBe(email);
  });

  it("rejects DB binding without prepare method", () => {
    const result = resolveAuthEnv({ DB: { notPrepare: () => {} } });
    expect(result.DB).toBeUndefined();
  });

  it("rejects EMAIL binding without send method", () => {
    const result = resolveAuthEnv({ EMAIL: { notSend: () => {} } });
    expect(result.EMAIL).toBeUndefined();
  });

  it("preserves extra bindings without erroring", () => {
    const db = makeMockDB() as unknown as D1Database;
    const result = resolveAuthEnv({ DB: db, SHARE_BUCKET: {}, TURNSTILE_SECRET_KEY: "secret" });
    expect(result.DB).toBe(db);
    // Extra fields are not part of AuthEnv but the input is a Record — this
    // tests that we don't throw on unknown properties.
    expect((result as Record<string, unknown>).SHARE_BUCKET).toBeUndefined();
  });
});

describe("requireDB", () => {
  it("returns ok:true with env when DB is present", () => {
    const env = { DB: makeMockDB() as unknown as D1Database, EMAIL: undefined };
    const result = requireDB(env);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.env).toBe(env);
    }
  });

  it("returns structured failure when DB is missing", () => {
    const env = { DB: undefined, EMAIL: undefined };
    const result = requireDB(env);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.code).toBe("AUTH_DB_UNAVAILABLE");
      expect(typeof result.detail).toBe("string");
      expect(result.detail.length).toBeGreaterThan(0);
    }
  });
});

describe("requireEmail", () => {
  it("returns ok:true with env when EMAIL is present", () => {
    const env = { DB: undefined, EMAIL: makeMockEmail() as unknown as SendEmail };
    const result = requireEmail(env);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.env).toBe(env);
    }
  });

  it("returns structured failure when EMAIL is missing", () => {
    const env = { DB: undefined, EMAIL: undefined };
    const result = requireEmail(env);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.code).toBe("AUTH_EMAIL_NOT_CONFIGURED");
      expect(typeof result.detail).toBe("string");
    }
  });
});
