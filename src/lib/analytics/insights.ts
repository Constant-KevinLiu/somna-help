/**
 * Phase F — Insight Card Engine
 *
 * Generates explainable insight cards from analytics data.
 * Each card answers: what, why, evidence, next step.
 *
 * Rules:
 * - Max 3-5 cards shown at once
 * - Prioritized by actionability + confidence
 * - Never show medical/diagnostic language
 * - Always expose sample size and time period
 */

import type { SleepRecord } from "@/lib/sleep-records";
import type { HabitProgress } from "@/services/habit/habit-types";
import type {
  InsightCard,
  InsightType,
  MetricKey,
  PatternFinding,
  MetricTrend,
  DataSufficiency,
} from "./types";
import { overallSufficiency } from "./sufficiency";
import { detectPatterns, detectReminderDiaryPattern } from "./patterns";
import { computeMetrics } from "./metrics";
import { calculateAllTrends, getPrimaryTrend } from "./trends";
import { daysBetween } from "./date-ranges";

// ============================================
// Insight Card Generators
// ============================================

/**
 * Generate an insight from a significant trend.
 */
function trendInsight(trend: MetricTrend, periodLabel: string): InsightCard | null {
  if (trend.direction === "insufficient_data" || trend.direction === "stable") {
    return null;
  }

  const isImproving = trend.direction === "improving";
  const type: InsightType = "trend";

  const priority = trend.confidence === "high" ? 10 : trend.confidence === "medium" ? 7 : 4;

  return {
    id: `trend-${trend.metric}`,
    type,
    priority,
    titleKey: isImproving
      ? `analytics.insight.trend.improving.${trend.metric}.title`
      : `analytics.insight.trend.declining.${trend.metric}.title`,
    bodyKey: isImproving
      ? `analytics.insight.trend.improving.${trend.metric}.body`
      : `analytics.insight.trend.declining.${trend.metric}.body`,
    evidence: {
      metricKey: trend.metric,
      period: periodLabel,
      sampleSize: trend.sampleSizeCurrent,
      dataPoints: [trend.previousValue ?? 0, trend.currentValue ?? 0],
      supportingPatterns: [trend.direction],
    },
    confidence: trend.confidence,
    dataSufficiency: overallSufficiency(trend.sampleSizeCurrent),
    action: {
      labelKey: "analytics.insight.action.learn_more",
      actionType: "info",
    },
  };
}

/**
 * Generate an insight from a pattern finding.
 */
function patternInsight(
  pattern: PatternFinding,
  periodLabel: string,
  priorityOffset: number = 0,
): InsightCard {
  const type: InsightType = "pattern";
  const priority =
    (pattern.confidence === "high" ? 9 : pattern.confidence === "medium" ? 6 : 3) + priorityOffset;

  return {
    id: `pattern-${pattern.key}`,
    type,
    priority,
    titleKey: `analytics.insight.pattern.${pattern.key}.title`,
    bodyKey: `analytics.insight.pattern.${pattern.key}.body`,
    evidence: {
      metricKey: pattern.metric,
      period: periodLabel,
      sampleSize: pattern.evidence.sampleSizeWeekday + pattern.evidence.sampleSizeWeekend,
      supportingPatterns: [pattern.key],
    },
    confidence: pattern.confidence,
    dataSufficiency: pattern.dataSufficiency,
    action: {
      labelKey: "analytics.insight.action.observe",
      actionType: "info",
    },
  };
}

/**
 * Generate encouragement / baseline-building insights for low-data states.
 */
function encouragementInsights(
  recordCount: number,
  periodLabel: string,
  suf: DataSufficiency,
): InsightCard[] {
  const cards: InsightCard[] = [];

  if (suf === "none") {
    cards.push({
      id: "enc-start-recording",
      type: "encouragement",
      priority: 5,
      titleKey: "analytics.insight.encouragement.start_recording.title",
      bodyKey: "analytics.insight.encouragement.start_recording.body",
      evidence: {
        metricKey: "diaryCompletionRate",
        period: periodLabel,
        sampleSize: 0,
      },
      confidence: "high",
      dataSufficiency: "none",
      action: {
        labelKey: "analytics.insight.action.start_diary",
        actionType: "navigate",
        target: "/diary",
      },
    });
  } else if (suf === "insufficient") {
    cards.push({
      id: "enc-keep-going",
      type: "encouragement",
      priority: 5,
      titleKey: "analytics.insight.encouragement.keep_going.title",
      bodyKey: "analytics.insight.encouragement.keep_going.body",
      evidence: {
        metricKey: "diaryCompletionRate",
        period: periodLabel,
        sampleSize: recordCount,
      },
      confidence: "high",
      dataSufficiency: "insufficient",
      action: {
        labelKey: "analytics.insight.action.continue_recording",
        actionType: "navigate",
        target: "/diary",
      },
    });
  }

  // First-week celebration
  if (suf === "limited" && recordCount >= 3) {
    cards.push({
      id: "enc-first-week",
      type: "encouragement",
      priority: 8,
      titleKey: "analytics.insight.encouragement.first_week.title",
      bodyKey: "analytics.insight.encouragement.first_week.body",
      evidence: {
        metricKey: "diaryCompletionRate",
        period: periodLabel,
        sampleSize: recordCount,
      },
      confidence: "high",
      dataSufficiency: "limited",
    });
  }

  return cards;
}

