/**
 * Sync API — Structured Diagnostic Privacy Regression Tests
 *
 * Verifies that sync-api.ts structured logs never leak private data:
 *   - No raw userId, email, or hashed user identifiers
 *   - No reflection text or private sleep content
 *   - No cookies, session tokens, or authorization values
 *   - Failed requests emit sanitized errorCategory only
 *   - Validation rejections include safe counts, not payload content
 *   - Deletion events expose only counts and syncId
 *
 * Behavioral tests: invokes handleSync() directly and spies on
 * console.log / console.error to inspect emitted structured payloads.
 *
 * Static safety assertions: source-level checks for anti-patterns
 * (LOG_SALT, safeUserId, createHash for diagnostic identity, etc.).
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { handleSync, handleRestore } from "./sync-api";
import type { SyncRequest, SyncReflection, SyncSleepRecord } from "../sync-types";

// =============================================================================
// Mock DB modules
// =============================================================================

const mockGetSleepRecordsByUserId = vi.fn();
const mockUpsertSleepRecord = vi.fn();
const mockBatchUpsertSleepRecords = vi.fn();

const mockGetReflectionsByUserId = vi.fn();
const mockGetReflectionById = vi.fn();
const mockUpsertReflection = vi.fn();
const mockBatchUpsertReflections = vi.fn();
const mockDeleteReflection = vi.fn();

const mockGetReminderSettingsByUserId = vi.fn();
const mockUpsertReminderSettings = vi.fn();

const mockGetProgramProgressByUserId = vi.fn();
const mockUpsertProgramProgress = vi.fn();

const mockGetIdempotencyRecord = vi.fn();
const mockCreateIdempotencyRecord = vi.fn();
const mockLogSyncOperation = vi.fn();

const mockResolveSleepRecordConflict = vi.fn();
const mockResolveReflectionConflict = vi.fn();

vi.mock("../db/sleep-records-db", () => ({
  getSleepRecordsByUserId: (...args: unknown[]) => mockGetSleepRecordsByUserId(...args),
  upsertSleepRecord: (...args: unknown[]) => mockUpsertSleepRecord(...args),
  batchUpsertSleepRecords: (...args: unknown[]) => mockBatchUpsertSleepRecords(...args),
}));

vi.mock("../db/reflections-db", () => ({
  getReflectionsByUserId: (...args: unknown[]) => mockGetReflectionsByUserId(...args),
  getReflectionById: (...args: unknown[]) => mockGetReflectionById(...args),
  upsertReflection: (...args: unknown[]) => mockUpsertReflection(...args),
  batchUpsertReflections: (...args: unknown[]) => mockBatchUpsertReflections(...args),
  deleteReflection: (...args: unknown[]) => mockDeleteReflection(...args),
}));

vi.mock("../db/reminders-db", () => ({
  getReminderSettingsByUserId: (...args: unknown[]) => mockGetReminderSettingsByUserId(...args),
  upsertReminderSettings: (...args: unknown[]) => mockUpsertReminderSettings(...args),
}));

vi.mock("../db/program-progress-db", () => ({
  getProgramProgressByUserId: (...args: unknown[]) => mockGetProgramProgressByUserId(...args),
  upsertProgramProgress: (...args: unknown[]) => mockUpsertProgramProgress(...args),
}));

vi.mock("../db/sync-db", () => ({
  getIdempotencyRecord: (...args: unknown[]) => mockGetIdempotencyRecord(...args),
  createIdempotencyRecord: (...args: unknown[]) => mockCreateIdempotencyRecord(...args),
  logSyncOperation: (...args: unknown[]) => mockLogSyncOperation(...args),
}));

vi.mock("../sync-conflicts", () => ({
  resolveSleepRecordConflict: (...args: unknown[]) => mockResolveSleepRecordConflict(...args),
  resolveReflectionConflict: (...args: unknown[]) => mockResolveReflectionConflict(...args),
}));

// =============================================================================
// Test helpers
// =============================================================================

const TEST_USER_ID = "user_private_abc123";
const TEST_EMAIL = "private.user@example.com";
const TEST_SESSION_TOKEN = "sess_secret_token_xyz789";
const TEST_REFLECTION_CONTENT = "My deepest private thoughts about sleep anxiety";
const TEST_SLEEP_PRIVATE_NOTE = "Very personal note about insomnia trauma";

function makeMockEnv() {
  return {
    DB: {
      prepare: vi.fn(),
    } as any,
  };
}

function makeValidReflection(overrides: Partial<SyncReflection> = {}): SyncReflection {
  return {
    id: overrides.id ?? "ref_test_001",
    localDate: overrides.localDate ?? "2026-08-15",
    timezone: overrides.timezone ?? "America/New_York",
    locale: overrides.locale ?? "en",
    promptIds: overrides.promptIds ?? ["p1", "p2"],
    promptCategories: overrides.promptCategories ?? ["sleep-thoughts", "gratitude"],
    content: overrides.content ?? TEST_REFLECTION_CONTENT,
    wordCount: overrides.wordCount ?? 8,
    createdAt: overrides.createdAt ?? "2026-08-15T08:00:00.000Z",
    updatedAt: overrides.updatedAt ?? "2026-08-15T08:00:00.000Z",
    syncStatus: overrides.syncStatus ?? "pending",
  };
}

function makeValidSleepRecord(overrides: Partial<SyncSleepRecord> = {}): SyncSleepRecord {
  return {
    id: overrides.id ?? "sleep_test_001",
    date: overrides.date ?? "2026-08-15",
    timezone: overrides.timezone ?? "America/New_York",
    bedtime: overrides.bedtime ?? "23:00",
    wakeUpTime: overrides.wakeUpTime ?? "07:00",
    sleepLatency: overrides.sleepLatency ?? 15,
    nightAwakenings: overrides.nightAwakenings ?? 1,
    sleepQuality: overrides.sleepQuality ?? 3,
    mood: overrides.mood ?? 3,
    sleepEfficiency: overrides.sleepEfficiency ?? 85,
    sleepScore: overrides.sleepScore ?? 78,
    createdAt: overrides.createdAt ?? "2026-08-15T08:00:00.000Z",
    updatedAt: overrides.updatedAt ?? "2026-08-15T08:00:00.000Z",
    syncStatus: overrides.syncStatus ?? "pending",
  };
}

function makeSyncRequest(overrides: Partial<SyncRequest> = {}): SyncRequest {
  return {
    clientId: overrides.clientId ?? "client-device-abc",
    syncId: overrides.syncId ?? "sync_test_001",
    lastSyncAt: overrides.lastSyncAt,
    sleepRecords: overrides.sleepRecords ?? [makeValidSleepRecord()],
    reflections: overrides.reflections ?? [makeValidReflection()],
    reminderSettings: overrides.reminderSettings,
    programProgress: overrides.programProgress,
    deletedIds: overrides.deletedIds,
  };
}

function makeRequest(body: unknown, headers?: Record<string, string>): Request {
  return new Request("https://somna.help/api/sync", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

/**
 * Collect all structured log payloads emitted via console.log during a test.
 * Parses each call argument as JSON (the syncLog function always stringifies).
 */
