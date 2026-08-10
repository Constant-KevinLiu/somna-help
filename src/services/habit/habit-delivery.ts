/**
 * Habit Engine — Delivery Service
 *
 * Orchestrates reminder delivery through available channels.
 * Handles:
 * - Delivery decision rules
 * - Channel fallback
 * - Duplicate delivery prevention
 * - Multi-tab coordination
 * - Idempotency
 */
import {
  type Reminder,
  type ReminderOccurrence,
  type ReminderChannel,
  type DeliveryResult,
} from "./habit-types";
import { loadReminders, getUndeliveredDueOccurrences, updateOccurrence } from "./habit-storage";
import { logOccurrenceDelivered, logOccurrenceMissed } from "./habit-events";
import { deliverBrowserNotification, isChannelAvailable } from "./notification-service";
import {
  isBrowser,
  getSharedBroadcastChannel,
  safeLocalStorageGet,
  safeLocalStorageRemove,
  safeLocalStorageSet,
} from "@/lib/safe-storage";

// ============================================
// Multi-Tab Coordination
// ============================================
const DELIVERY_LOCK_KEY = "somna-delivery-lock";
const LOCK_TIMEOUT = 5000; // 5 seconds
const BROADCAST_CHANNEL_NAME = "somna-habit-engine";

function getBroadcastChannel(): BroadcastChannel | null {
  return getSharedBroadcastChannel(BROADCAST_CHANNEL_NAME);
}

export function notifyDelivery(occurrenceId: string): void {
  const channel = getBroadcastChannel();
  if (channel) {
    channel.postMessage({ type: "delivered", occurrenceId });
  }
}

export function subscribeToRemoteDeliveries(callback: (occurrenceId: string) => void): () => void {
  const channel = getBroadcastChannel();
  if (!channel) return () => {};

  const handler = (event: MessageEvent) => {
    if (event.data.type === "delivered") {
      callback(event.data.occurrenceId);
    }
  };

  channel.addEventListener("message", handler);
  return () => channel.removeEventListener("message", handler);
}

// ============================================
// Delivery Lock (Prevent duplicate delivery across tabs)
// ============================================
function acquireDeliveryLock(occurrenceId: string): boolean {
  if (!isBrowser()) return true; // SSR: proceed without locking

  const lockKey = `${DELIVERY_LOCK_KEY}:${occurrenceId}`;
  const now = Date.now();
  const existingLock = safeLocalStorageGet<string | null>(lockKey, null);

  if (existingLock) {
    const lockTime = parseInt(existingLock, 10);
    if (!isNaN(lockTime) && now - lockTime < LOCK_TIMEOUT) {
      return false; // Lock held by another tab
    }
  }

  safeLocalStorageSet(lockKey, now.toString());
  return true;
}

function releaseDeliveryLock(occurrenceId: string): void {
  const lockKey = `${DELIVERY_LOCK_KEY}:${occurrenceId}`;
  safeLocalStorageRemove(lockKey);
}

// ============================================
// Delivery Decision Rules
// ============================================
export function shouldDeliverOccurrence(
  reminder: Reminder,
  occurrence: ReminderOccurrence,
): boolean {
  // Reminder must be active
  if (reminder.status !== "active") return false;

  // Occurrence must be due
  const now = new Date();
  if (new Date(occurrence.dueAt) > now) return false;

  // Must not already be delivered or resolved
  const resolvedStatuses: string[] = [
    "delivered",
    "completed",
    "dismissed",
    "cancelled",
    "completed_by_related_action",
  ];
  if (resolvedStatuses.includes(occurrence.status)) return false;

  return true;
}

// ============================================
// In-App Delivery
// ============================================
export interface InAppDeliveryEvent {
  reminder: Reminder;
  occurrence: ReminderOccurrence;
}

let inAppDeliveryCallback: ((event: InAppDeliveryEvent) => void) | null = null;

export function setInAppDeliveryCallback(callback: (event: InAppDeliveryEvent) => void): void {
  inAppDeliveryCallback = callback;
}

