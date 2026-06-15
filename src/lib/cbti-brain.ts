// CBT-I Brain: adaptive logic that turns sleepRecords into actionable guidance.
// Pure functions, no UI. Consumed by dashboard, Week 3, and future cloud sync.

import {
  type SleepRecord,
  minutesInBed,
  isoDaysAgo,
} from "./sleep-records";

/** Average sleep efficiency over the last 7 days (records present only). */
export function avgEfficiency7d(records: SleepRecord[]): number | null {
  const cutoff = new Set<string>();
  for (let i = 0; i < 7; i++) cutoff.add(isoDaysAgo(i));
  const week = records.filter((r) => cutoff.has(r.date));
  if (!week.length) return null;
  return Math.round(
    week.reduce((s, r) => s + r.sleepEfficiency, 0) / week.length,
  );
}

export type RecommendationAction = "expand" | "maintain" | "consistency";

export interface Recommendation {
  action: RecommendationAction;
  adjustmentMinutes: number; // signed: +15 expand, 0 hold
  efficiency: number | null; // 7d avg
  reasonKey: string; // i18n key
  titleKey: string;
}

/**
 * Adaptive sleep-restriction recommendation.
 *  >85%   → expand window by 15 min
 *  80–85% → maintain
 *  <80%   → hold + focus on consistency
 */
export function recommend(records: SleepRecord[]): Recommendation {
  const eff = avgEfficiency7d(records);
  if (eff === null) {
    return {
      action: "consistency",
      adjustmentMinutes: 0,
      efficiency: null,
      titleKey: "cbti.rec.title.collect",
      reasonKey: "cbti.rec.reason.collect",
    };
  }
  if (eff > 85) {
    return {
      action: "expand",
      adjustmentMinutes: 15,
      efficiency: eff,
      titleKey: "cbti.rec.title.expand",
      reasonKey: "cbti.rec.reason.expand",
    };
  }
  if (eff >= 80) {
    return {
      action: "maintain",
      adjustmentMinutes: 0,
      efficiency: eff,
      titleKey: "cbti.rec.title.maintain",
      reasonKey: "cbti.rec.reason.maintain",
    };
  }
  return {
    action: "consistency",
    adjustmentMinutes: 0,
    efficiency: eff,
    titleKey: "cbti.rec.title.consistency",
    reasonKey: "cbti.rec.reason.consistency",
  };
}

/** Recent average bedtime / wake-up (last up-to-7 records). */
function avgClock(records: SleepRecord[], key: "bedtime" | "wakeUpTime"): string {
  const recent = records.slice(-7);
  if (!recent.length) return key === "bedtime" ? "22:45" : "06:45";
  const mins = recent.map((r) => {
    const [h, m] = r[key].split(":").map(Number);
    return (h || 0) * 60 + (m || 0);
  });
  const avg = Math.round(mins.reduce((s, x) => s + x, 0) / mins.length);
  return `${String(Math.floor(avg / 60)).padStart(2, "0")}:${String(avg % 60).padStart(2, "0")}`;
}

function shiftClock(hhmm: string, minutes: number): string {
  const [h, m] = hhmm.split(":").map(Number);
  let total = (h * 60 + m + minutes + 24 * 60) % (24 * 60);
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

export interface SleepWindow {
  bedtime: string;
  wakeUpTime: string;
  timeInBedMinutes: number;
  adjustmentMinutes: number;
}

/**
 * Recommended sleep window. Keeps wake-up fixed and shifts bedtime earlier
 * when expanding (more time in bed), later when contracting.
 */
export function sleepWindow(records: SleepRecord[]): SleepWindow {
  const rec = recommend(records);
  const wake = avgClock(records, "wakeUpTime");
  const baseBed = avgClock(records, "bedtime");
  // expanding the window = bedtime earlier = subtract minutes
  const bedtime = shiftClock(baseBed, -rec.adjustmentMinutes);
  return {
    bedtime,
    wakeUpTime: wake,
    timeInBedMinutes: minutesInBed(bedtime, wake),
    adjustmentMinutes: rec.adjustmentMinutes,
  };
}

/** Coach message — one warm sentence based on the latest night and the trend. */
export function coachMessageKey(records: SleepRecord[]): {
  key: string;
  vars?: Record<string, string | number>;
} {
  if (!records.length) return { key: "coach.empty" };
  const last = records[records.length - 1];
  const rec = recommend(records);
  if (rec.efficiency === null) return { key: "coach.collect" };
  if (rec.action === "expand")
    return { key: "coach.expand", vars: { n: rec.adjustmentMinutes } };
  if (rec.action === "maintain") return { key: "coach.maintain" };
  if (last.sleepEfficiency < 70) return { key: "coach.lowNight" };
  return { key: "coach.consistency" };
}

/* ---------------- Achievements ---------------- */

export const ACHIEVEMENT_MILESTONES = [3, 7, 14, 30, 90] as const;
export type AchievementDays = (typeof ACHIEVEMENT_MILESTONES)[number];

export interface Achievement {
  days: AchievementDays;
  unlocked: boolean;
  nextDays: number | null; // distance to next milestone
}

export function achievements(streak: number): Achievement[] {
  return ACHIEVEMENT_MILESTONES.map((days, i) => {
    const next = ACHIEVEMENT_MILESTONES[i + 1] ?? null;
    return {
      days,
      unlocked: streak >= days,
      nextDays: next ? next - streak : null,
    };
  });
}

/* ---------------- Sync Adapter (architecture only) ---------------- */

/**
 * Storage adapter — future seam for Supabase, cloud sync, Apple Health,
 * Google Fit, and email reminders. Today the app reads/writes via the
 * localStorage helpers in `sleep-records.ts`; later providers implement
 * this interface so the UI does not change.
 */
export interface SleepStorageAdapter {
  readonly id: "local" | "supabase";
  list(): Promise<SleepRecord[]>;
  save(record: SleepRecord): Promise<void>;
  // optional: when wired up
  pullHealthData?(): Promise<SleepRecord[]>;
  scheduleReminder?(at: string): Promise<void>;
}

export const localAdapter: SleepStorageAdapter = {
  id: "local",
  async list() {
    const { loadRecords } = await import("./sleep-records");
    return loadRecords();
  },
  async save(record) {
    const { saveRecord } = await import("./sleep-records");
    saveRecord(record);
  },
};

// Future: createSupabaseAdapter(client) implementing the same shape.