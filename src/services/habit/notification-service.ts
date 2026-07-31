/**
 * Habit Engine — Notification Service
 *
 * Handles browser notification permission and delivery.
 * Follows privacy principles: no sensitive content by default.
 */
import {
  type Reminder,
  type ReminderChannel,
  type DeliveryResult,
} from "./habit-types";
import {
  loadNotificationPrefs,
  updateNotificationPermission,
} from "./habit-storage";
import { isNotificationSupported as isNotifSupported } from "@/lib/safe-storage";

// ============================================
// Browser Capability Checks
// ============================================
export function isNotificationSupported(): boolean {
  return isNotifSupported();
}

export function getCurrentPermission(): NotificationPermission {
  if (!isNotificationSupported()) return "denied";
  return Notification.permission;
}

export function isPermissionGranted(): boolean {
  return getCurrentPermission() === "granted";
}

export function isPermissionDenied(): boolean {
  return getCurrentPermission() === "denied";
}

// ============================================
// Permission Request
// ============================================
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!isNotificationSupported()) return "denied";

  // Don't re-prompt if already denied
  const prefs = loadNotificationPrefs();
  if (prefs.userExplicitlyDenied) return "denied";

  try {
    const permission = await Notification.requestPermission();
    updateNotificationPermission(permission);
    return permission;
  } catch {
    return "denied";
  }
}

// ============================================
// Quiet Hours Check
// ============================================
export function isWithinQuietHours(now: Date = new Date()): boolean {
  const prefs = loadNotificationPrefs();
  if (!prefs.quietHoursStart || !prefs.quietHoursEnd) return false;

  const nowHours = now.getHours();
  const nowMinutes = now.getMinutes();
  const nowTotal = nowHours * 60 + nowMinutes;

  const parseTime = (timeStr: string): number => {
    const [h, m] = timeStr.split(":").map(Number);
    return h * 60 + m;
  };

  const start = parseTime(prefs.quietHoursStart);
  const end = parseTime(prefs.quietHoursEnd);

  if (start <= end) {
    // Same day quiet hours (e.g., 00:00-07:00)
    return nowTotal >= start && nowTotal < end;
  } else {
    // Overnight quiet hours (e.g., 22:00-07:00)
    return nowTotal >= start || nowTotal < end;
  }
}

// ============================================
// Notification Content (Privacy-Safe)
// ============================================
export function buildNotificationContent(
  reminder: Reminder
): { title: string; body: string } {
  const prefs = loadNotificationPrefs();

  // Default: privacy-safe generic content
  const defaultTitle = "Somna Reminder";
  const defaultBody = "Your scheduled check-in is ready.";

  // Only show custom content if user explicitly opted in
  if (prefs.showSensitiveContent) {
    return {
      title: reminder.title,
      body: reminder.message || defaultBody,
    };
  }

  return { title: defaultTitle, body: defaultBody };
}

// ============================================
// Browser Notification Delivery
// ============================================
export async function deliverBrowserNotification(
  reminder: Reminder,
  tag?: string
): Promise<DeliveryResult> {
  const result: DeliveryResult = {
    success: false,
    channel: "browser_notification",
  };

  if (!isNotificationSupported()) {
    result.error = "Notifications not supported";
    result.fallbackToInApp = true;
    return result;
  }

  if (!isPermissionGranted()) {
    result.error = "Notification permission not granted";
    result.fallbackToInApp = true;
    return result;
  }

  if (isWithinQuietHours()) {
    result.error = "Within quiet hours";
    result.fallbackToInApp = true;
    return result;
  }

  try {
    const { title, body } = buildNotificationContent(reminder);

    // eslint-disable-next-line no-new
    new Notification(title, {
      body,
      tag: tag || reminder.id,
      icon: "/favicon.ico",
      silent: false,
    });

    result.success = true;
    return result;
  } catch (error) {
    result.error = error instanceof Error ? error.message : "Unknown error";
    result.fallbackToInApp = true;
    return result;
  }
}

// ============================================
// Channel Availability
// ============================================
export function isChannelAvailable(channel: ReminderChannel): boolean {
  switch (channel) {
    case "in_app":
      return true; // Always available
    case "browser_notification":
      return isNotificationSupported() && isPermissionGranted();
    default:
      return false;
  }
}

export function getAvailableChannels(): ReminderChannel[] {
  const channels: ReminderChannel[] = ["in_app"];
  if (isChannelAvailable("browser_notification")) {
    channels.push("browser_notification");
  }
  return channels;
}

// ============================================
// Test Notification
// ============================================
export async function sendTestNotification(): Promise<boolean> {
  if (!isPermissionGranted()) {
    const permission = await requestNotificationPermission();
    if (permission !== "granted") return false;
  }

  try {
    // eslint-disable-next-line no-new
    new Notification("Somna", {
      body: "This is a test notification. You're all set!",
      icon: "/favicon.ico",
    });
    return true;
  } catch {
    return false;
  }
}
