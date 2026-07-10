import { createHash } from "node:crypto";
import { buildReminderRecord, type ReminderRecord } from "./reminder-model";

const REMINDER_STORAGE_KEY = "reminder:settings";
const REMINDER_LOG_KEY = "reminder:log";

type MemoryStore = Map<string, string>;

type StorageLike = {
  get: (key: string) => Promise<string | null> | string | null;
  put: (key: string, value: string) => Promise<void> | void;
};

function getStorage(env: Record<string, unknown>): StorageLike | null {
  const storage = env?.REMINDER_KV as StorageLike | undefined;
  if (typeof storage?.get === "function" && typeof storage?.put === "function") return storage;

  const memory = globalThis as typeof globalThis & { __somnaReminderStore?: MemoryStore };
  if (!memory.__somnaReminderStore) memory.__somnaReminderStore = new Map<string, string>();

  return {
    async get(key: string) {
      return memory.__somnaReminderStore?.get(key) ?? null;
    },
    async put(key: string, value: string) {
      memory.__somnaReminderStore?.set(key, value);
    },
  };
}

export async function saveReminderSettingsServer(
  env: Record<string, unknown>,
  input: { email: string; enabled: boolean; time: string; timezone?: string; language?: string },
): Promise<ReminderRecord> {
  const storage = getStorage(env);
  const record = buildReminderRecord(input);
  if (storage?.put) {
    await storage.put(REMINDER_STORAGE_KEY, JSON.stringify(record));
  }
  return record;
}

export async function getReminderSettingsServer(env: Record<string, unknown>): Promise<ReminderRecord | null> {
  const storage = getStorage(env);
  if (!storage?.get) return null;
  const raw = await storage.get(REMINDER_STORAGE_KEY);
  if (!raw) return null;
  return JSON.parse(raw) as ReminderRecord;
}

export async function deleteReminderSettingsServer(env: Record<string, unknown>, id: string): Promise<boolean> {
  const storage = getStorage(env);
  if (!storage) return false;
  const current = await getReminderSettingsServer(env);
  if (current && current.id === id) {
    await storage.put(REMINDER_STORAGE_KEY, JSON.stringify({ id, enabled: false, deleted: true }));
    return true;
  }
  return false;
}

export async function appendReminderLog(env: Record<string, unknown>, record: ReminderRecord, status: string, provider: string, error?: string) {
  const storage = getStorage(env);
  if (!storage?.put) return;
  const entry = {
    id: `log_${createHash("sha256").update(`${record.email}:${Date.now()}`).digest("hex").slice(0, 12)}`,
    emailHash: record.emailHash,
    sentAt: new Date().toISOString(),
    status,
    provider,
    error: error ?? null,
  };
  const existing = (await storage.get(REMINDER_LOG_KEY)) ?? "[]";
  const parsed = JSON.parse(existing) as Array<Record<string, string | null>>;
  parsed.push(entry);
  await storage.put(REMINDER_LOG_KEY, JSON.stringify(parsed.slice(-50)));
}