function collectStructuredLogs(): Array<Record<string, unknown>> {
  const logs: Array<Record<string, unknown>> = [];
  const calls = (console.log as any).mock.calls as unknown[][];
  for (const call of calls) {
    const arg = call[0];
    if (typeof arg === "string") {
      try {
        const parsed = JSON.parse(arg);
        if (parsed && typeof parsed === "object" && parsed.source === "sync-api") {
          logs.push(parsed as Record<string, unknown>);
        }
      } catch {
        // Not JSON — not a structured sync log
      }
    }
  }
  return logs;
}

function findLogByEvent(logs: Array<Record<string, unknown>>, event: string) {
  return logs.find((l) => l.event === event);
}

/**
 * Assert that a structured log payload does NOT contain any of the
 * forbidden private strings. Checks both keys and string values recursively.
 */
function assertNoPrivateData(log: Record<string, unknown>, forbidden: string[]): void {
  const seen = new WeakSet<object>();
  function check(value: unknown): void {
    if (value == null) return;
    if (typeof value === "string") {
      const lower = value.toLowerCase();
      for (const item of forbidden) {
        if (lower.includes(item.toLowerCase())) {
          throw new Error(
            `Forbidden private data found in log: "${item}" (in value: "${value.slice(0, 120)}")`,
          );
        }
      }
      return;
    }
    if (typeof value === "object") {
      if (seen.has(value as object)) return;
      seen.add(value as object);
      if (Array.isArray(value)) {
        for (const item of value) check(item);
      } else {
        for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
          // Check keys too
          for (const item of forbidden) {
            if (k.toLowerCase().includes(item.toLowerCase())) {
              throw new Error(`Forbidden private data found in log key: "${k}" (event payload)`);
            }
          }
          check(v);
        }
      }
    }
  }
  check(log);
}

// =============================================================================
// Test suite
// =============================================================================

