/**
 * React Hook for Reminder Management
 *
 * Provides a clean interface for components to interact with the habit engine.
 * Handles state, events, and integration with the delivery system.
 */
import { useState, useEffect, useCallback, useMemo } from "react";
import {
  type Reminder,
  type ReminderOccurrence,
  type ReminderSchedule,
  type ReminderChannel,
  DEFAULT_SNOOZE_OPTIONS,
  REMINDER_PRESETS,
} from "@/services/habit/habit-types";
import {
  loadReminders,
  addReminder,
  updateReminder,
  archiveReminder,
  pauseReminder,
  resumeReminder,
  loadOccurrences,
  updateOccurrence,
  subscribeToReminderChanges,
  subscribeToOccurrenceChanges,
} from "@/services/habit/habit-storage";
import {
  generateId,
  generateAllUpcomingOccurrences,
  snoozeOccurrence,
  getNextOccurrenceForReminder,
} from "@/services/habit/habit-scheduler";
import {
  logReminderCreated,
  logReminderUpdated,
  logReminderPaused,
  logReminderResumed,
  logReminderArchived,
  logOccurrenceCompleted,
  logOccurrenceSnoozed,
  logOccurrenceDismissed,
} from "@/services/habit/habit-events";
import { startDeliveryPolling, subscribeToRemoteDeliveries } from "@/services/habit/habit-delivery";