/**
 * Generate a streak/consistency insight if applicable.
 */
function streakInsight(streak: number, periodLabel: string): InsightCard | null {
  if (streak < 3) return null;

  return {
    id: "pattern-streak",
    type: "encouragement",
    priority: streak >= 14 ? 10 : streak >= 7 ? 8 : 6,
    titleKey: "analytics.insight.encouragement.streak.title",
    bodyKey: "analytics.insight.encouragement.streak.body",
    evidence: {
      metricKey: "diaryCompletionRate",
      period: periodLabel,
      sampleSize: streak,
    },
    confidence: "high",
    dataSufficiency: overallSufficiency(streak),
  };
}

// ============================================
// Insight Generation Pipeline
// ============================================

/**
 * Generate prioritized insight cards.
 *
 * Pipeline:
 * 1. Collect all candidate insights (trends + patterns + encouragement)
 * 2. Sort by priority (highest first)
 * 3. Return top N (3-5)
 */
export function generateInsights(
  records: SleepRecord[],
  periodDays: number,
  habitProgress: Map<string, HabitProgress>,
  periodLabel: string,
  now: Date = new Date(),
): InsightCard[] {
  const recordCount = records.length;
  const suf = overallSufficiency(recordCount);
  const cards: InsightCard[] = [];

  // If no data at all, just show encouragement
  if (suf === "none") {
    return encouragementInsights(recordCount, periodLabel, suf);
  }

  // 1. Trend-based insights
  const trends = calculateAllTrends(records, periodDays, now);
  const primaryTrend = getPrimaryTrend(trends);
  if (primaryTrend) {
    const ti = trendInsight(primaryTrend, periodLabel);
    if (ti) cards.push(ti);
  }

  // 2. Pattern-based insights (top 2 patterns)
  const patterns = detectPatterns(records);
  const topPatterns = patterns.slice(0, 2);
  for (let i = 0; i < topPatterns.length; i++) {
    cards.push(patternInsight(topPatterns[i], periodLabel, -i)); // slightly lower priority for 2nd
  }

  // 3. Reminder vs diary pattern (if we have habit data)
  if (habitProgress.size > 0) {
    const totalDays = periodDays;
    const reminderPattern = detectReminderDiaryPattern(records, habitProgress, totalDays);
    if (reminderPattern) {
      cards.push(patternInsight(reminderPattern, periodLabel, -1));
    }
  }

  // 4. Encouragement insights
  const enc = encouragementInsights(recordCount, periodLabel, suf);
  cards.push(...enc);

  // 5. Streak celebration
  const currentStreak = calculateCurrentStreak(records);
  const streakCard = streakInsight(currentStreak, periodLabel);
  if (streakCard) cards.push(streakCard);

  // Sort by priority descending
  cards.sort((a, b) => b.priority - a.priority);

  // Return top 4-5 cards
  const maxCards = suf === "sufficient" ? 5 : 4;
  return cards.slice(0, maxCards);
}

// ============================================
// Helper: Current Streak
// ============================================

function calculateCurrentStreak(records: SleepRecord[]): number {
  if (records.length === 0) return 0;
  const dateSet = new Set(records.map((r) => r.date));
  const today = new Date();
  let streak = 0;
  let i = 0;
  // Start from today, go backwards
  while (true) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    if (dateSet.has(dateStr)) {
      streak++;
      i++;
    } else {
      // If no record today, try yesterday as start (already handled by i=0 check)
      if (i === 0) {
        i++;
        continue;
      }
      break;
    }
  }
  return streak;
}