describe("Sync API — Structured Diagnostic Privacy", () => {
  let originalLog: typeof console.log;
  let originalError: typeof console.error;

  beforeEach(() => {
    vi.clearAllMocks();

    // Default mocks: empty server state, successful DB operations
    mockGetSleepRecordsByUserId.mockResolvedValue([]);
    mockGetReflectionsByUserId.mockResolvedValue([]);
    mockGetReflectionById.mockResolvedValue(null);
    mockGetReminderSettingsByUserId.mockResolvedValue(null);
    mockGetProgramProgressByUserId.mockResolvedValue(null);

    mockUpsertSleepRecord.mockImplementation(
      (_env: unknown, _userId: unknown, record: SyncSleepRecord) =>
        Promise.resolve({ ...record, syncStatus: "synced" as const }),
    );
    mockUpsertReflection.mockImplementation(
      (_env: unknown, _userId: unknown, reflection: SyncReflection) =>
        Promise.resolve({ ...reflection, syncStatus: "synced" as const }),
    );
    mockUpsertReminderSettings.mockResolvedValue({
      id: "reminder_test",
      enabled: true,
      morningTime: "07:00",
      eveningTime: "22:00",
      weeklyDay: "Sunday",
      timezone: "UTC",
      language: "en",
      updatedAt: new Date().toISOString(),
    });
    mockUpsertProgramProgress.mockResolvedValue(null);

    mockDeleteReflection.mockResolvedValue(true);

    mockGetIdempotencyRecord.mockResolvedValue(null);
    mockCreateIdempotencyRecord.mockResolvedValue({
      key: "idem-test",
      syncId: "sync_test_001",
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 86400000).toISOString(),
    });
    mockLogSyncOperation.mockResolvedValue(undefined);

    mockResolveSleepRecordConflict.mockReturnValue({
      resolved: makeValidSleepRecord({ syncStatus: "synced" }),
      conflict: null,
      strategy: "server-wins",
    });
    mockResolveReflectionConflict.mockReturnValue({
      resolved: makeValidReflection({ syncStatus: "synced" }),
      conflict: null,
      strategy: "server-wins",
    });

    // Spy on console methods
    originalLog = console.log;
    originalError = console.error;
    console.log = vi.fn();
    console.error = vi.fn();
  });

  afterEach(() => {
    console.log = originalLog;
    console.error = originalError;
  });

  // ===========================================================================
  // 1. Successful reflection upload
  // ===========================================================================
  describe("successful reflection upload", () => {
    it("structured log includes event name, syncId and safe record counts", async () => {
      const env = makeMockEnv();
      const req = makeSyncRequest({
        syncId: "sync_upload_success_001",
        reflections: [
          makeValidReflection({ id: "ref_s1", localDate: "2026-08-14" }),
          makeValidReflection({ id: "ref_s2", localDate: "2026-08-13" }),
        ],
        sleepRecords: [makeValidSleepRecord({ id: "sleep_s1", date: "2026-08-14" })],
      });
      const request = makeRequest(req);

      // Server has no existing records — these are all new
      mockGetReflectionsByUserId.mockResolvedValue([]);
      mockGetSleepRecordsByUserId.mockResolvedValue([]);

      const response = await handleSync(env, TEST_USER_ID, request);
      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body.success).toBe(true);

      const logs = collectStructuredLogs();
      expect(logs.length).toBeGreaterThan(0);

      // reflection_upload_requested event
      const requested = findLogByEvent(logs, "reflection_upload_requested");
      expect(requested).toBeDefined();
      expect(requested!.syncId).toBe("sync_upload_success_001");
      expect(requested!.reflectionCount).toBe(2);
      expect(requested!.sleepRecordCount).toBe(1);

      // reflection_upload_accepted event
      const accepted = findLogByEvent(logs, "reflection_upload_accepted");
      expect(accepted).toBeDefined();
      expect(accepted!.syncId).toBe("sync_upload_success_001");
      expect(typeof accepted!.serverReflectionCount).toBe("number");
      expect(typeof accepted!.serverSleepRecordCount).toBe("number");
      expect(typeof accepted!.conflictCount).toBe("number");
    });

    it("log does not include raw userId", async () => {
      const env = makeMockEnv();
      const req = makeSyncRequest({
        syncId: "sync_no_userid_001",
        reflections: [makeValidReflection()],
      });
      const request = makeRequest(req);

      await handleSync(env, TEST_USER_ID, request);

      const logs = collectStructuredLogs();
      for (const log of logs) {
        assertNoPrivateData(log, [TEST_USER_ID, "user_private"]);
        // Explicitly check no userId property
        expect(log).not.toHaveProperty("userId");
        expect(log).not.toHaveProperty("user_id");
      }
    });

    it("log does not include email", async () => {
      const env = makeMockEnv();
      const req = makeSyncRequest({
        syncId: "sync_no_email_001",
        reflections: [makeValidReflection()],
      });
      const request = makeRequest(req, {
        // Simulate an email header that might be present
        "x-forwarded-email": TEST_EMAIL,
      });

      await handleSync(env, TEST_USER_ID, request);

      const logs = collectStructuredLogs();
      for (const log of logs) {
        assertNoPrivateData(log, [TEST_EMAIL, "private.user@example.com"]);
      }
    });

    it("log does not include Reflection text or private sleep content", async () => {
      const env = makeMockEnv();
      const req = makeSyncRequest({
        syncId: "sync_no_content_001",
        reflections: [
          makeValidReflection({
            id: "ref_private",
            content: TEST_REFLECTION_CONTENT,
          }),
        ],
        sleepRecords: [
          makeValidSleepRecord({
            id: "sleep_private",
            // Sleep records don't have a "content" field per se,
            // but we ensure the log never includes structured data
            // that could leak subjective values.
          }),
        ],
      });
      const request = makeRequest(req);

      await handleSync(env, TEST_USER_ID, request);

      const logs = collectStructuredLogs();
      const forbiddenPhrases = [
        TEST_REFLECTION_CONTENT,
        "deepest private thoughts",
        "sleep anxiety",
        TEST_SLEEP_PRIVATE_NOTE,
      ];
      for (const log of logs) {
        assertNoPrivateData(log, forbiddenPhrases);
        // Also check that content/prompt fields that could hold text are absent
        expect(log).not.toHaveProperty("content");
        expect(log).not.toHaveProperty("text");
        expect(log).not.toHaveProperty("body");
        expect(log).not.toHaveProperty("promptIds");
        expect(log).not.toHaveProperty("promptCategories");
      }
    });

    it("log does not include cookies, session tokens or authorization values", async () => {
      const env = makeMockEnv();
      const req = makeSyncRequest({
        syncId: "sync_no_tokens_001",
        reflections: [makeValidReflection()],
      });
      const request = makeRequest(req, {
        cookie: `somna_session=${TEST_SESSION_TOKEN}; other_cookie=value123`,
        authorization: `Bearer ${TEST_SESSION_TOKEN}`,
        "x-auth-token": TEST_SESSION_TOKEN,
      });

      await handleSync(env, TEST_USER_ID, request);

      const logs = collectStructuredLogs();
      const forbidden = [TEST_SESSION_TOKEN, "somna_session=", "Bearer ", "x-auth-token"];
      for (const log of logs) {
        assertNoPrivateData(log, forbidden);
        expect(log).not.toHaveProperty("cookie");
        expect(log).not.toHaveProperty("cookies");
        expect(log).not.toHaveProperty("authorization");
        expect(log).not.toHaveProperty("token");
        expect(log).not.toHaveProperty("sessionToken");
      }
    });
  });

  // ===========================================================================
  // 2. Failed reflection upload
  // ===========================================================================
  describe("failed reflection upload", () => {
    it("structured failure log contains a sanitized errorCategory", async () => {
      const env = makeMockEnv();
      const req = makeSyncRequest({
        syncId: "sync_fail_category_001",
        reflections: [makeValidReflection()],
      });
      const request = makeRequest(req);

      // Make DB throw with a sensitive error message
      mockGetReflectionsByUserId.mockRejectedValue(
        new Error("database connection failed for user user_private_abc123"),
      );

      const response = await handleSync(env, TEST_USER_ID, request);
      expect(response.status).toBe(500);

      const logs = collectStructuredLogs();
      const failed = findLogByEvent(logs, "reflection_upload_failed");
      expect(failed).toBeDefined();
      expect(failed!.errorCategory).toBeDefined();
      expect(typeof failed!.errorCategory).toBe("string");
      // Must be one of the known safe categories
      const knownCategories = [
        "database_error",
        "write_error",
        "network_error",
        "validation_error",
        "timeout",
        "server_error",
        "unknown",
      ];
      expect(knownCategories).toContain(failed!.errorCategory);
    });

    it("raw Error.message is not logged in structured logs", async () => {
      const env = makeMockEnv();
      const sensitiveMsg = `fatal error: userId=${TEST_USER_ID}, email=${TEST_EMAIL}, token=${TEST_SESSION_TOKEN}`;
      const req = makeSyncRequest({
        syncId: "sync_fail_raw_msg_001",
        reflections: [makeValidReflection()],
      });
      const request = makeRequest(req);

      mockGetReflectionsByUserId.mockRejectedValue(new Error(sensitiveMsg));

      await handleSync(env, TEST_USER_ID, request);

      const logs = collectStructuredLogs();
      const failed = findLogByEvent(logs, "reflection_upload_failed");
      expect(failed).toBeDefined();

      // Structured log must not contain raw error message
      const logStr = JSON.stringify(failed);
      expect(logStr).not.toContain(TEST_USER_ID);
      expect(logStr).not.toContain(TEST_EMAIL);
      expect(logStr).not.toContain(TEST_SESSION_TOKEN);
      expect(logStr).not.toContain("fatal error");
    });

    it("SQL/database details and stack traces are not logged", async () => {
      const env = makeMockEnv();
      const errorWithStack = new Error(
        "SQL syntax error: SELECT * FROM users WHERE id = 'user_private_abc123'",
      );
      errorWithStack.stack = `Error: SQL syntax error
  at Statement.run (database.js:42:15)
  at getReflectionsByUserId (reflections-db.ts:48:22)
  at processSync (sync-api.ts:227:42)`;

      const req = makeSyncRequest({
        syncId: "sync_fail_sql_001",
        reflections: [makeValidReflection()],
      });
      const request = makeRequest(req);

      mockGetReflectionsByUserId.mockRejectedValue(errorWithStack);

      await handleSync(env, TEST_USER_ID, request);

      const logs = collectStructuredLogs();
      const failed = findLogByEvent(logs, "reflection_upload_failed");
      expect(failed).toBeDefined();

      const logStr = JSON.stringify(failed).toLowerCase();
      expect(logStr).not.toContain("sql syntax");
      expect(logStr).not.toContain("select * from");
      expect(logStr).not.toContain("at statement.run");
      expect(logStr).not.toContain("database.js:42");
      expect(logStr).not.toContain("stack");
    });

    it("API response behavior remains unchanged on failure", async () => {
      const env = makeMockEnv();
      const req = makeSyncRequest({
        syncId: "sync_fail_response_001",
        reflections: [makeValidReflection()],
      });
      const request = makeRequest(req);

      mockGetReflectionsByUserId.mockRejectedValue(new Error("database unavailable"));

      const response = await handleSync(env, TEST_USER_ID, request);

      // Response must be 500 with structured error — same as API contract
      expect(response.status).toBe(500);
      const body = await response.json();
      expect(body.success).toBe(false);
      expect(body.error).toBe("server_error");
      expect(body.message).toBe("Sync operation failed");
      expect(body.syncId).toBe("sync_fail_response_001");
      expect(body).toHaveProperty("serverTime");
    });

    it("categorizeError maps database errors correctly", async () => {
      const env = makeMockEnv();
      const req = makeSyncRequest({
        syncId: "sync_fail_categorize_001",
        reflections: [makeValidReflection()],
      });

      mockGetReflectionsByUserId.mockRejectedValue(new Error("D1 database connection lost"));

      await handleSync(env, TEST_USER_ID, makeRequest(req));

      const logs = collectStructuredLogs();
      const failed = findLogByEvent(logs, "reflection_upload_failed");
      expect(failed!.errorCategory).toBe("database_error");
    });

    it("categorizeError maps write errors correctly", async () => {
      const env = makeMockEnv();
      const req = makeSyncRequest({
        syncId: "sync_fail_categorize_002",
        reflections: [makeValidReflection()],
      });

      mockUpsertReflection.mockRejectedValue(new Error("Failed to insert reflection record"));

      await handleSync(env, TEST_USER_ID, makeRequest(req));

      const logs = collectStructuredLogs();
      const failed = findLogByEvent(logs, "reflection_upload_failed");
      expect(failed!.errorCategory).toBe("write_error");
    });

    it("categorizeError maps network errors correctly", async () => {
      const env = makeMockEnv();
      const req = makeSyncRequest({
        syncId: "sync_fail_categorize_003",
        reflections: [makeValidReflection()],
      });

      mockGetReflectionsByUserId.mockRejectedValue(new Error("fetch failed: network timeout"));

      await handleSync(env, TEST_USER_ID, makeRequest(req));

      const logs = collectStructuredLogs();
      const failed = findLogByEvent(logs, "reflection_upload_failed");
      expect(failed!.errorCategory).toBe("network_error");
    });
  });

  // ===========================================================================
  // 3. Reflection deletion
  // ===========================================================================
  describe("reflection deletion", () => {
    it("deletion event contains syncId and deletion count", async () => {
      const env = makeMockEnv();
      const req = makeSyncRequest({
        syncId: "sync_delete_001",
        reflections: [],
        sleepRecords: [],
        deletedIds: {
          sleepRecords: [],
          reflections: ["ref_del_1", "ref_del_2", "ref_del_3"],
        },
      });
      const request = makeRequest(req);

      // All three reflections exist and are deleted
      mockGetReflectionById.mockResolvedValue({
        id: "ref_del_1",
        localDate: "2026-08-10",
        content: TEST_REFLECTION_CONTENT,
        syncStatus: "synced",
      });
      mockDeleteReflection.mockResolvedValue(true);

      const response = await handleSync(env, TEST_USER_ID, request);
      expect(response.status).toBe(200);

      const logs = collectStructuredLogs();
      const deletionLog = findLogByEvent(logs, "reflection_deletions_processed");
      expect(deletionLog).toBeDefined();
      expect(deletionLog!.syncId).toBe("sync_delete_001");
      expect(deletionLog!.deletedCount).toBe(3);
      expect(deletionLog!.requestedCount).toBe(3);
    });

    it("deletion event does not contain raw or hashed user identifiers", async () => {
      const env = makeMockEnv();
      const req = makeSyncRequest({
        syncId: "sync_delete_nouser_001",
        reflections: [],
        sleepRecords: [],
        deletedIds: {
          sleepRecords: [],
          reflections: ["ref_del_hash_1"],
        },
      });
      const request = makeRequest(req);

      mockGetReflectionById.mockResolvedValue({
        id: "ref_del_hash_1",
        localDate: "2026-08-10",
        content: "to delete",
        syncStatus: "synced",
      });

      await handleSync(env, TEST_USER_ID, request);

      const logs = collectStructuredLogs();
      const deletionLog = findLogByEvent(logs, "reflection_deletions_processed");
      expect(deletionLog).toBeDefined();

      // No userId-related keys or values
      expect(deletionLog).not.toHaveProperty("userId");
      expect(deletionLog).not.toHaveProperty("user_id");
      expect(deletionLog).not.toHaveProperty("user");
      expect(deletionLog).not.toHaveProperty("safeUserId");
      expect(deletionLog).not.toHaveProperty("hashedUserId");

      const logStr = JSON.stringify(deletionLog).toLowerCase();
      expect(logStr).not.toContain(TEST_USER_ID.toLowerCase());
      expect(logStr).not.toContain("user_private");
    });

    it("deletion event does not contain deleted Reflection content", async () => {
      const env = makeMockEnv();
      const privateReflection = makeValidReflection({
        id: "ref_del_private",
        content: "My darkest secret about sleep paralysis and trauma",
        localDate: "2026-08-09",
      });
      const req = makeSyncRequest({
        syncId: "sync_delete_nocontent_001",
        reflections: [],
        sleepRecords: [],
        deletedIds: {
          sleepRecords: [],
          reflections: ["ref_del_private"],
        },
      });
      const request = makeRequest(req);

      mockGetReflectionById.mockResolvedValue(privateReflection);
      mockDeleteReflection.mockResolvedValue(true);

      await handleSync(env, TEST_USER_ID, request);

      const logs = collectStructuredLogs();
      const deletionLog = findLogByEvent(logs, "reflection_deletions_processed");
      expect(deletionLog).toBeDefined();

      const logStr = JSON.stringify(deletionLog);
      expect(logStr).not.toContain("darkest secret");
      expect(logStr).not.toContain("sleep paralysis");
      expect(logStr).not.toContain("trauma");
      expect(deletionLog).not.toHaveProperty("content");
      expect(deletionLog).not.toHaveProperty("text");
    });
  });

  // ===========================================================================
  // 4. Validation rejection
  // ===========================================================================
  describe("validation rejection", () => {
    it("rejection log contains safe counts and validation category only", async () => {
      const env = makeMockEnv();
      const invalidPayload = {
        clientId: "test-client",
        syncId: "sync_validation_001",
        reflections: [
          {
            // Completely invalid: missing required fields
            bogus: "value",
          },
          {
            id: "ref_partial",
            content: "partial invalid data",
          },
        ],
        sleepRecords: [],
      };
      const request = makeRequest(invalidPayload);

      const response = await handleSync(env, TEST_USER_ID, request);
      expect(response.status).toBe(400);

      const logs = collectStructuredLogs();
      const rejected = findLogByEvent(logs, "reflection_upload_rejected");
      expect(rejected).toBeDefined();
      expect(rejected!.syncId).toBe("sync_validation_001");
      expect(rejected!.reason).toBe("validation_failed");
      expect(typeof rejected!.reflectionCount).toBe("number");
      expect(typeof rejected!.errorCount).toBe("number");
    });

    it("invalid private payload content is not copied into logs", async () => {
      const env = makeMockEnv();
      const privateSensitiveContent =
        "SSN 123-45-6789 my credit card 4111-1111-1111-1111 private medical record";
      const invalidPayload = {
        clientId: "client-bad-001",
        syncId: "sync_validation_leak_001",
        reflections: [
          {
            id: "ref_bad",
            localDate: "not-a-date", // invalid
            timezone: "UTC",
            locale: "invalid-locale", // invalid
            promptIds: "not-an-array", // invalid
            promptCategories: "not-an-array", // invalid
            content: privateSensitiveContent,
            wordCount: -999, // invalid
          },
        ],
        sleepRecords: [],
      };
      const request = makeRequest(invalidPayload);

      await handleSync(env, TEST_USER_ID, request);

      const logs = collectStructuredLogs();
      const rejected = findLogByEvent(logs, "reflection_upload_rejected");
      expect(rejected).toBeDefined();

      const logStr = JSON.stringify(rejected);
      // Sensitive content must NOT appear anywhere in the log
      expect(logStr).not.toContain("123-45-6789");
      expect(logStr).not.toContain("4111-1111-1111-1111");
      expect(logStr).not.toContain("credit card");
      expect(logStr).not.toContain("medical record");
      expect(logStr).not.toContain(privateSensitiveContent);
      // No content field in log
      expect(rejected).not.toHaveProperty("content");
    });

    it("validation rejection returns 400 with errors but no private data in response", async () => {
      const env = makeMockEnv();
      const invalidPayload = {
        clientId: "c1",
        syncId: "sync_val_response_001",
        reflections: [
          {
            id: "ref_bad_response",
            content: "super secret data that should not be echoed",
            localDate: "invalid",
          },
        ],
        sleepRecords: [],
      };
      const request = makeRequest(invalidPayload);

      const response = await handleSync(env, TEST_USER_ID, request);
      expect(response.status).toBe(400);

      const body = await response.json();
      expect(body.success).toBe(false);
      expect(body.errors).toBeDefined();
      expect(Array.isArray(body.errors)).toBe(true);

      // Response errors should contain error codes, not private content
      const bodyStr = JSON.stringify(body);
      expect(bodyStr).not.toContain("super secret data");
    });
  });

  // ===========================================================================
  // 5. handleRestore — pull endpoint privacy
  // ===========================================================================
  describe("handleRestore — pull endpoint privacy", () => {
    it("restore completed log includes safe counts only, no content", async () => {
      const env = makeMockEnv();
      mockGetReflectionsByUserId.mockResolvedValue([
        makeValidReflection({ id: "ref_pull_1", localDate: "2026-08-14" }),
        makeValidReflection({ id: "ref_pull_2", localDate: "2026-08-13" }),
      ]);
      mockGetSleepRecordsByUserId.mockResolvedValue([
        makeValidSleepRecord({ id: "sleep_pull_1", date: "2026-08-14" }),
      ]);

      const response = await handleRestore(env, TEST_USER_ID);
      expect(response.status).toBe(200);

      const logs = collectStructuredLogs();
      const pullCompleted = findLogByEvent(logs, "reflection_pull_completed");
      expect(pullCompleted).toBeDefined();
      expect(pullCompleted!.remoteReflectionCount).toBe(2);
      expect(pullCompleted!.remoteSleepRecordCount).toBe(1);

      // No content or user identifiers
      const logStr = JSON.stringify(pullCompleted);
      expect(logStr).not.toContain(TEST_USER_ID);
      expect(logStr).not.toContain(TEST_REFLECTION_CONTENT);
      expect(logStr).not.toContain("deepest private thoughts");
      expect(pullCompleted).not.toHaveProperty("content");
      expect(pullCompleted).not.toHaveProperty("userId");
    });

    it("restore failure log uses sanitized errorCategory", async () => {
      const env = makeMockEnv();
      mockGetReflectionsByUserId.mockRejectedValue(
        new Error(`database error for user ${TEST_USER_ID} with token ${TEST_SESSION_TOKEN}`),
      );

      const response = await handleRestore(env, TEST_USER_ID);
      expect(response.status).toBe(500);

      const logs = collectStructuredLogs();
      const failed = findLogByEvent(logs, "reflection_pull_failed");
      expect(failed).toBeDefined();
      expect(failed!.errorCategory).toBe("database_error");

      const logStr = JSON.stringify(failed);
      expect(logStr).not.toContain(TEST_USER_ID);
      expect(logStr).not.toContain(TEST_SESSION_TOKEN);
    });
  });
});