// ============================================
// Main Hook
// ============================================
export function useReminders() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [occurrences, setOccurrences] = useState<ReminderOccurrence[]>([]);

  // Load initial data and start delivery system
  useEffect(() => {
    setReminders(loadReminders());
    setOccurrences(loadOccurrences());
    generateAllUpcomingOccurrences(7);
    startDeliveryPolling();

    // Subscribe to storage changes
    const unsubscribeReminders = subscribeToReminderChanges(setReminders);
    const unsubscribeOccurrences = subscribeToOccurrenceChanges(setOccurrences);

    // Subscribe to cross-tab delivery events
    const unsubscribeRemote = subscribeToRemoteDeliveries((occurrenceId) => {
      setOccurrences((current) =>
        current.map((o) => (o.id === occurrenceId ? { ...o, status: "delivered" } : o)),
      );
    });

    return () => {
      unsubscribeReminders();
      unsubscribeOccurrences();
      unsubscribeRemote();
    };
  }, []);

  // ============================================
  // CRUD Operations
  // ============================================
  const createReminder = useCallback(
    (data: {
      title: string;
      message?: string;
      schedule: ReminderSchedule;
      timezone?: string;
      channels?: ReminderChannel[];
    }): Reminder => {
      const now = new Date().toISOString();
      const reminder: Reminder = {
        id: generateId("rem"),
        ownerId: "anonymous", // For now; integrate with auth later
        title: data.title,
        message: data.message,
        status: "active",
        channels: data.channels || ["in_app"],
        schedule: data.schedule,
        timezone: data.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
        snoozeOptionsMinutes: DEFAULT_SNOOZE_OPTIONS,
        createdAt: now,
        updatedAt: now,
      };

      addReminder(reminder);
      logReminderCreated(reminder);
      setReminders(loadReminders());
      generateAllUpcomingOccurrences(7);

      return reminder;
    },
    [],
  );

  const editReminder = useCallback((id: string, updates: Partial<Reminder>): Reminder | null => {
    const updated = updateReminder(id, updates);
    if (updated) {
      logReminderUpdated(updated);
      setReminders(loadReminders());
      // Regenerate occurrences after schedule change
      if (updates.schedule) {
        generateAllUpcomingOccurrences(7);
      }
    }
    return updated;
  }, []);

  const pause = useCallback((id: string): Reminder | null => {
    const updated = pauseReminder(id);
    if (updated) {
      logReminderPaused(updated);
      setReminders(loadReminders());
    }
    return updated;
  }, []);

  const resume = useCallback((id: string): Reminder | null => {
    const updated = resumeReminder(id);
    if (updated) {
      logReminderResumed(updated);
      setReminders(loadReminders());
      generateAllUpcomingOccurrences(7);
    }
    return updated;
  }, []);

  const archive = useCallback((id: string): Reminder | null => {
    const updated = archiveReminder(id);
    if (updated) {
      logReminderArchived(updated);
      setReminders(loadReminders());
    }
    return updated;
  }, []);

  // ============================================
  // Occurrence Actions
  // ============================================
  const completeOccurrence = useCallback(
    (occurrenceId: string, source: "user" | "diary_integration" = "user"): void => {
      const reminder = reminders.find(
        (r) => occurrences.find((o) => o.id === occurrenceId)?.reminderId === r.id,
      );
      const occurrence = occurrences.find((o) => o.id === occurrenceId);

      if (reminder && occurrence) {
        updateOccurrence(occurrenceId, { status: "completed" });
        logOccurrenceCompleted(reminder, occurrence, source);
        setOccurrences(loadOccurrences());
      }
    },
    [reminders, occurrences],
  );

  const snooze = useCallback(
    (occurrenceId: string, minutes: number): void => {
      const reminder = reminders.find(
        (r) => occurrences.find((o) => o.id === occurrenceId)?.reminderId === r.id,
      );
      const occurrence = occurrences.find((o) => o.id === occurrenceId);

      if (reminder && occurrence) {
        const newDueAt = snoozeOccurrence(occurrence, minutes);
        updateOccurrence(occurrenceId, {
          dueAt: newDueAt.toISOString(),
          status: "scheduled",
          snoozeCount: occurrence.snoozeCount + 1,
        });
        logOccurrenceSnoozed(reminder, occurrence, minutes);
        setOccurrences(loadOccurrences());
      }
    },
    [reminders, occurrences],
  );

  const dismiss = useCallback(
    (occurrenceId: string): void => {
      const reminder = reminders.find(
        (r) => occurrences.find((o) => o.id === occurrenceId)?.reminderId === r.id,
      );
      const occurrence = occurrences.find((o) => o.id === occurrenceId);

      if (reminder && occurrence) {
        updateOccurrence(occurrenceId, { status: "dismissed" });
        logOccurrenceDismissed(reminder, occurrence);
        setOccurrences(loadOccurrences());
      }
    },
    [reminders, occurrences],
  );

  // ============================================
  // Derived State
  // ============================================
  const activeReminders = useMemo(
    () => reminders.filter((r) => r.status === "active"),
    [reminders],
  );

  const pausedReminders = useMemo(
    () => reminders.filter((r) => r.status === "paused"),
    [reminders],
  );

  const archivedReminders = useMemo(
    () => reminders.filter((r) => r.status === "archived"),
    [reminders],
  );

  const currentlyDueOccurrences = useMemo(() => {
    const now = new Date().toISOString();
    return occurrences.filter(
      (o) =>
        (o.status === "scheduled" || o.status === "due" || o.status === "delivered") &&
        o.dueAt <= now,
    );
  }, [occurrences]);

  const getNextForReminder = useCallback((reminderId: string) => {
    return getNextOccurrenceForReminder(reminderId);
  }, []);

  // ============================================
  // Presets
  // ============================================
  const createFromPreset = useCallback(
    (
      presetKey: keyof typeof REMINDER_PRESETS,
      overrides?: Partial<
        Pick<Reminder, "title" | "message" | "schedule" | "timezone" | "channels">
      >,
    ): Reminder => {
      const preset = REMINDER_PRESETS[presetKey];
      return createReminder({
        title: overrides?.title ?? preset.title,
        message: overrides?.message ?? preset.message,
        schedule: overrides?.schedule ?? { ...preset.schedule },
        timezone: overrides?.timezone,
        channels: overrides?.channels,
      });
    },
    [createReminder],
  );

  return {
    // State
    reminders,
    occurrences,
    activeReminders,
    pausedReminders,
    archivedReminders,
    currentlyDueOccurrences,

    // CRUD
    createReminder,
    editReminder,
    pauseReminder: pause,
    resumeReminder: resume,
    archiveReminder: archive,

    // Actions
    completeOccurrence,
    snoozeOccurrence: snooze,
    dismissOccurrence: dismiss,

    // Queries
    getNextForReminder,

    // Presets
    createFromPreset,
    presets: REMINDER_PRESETS,
  };
}

// ============================================
// Single Reminder Hook
// ============================================
export function useReminder(reminderId: string) {
  const { reminders, occurrences, ...rest } = useReminders();

  const reminder = reminders.find((r) => r.id === reminderId);
  const reminderOccurrences = occurrences.filter((o) => o.reminderId === reminderId);
  const nextOccurrence = rest.getNextForReminder(reminderId);

  return {
    reminder,
    occurrences: reminderOccurrences,
    nextOccurrence,
    ...rest,
  };
}