export function deliverInApp(reminder: Reminder, occurrence: ReminderOccurrence): DeliveryResult {
  if (!inAppDeliveryCallback) {
    return {
      success: false,
      channel: "in_app",
      error: "No in-app delivery handler registered",
    };
  }

  try {
    inAppDeliveryCallback({ reminder, occurrence });
    return { success: true, channel: "in_app" };
  } catch (error) {
    return {
      success: false,
      channel: "in_app",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// ============================================
// Deliver Through Best Available Channel
// ============================================
export async function deliverOccurrence(
  reminder: Reminder,
  occurrence: ReminderOccurrence,
): Promise<DeliveryResult> {
  // Acquire lock to prevent duplicate delivery
  if (!acquireDeliveryLock(occurrence.id)) {
    return {
      success: false,
      channel: "in_app",
      error: "Delivery locked by another tab",
    };
  }

  try {
    // Double-check we should still deliver
    if (!shouldDeliverOccurrence(reminder, occurrence)) {
      return {
        success: false,
        channel: "in_app",
        error: "Occurrence no longer eligible for delivery",
      };
    }

    // Try preferred channels in order
    for (const channel of reminder.channels) {
      if (!isChannelAvailable(channel)) continue;

      let result: DeliveryResult;

      if (channel === "browser_notification") {
        result = await deliverBrowserNotification(reminder, occurrence.id);
      } else {
        result = deliverInApp(reminder, occurrence);
      }

      if (result.success) {
        // Mark as delivered
        updateOccurrence(occurrence.id, {
          status: "delivered",
          deliveredVia: channel,
        });
        logOccurrenceDelivered(reminder, occurrence, channel);
        notifyDelivery(occurrence.id);
        return result;
      }

      // If this channel failed but we should fallback, continue
      if (!result.fallbackToInApp) {
        return result;
      }
    }

    // Fallback to in-app if all other channels failed
    const fallbackResult = deliverInApp(reminder, occurrence);
    if (fallbackResult.success) {
      updateOccurrence(occurrence.id, {
        status: "delivered",
        deliveredVia: "in_app",
      });
      logOccurrenceDelivered(reminder, occurrence, "in_app");
      notifyDelivery(occurrence.id);
    }
    return fallbackResult;
  } finally {
    releaseDeliveryLock(occurrence.id);
  }
}

// ============================================
// Deliver All Due Reminders
// ============================================
export async function deliverDueReminders(): Promise<DeliveryResult[]> {
  const results: DeliveryResult[] = [];
  const reminders = loadReminders();
  const dueOccurrences = getUndeliveredDueOccurrences();

  for (const occurrence of dueOccurrences) {
    const reminder = reminders.find((r) => r.id === occurrence.reminderId);
    if (!reminder) continue;

    const result = await deliverOccurrence(reminder, occurrence);
    results.push(result);
  }

  return results;
}

// ============================================
// Check for Missed Reminders
// ============================================
export function processMissedReminders(gracePeriodMinutes: number = 60): void {
  const reminders = loadReminders();
  const gracePeriod = gracePeriodMinutes * 60 * 1000;
  const now = new Date();
  const cutoff = new Date(now.getTime() - gracePeriod);

  const occurrences = getUndeliveredDueOccurrences();

  for (const occurrence of occurrences) {
    if (new Date(occurrence.dueAt) < cutoff) {
      // Mark as missed
      updateOccurrence(occurrence.id, { status: "missed" });
      const reminder = reminders.find((r) => r.id === occurrence.reminderId);
      if (reminder) {
        logOccurrenceMissed(reminder, occurrence);
      }
    }
  }
}

// ============================================
// Delivery Polling
// ============================================
let deliveryInterval: number | null = null;
const POLL_INTERVAL = 30000; // 30 seconds

export function startDeliveryPolling(): void {
  if (typeof window === "undefined") return;
  if (deliveryInterval !== null) return;

  // Check immediately
  deliverDueReminders();
  processMissedReminders();

  // Then check periodically
  deliveryInterval = window.setInterval(() => {
    deliverDueReminders();
    processMissedReminders();
  }, POLL_INTERVAL);

  // Also check on visibility change
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      deliverDueReminders();
      processMissedReminders();
    }
  });
}

export function stopDeliveryPolling(): void {
  if (deliveryInterval !== null) {
    window.clearInterval(deliveryInterval);
    deliveryInterval = null;
  }
}