// =============================================================================
// Static safety assertions
// =============================================================================

describe("Sync API — Static Safety Assertions", () => {
  const sourcePath = path.join(__dirname, "sync-api.ts");
  const source = fs.readFileSync(sourcePath, "utf-8");

  it("no LOG_SALT constant or variable", () => {
    // A log salt would be used to hash user IDs into diagnostic logs.
    // We explicitly don't want that pattern — no pseudo-anonymized IDs in logs.
    expect(source).not.toMatch(/LOG_SALT\b/);
    expect(source).not.toMatch(/logSalt\b/);
    expect(source).not.toMatch(/log_salt\b/);
  });

  it("no hard-coded fallback salt string", () => {
    // No static salt value that could be used to derive hashed identities
    // for diagnostic logging purposes.
    expect(source).not.toMatch(/["']salt["']\s*[:=]/);
    expect(source).not.toMatch(/fallback\s*[sS]alt/);
    expect(source).not.toMatch(/default\s*[sS]alt/);
  });

  it("no safeUserId function or variable", () => {
    // "safeUserId" would be a red flag — it implies hashing userId for logs
    // which we explicitly avoid.
    expect(source).not.toMatch(/safeUserId\b/);
    expect(source).not.toMatch(/safe_user_id\b/);
    expect(source).not.toMatch(/sanitizedUserId\b/);
    expect(source).not.toMatch(/hashedUserId\b/);
  });

  it("no createHash or crypto hash solely for diagnostic identity", () => {
    // We don't import or use crypto.createHash for log identity purposes.
    // Note: the codebase may use hashing elsewhere (auth), but not in sync-api.
    expect(source).not.toMatch(/\bcreateHash\b/);
    expect(source).not.toMatch(/\bcrypto\.createHash\b/);
    expect(source).not.toMatch(/require\(["']crypto["']\)/);
    expect(source).not.toMatch(/from\s+["']crypto["']/);
    // No sha256 / sha512 / md5 references in this file
    expect(source).not.toMatch(/\bsha256\b/i);
    expect(source).not.toMatch(/\bsha512\b/i);
    expect(source).not.toMatch(/\bmd5\b/i);
  });

  it("no userId property in syncLog payloads", () => {
    // Parse all syncLog() call sites (not the function definition) and verify
    // none include userId directly. Call sites use syncLog("eventName", { ... }).
    //
    // We use a balanced-brace approach: find each syncLog(" then walk forward
    // counting braces to find the matching closing });
    const calls: string[] = [];
    const pattern = /syncLog\(\s*"/g;
    let match;
    while ((match = pattern.exec(source)) !== null) {
      const start = match.index;
      // Find the opening brace of the data object (second argument)
      const braceStart = source.indexOf("{", start);
      if (braceStart === -1) continue;
      // Walk forward counting braces
      let depth = 0;
      let i = braceStart;
      for (; i < source.length; i++) {
        if (source[i] === "{") depth++;
        if (source[i] === "}") {
          depth--;
          if (depth === 0) break;
        }
      }
      // Include the closing });
      const end = source.indexOf(";", i);
      if (end !== -1) {
        calls.push(source.slice(start, end + 1));
      }
    }

    expect(calls.length).toBeGreaterThan(0);

    for (const call of calls) {
      // Check no userId key in the data object
      expect(call).not.toMatch(/userId\s*:/);
      expect(call).not.toMatch(/user_id\s*:/);
    }
  });

  it("syncLog function signature accepts event + data, no userId param", () => {
    // The syncLog helper itself does not take a userId parameter.
    const match = source.match(/function syncLog\([^)]+\)/);
    expect(match).toBeTruthy();
    const sig = match![0];
    expect(sig).not.toMatch(/userId/);
    expect(sig).not.toMatch(/user_id/);
    expect(sig).toMatch(/event/);
    expect(sig).toMatch(/data/);
  });

  it("categorizeError never returns raw error.message", () => {
    // categorizeError maps to a fixed set of category strings.
    // It must never return or interpolate error.message.
    const fnMatch = source.match(/function categorizeError[\s\S]*?^\}/m);
    expect(fnMatch).toBeTruthy();
    const fn = fnMatch![0];

    // Must not return error.message or any interpolation of msg
    expect(fn).not.toMatch(/return\s+.*\.message/);
    expect(fn).not.toMatch(/return\s+.*error\s*\+/);
    expect(fn).not.toMatch(/return\s+msg/);

    // Must return one of the known category strings
    const returnStatements = fn.match(/return\s+["'][^"']+["']/g) || [];
    expect(returnStatements.length).toBeGreaterThan(0);
    const knownCategories = [
      "unknown",
      "database_error",
      "write_error",
      "network_error",
      "validation_error",
      "timeout",
      "server_error",
    ];
    for (const ret of returnStatements) {
      const cat = ret.match(/return\s+["']([^"']+)["']/)?.[1];
      expect(cat).toBeTruthy();
      expect(knownCategories).toContain(cat);
    }
  });

  it("no console.log with user identifiers or reflection content directly", () => {
    // Scan all console.log calls in the file.
    // The only console.log should be inside syncLog() which stringifies
    // a sanitized data object.
    const consoleLogLines = source.match(/console\.log\([\s\S]*?\);/g) || [];
    expect(consoleLogLines.length).toBeGreaterThan(0);

    for (const call of consoleLogLines) {
      // Must not log userId, email, content directly
      expect(call).not.toMatch(/\buserId\b/);
      expect(call).not.toMatch(/\bemail\b/);
      expect(call).not.toMatch(/\bcontent\b/);
      expect(call).not.toMatch(/\btoken\b/);
      expect(call).not.toMatch(/\bcookie\b/i);
    }
  });

  it("handleSync receives userId as parameter (from auth, not from payload)", () => {
    // Critical security invariant: userId comes from session/auth,
    // never from the client request body.
    expect(source).toMatch(/export async function handleSync\([\s\S]*?userId: string/);
    // It also takes a Request — the function signature shows userId is
    // separate from the request payload.
    expect(source).toMatch(/handleSync\([\s\S]*request: Request/);
  });
});
