/**
 * Reminder Service — the single entry point for reminder operations.
 *
 * The Dashboard UI talks only to this service. It delegates to the registered
 * provider (Phase 1: email stub), keeping the UI decoupled from delivery
 * channels. Future providers (Web Push, WeChat, Calendar, Mobile Push) can be
 * registered here without touching Dashboard code.
 */
import type { ReminderPayload, ReminderProvider, ReminderSettings } from "./reminder-types";
import { emailProvider } from "./email-provider";

/** Registry of available providers, keyed by id. */
const providers = new Map<string, ReminderProvider>();

// Register the Phase 1 email provider.
providers.set(emailProvider.id, emailProvider);

/** Get a provider by id. Throws if not found (programming error). */
export function getProvider(id: string): ReminderProvider {
  const p = providers.get(id);
  if (!p) throw new Error(`Unknown reminder provider: ${id}`);
  return p;
}

/** List all registered provider ids. */
export function listProviderIds(): string[] {
  return Array.from(providers.keys());
}

/**
 * Validate settings against a specific provider.
 * Returns `{ valid: true }` or `{ valid: false, error }` with an i18n key.
 */
export function validateForProvider(
  providerId: string,
  settings: ReminderSettings,
): { valid: boolean; error?: string } {
  return getProvider(providerId).validate(settings);
}

/**
 * Prepare a reminder payload for delivery (Phase 1: no-op passthrough).
 * Future phases will localize content and inject Sleep Diary / CBT-I data.
 */
export function prepareReminder(providerId: string, payload: ReminderPayload): ReminderPayload {
  return getProvider(providerId).prepare(payload);
}

/**
 * Send a reminder through the given provider.
 * Phase 1: stub resolves immediately. Future: real network delivery.
 */
export async function sendReminder(
  providerId: string,
  payload: ReminderPayload,
): Promise<{ success: boolean; error?: string }> {
  try {
    return await getProvider(providerId).send(payload);
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}
