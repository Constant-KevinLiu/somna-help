/**
 * Habit Engine — Progress Calculation
 *
 * Deterministic habit metrics:
 * - Consistency rate
 * - Current streak
 * - Longest streak
 * - Opportunity counting
 *
 * All calculations are pure functions and unit-testable.
 */
import { type HabitProgress, type Reminder, type HabitState } from "./habit-types";
import { loadOccurrences } from "./habit-storage";
import { getCompletionEvents, getMissedEvents } from "./habit-events";
import { getLocalDate, addDays } from "./habit-scheduler";

// ============================================
// Consistency Rate
// ============================================
export function calculateConsistencyRate(completions: number, opportunities: number): number {
  if (opportunities === 0) return 0;
  return Math.round((completions / opportunities) * 100);
}

// ============================================
// Streak Calculation
// ============================================
interface CompletionDay {
  date: string; // YYYY-MM-DD
  completed: boolean;
}

export function getCompletionDays(reminderId: string, timezone: string): CompletionDay[] {
  const completions = getCompletionEvents(reminderId);
  const missed = getMissedEvents(reminderId);

  const dayMap = new Map<string, boolean>();

  // Mark completed days
  for (const event of completions) {
    const localDate = getLocalDate(new Date(event.timestamp), timezone);
    dayMap.set(localDate, true);
  }

  // Mark missed days (completed takes precedence)
  for (const event of missed) {
    const localDate = getLocalDate(new Date(event.timestamp), timezone);
    if (!dayMap.has(localDate)) {
      dayMap.set(localDate, false);
    }
  }

  return Array.from(dayMap.entries())
    .map(([date, completed]) => ({ date, completed }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function calculateCurrentStreak(
  completionDays: CompletionDay[],
  timezone: string,
  now: Date = new Date(),
): number {
  if (completionDays.length === 0) return 0;

  const today = getLocalDate(now, timezone);
  const sorted = [...completionDays].sort((a, b) => b.date.localeCompare(a.date));

  let streak = 0;
  const currentDate = today;

  // Check today first
  const todayEntry = sorted.find((d) => d.date === today);
  if (todayEntry?.completed) {
    streak = 1;
  }

  // Check backwards from yesterday
  let checkDate = getLocalDate(addDays(new Date(today), -1), timezone);

  while (true) {
    const entry = sorted.find((d) => d.date === checkDate);
    if (entry?.completed) {
      streak++;
      checkDate = getLocalDate(addDays(new Date(checkDate), -1), timezone);
    } else if (entry === undefined) {
      // Gap in record — could be paused, archived, or just not tracked yet
      // Stop streak calculation at gap to avoid false negatives
      break;
    } else {
      // Missed day breaks the streak
      break;
    }
  }

  return streak;
}

export function calculateLongestStreak(completionDays: CompletionDay[]): number {
  if (completionDays.length === 0) return 0;

  const sorted = [...completionDays].sort((a, b) => a.date.localeCompare(b.date));

  let longestStreak = 0;
  let currentStreak = 0;

  for (let i = 0; i < sorted.length; i++) {
    if (sorted[i].completed) {
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  }

  return longestStreak;
}

// ============================================
// Habit State Determination
// ============================================
export function determineHabitState(
  reminder: Reminder,
  currentStreak: number,
  consistencyRate: number,
): HabitState {
  if (reminder.status === "archived") return "archived";
  if (reminder.status === "paused") return "paused";

  // Thresholds can be adjusted based on product requirements
  const MAINTENANCE_STREAK_THRESHOLD = 21; // 3 weeks
  const MAINTENANCE_CONSISTENCY_THRESHOLD = 80;

  if (
    currentStreak >= MAINTENANCE_STREAK_THRESHOLD &&
    consistencyRate >= MAINTENANCE_CONSISTENCY_THRESHOLD
  ) {
    return "maintained";
  }

  if (currentStreak >= 1 || consistencyRate >= 50) {
    return "active";
  }

  return "planned";
}

// ============================================
// Last Completed Date
// ============================================
export function getLastCompletedDate(reminderId: string): string | undefined {
  const completions = getCompletionEvents(reminderId);
  if (completions.length === 0) return undefined;

  const sorted = [...completions].sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  return sorted[0].timestamp;
}

// ============================================
// Full Progress Calculation
// ============================================
export function calculateHabitProgress(reminder: Reminder, now: Date = new Date()): HabitProgress {
  const reminderId = reminder.id;
  const timezone = reminder.timezone;

  // Get completion data
  const completionDays = getCompletionDays(reminderId, timezone);
  const completionCount = completionDays.filter((d) => d.completed).length;

  // Get total opportunities (completed + missed)
  // For more accuracy, count occurrences that have reached their due time
  const occurrences = loadOccurrences().filter((o) => o.reminderId === reminderId);
  const resolvedOccurrences = occurrences.filter(
    (o) =>
      o.status === "completed" ||
      o.status === "completed_by_related_action" ||
      o.status === "missed" ||
      o.status === "dismissed",
  );
  const opportunityCount = resolvedOccurrences.length;

  // Calculate metrics
  const consistencyRate = calculateConsistencyRate(completionCount, opportunityCount);
  const currentStreak = calculateCurrentStreak(completionDays, timezone, now);
  const longestStreak = calculateLongestStreak(completionDays);
  const lastCompletedAt = getLastCompletedDate(reminderId);
  const currentState = determineHabitState(reminder, currentStreak, consistencyRate);

  return {
    reminderId,
    completionCount,
    opportunityCount,
    consistencyRate,
    currentStreak,
    longestStreak,
    lastCompletedAt,
    currentState,
    calculatedAt: now.toISOString(),
  };
}

// ============================================
// Batch Progress Calculation
// ============================================
export function calculateAllHabitProgress(
  reminders: Reminder[],
  now: Date = new Date(),
): Map<string, HabitProgress> {
  const progressMap = new Map<string, HabitProgress>();

  for (const reminder of reminders) {
    progressMap.set(reminder.id, calculateHabitProgress(reminder, now));
  }

  return progressMap;
}

// ============================================
// Progress Summary for UI
// ============================================
export function getProgressSummary(progress: HabitProgress): {
  label: string;
  description: string;
  emoji: string;
} {
  if (progress.currentState === "archived") {
    return {
      label: "Archived",
      description: "This habit has been archived.",
      emoji: "📦",
    };
  }

  if (progress.currentState === "paused") {
    return {
      label: "Paused",
      description: "Take a break — resume whenever you're ready.",
      emoji: "⏸️",
    };
  }

  if (progress.currentState === "maintained") {
    return {
      label: "Well Established",
      description: `Amazing! You've maintained this for ${progress.currentStreak} days straight.`,
      emoji: "🌟",
    };
  }

  if (progress.currentState === "active") {
    return {
      label: "Building Momentum",
      description: `${progress.currentStreak} day streak — keep going!`,
      emoji: "🔥",
    };
  }

  return {
    label: "Getting Started",
    description: "Every journey begins with a single step.",
    emoji: "🌱",
  };
}
