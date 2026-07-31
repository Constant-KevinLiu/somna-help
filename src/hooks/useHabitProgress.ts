/**
 * React Hook for Habit Progress
 *
 * Calculates and provides habit progress metrics for UI display.
 */
import { useMemo } from "react";
import {
  type HabitProgress,
  type Reminder,
} from "@/services/habit/habit-types";
import {
  calculateHabitProgress,
  calculateAllHabitProgress,
  getProgressSummary,
} from "@/services/habit/habit-progress";

export function useHabitProgress(reminder: Reminder | undefined): HabitProgress | null {
  return useMemo(() => {
    if (!reminder) return null;
    return calculateHabitProgress(reminder);
  }, [reminder]);
}

export function useAllHabitProgress(reminders: Reminder[]): Map<string, HabitProgress> {
  return useMemo(() => {
    return calculateAllHabitProgress(reminders);
  }, [reminders]);
}

export function useHabitProgressSummary(progress: HabitProgress | null) {
  return useMemo(() => {
    if (!progress) return null;
    return getProgressSummary(progress);
  }, [progress]);
}

export function useHabitProgressForReminders(reminders: Reminder[]) {
  const progressMap = useAllHabitProgress(reminders);

  return useMemo(() => {
    const allCompletions = Array.from(progressMap.values())
      .reduce((sum, p) => sum + p.completionCount, 0);

    const allOpportunities = Array.from(progressMap.values())
      .reduce((sum, p) => sum + p.opportunityCount, 0);

    const overallConsistency = allOpportunities > 0
      ? Math.round((allCompletions / allOpportunities) * 100)
      : 0;

    const activeCount = Array.from(progressMap.values())
      .filter(p => p.currentState === "active" || p.currentState === "maintained").length;

    const totalStreak = Array.from(progressMap.values())
      .reduce((sum, p) => sum + p.currentStreak, 0);

    return {
      allCompletions,
      allOpportunities,
      overallConsistency,
      activeCount,
      totalStreak,
      progressMap,
    };
  }, [progressMap]);
}
