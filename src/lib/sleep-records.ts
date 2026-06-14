// Unified Sleep Record interface — single source of truth for CBT-I data.
// All records persist under one localStorage key: "sleepRecords".

export const SLEEP_RECORDS_KEY = "sleepRecords";

export interface SleepRecord {
  date: string; // YYYY-MM-DD (the wake-up day)
  bedtime: string; // "HH:MM"
  sleepLatency: number; // minutes to fall asleep
  nightAwakenings: number;
  wakeUpTime: string; // "HH:MM"
  sleepQuality: number; // 1-5
  mood: number; // 1-5
  sleepEfficiency: number; // 0-100
  sleepScore: number; // 0-100
}

export type ScoreTier = "good" | "fair" | "needs";
export type EfficiencyTier = "excellent" | "great" | "ok" | "low";

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
}

/** Minutes between bedtime and wake-up time, handling overnight wrap. */
export function minutesInBed(bedtime: string, wakeUpTime: string): number {
  const start = toMinutes(bedtime);
  const end = toMinutes(wakeUpTime);
  let diff = end - start;
  if (diff <= 0) diff += 24 * 60;
  return diff;
}

/** Sleep efficiency = (actual sleep / time in bed) * 100. Each awakening ≈ 10 min. */
export function computeEfficiency(input: {
  bedtime: string;
  wakeUpTime: string;
  sleepLatency: number;
  nightAwakenings: number;
}): number {
  const tib = minutesInBed(input.bedtime, input.wakeUpTime);
  if (tib <= 0) return 0;
  const asleep = Math.max(0, tib - input.sleepLatency - input.nightAwakenings * 10);
  return Math.round((asleep / tib) * 100);
}

/** Composite 0-100 score blending efficiency, quality, and mood. */
export function computeScore(input: {
  sleepEfficiency: number;
  sleepQuality: number;
  mood: number;
}): number {
  const eff = Math.max(0, Math.min(100, input.sleepEfficiency));
  const q = ((input.sleepQuality - 1) / 4) * 100;
  const m = ((input.mood - 1) / 4) * 100;
  return Math.round(eff * 0.6 + q * 0.25 + m * 0.15);
}

export function efficiencyTier(eff: number): EfficiencyTier {
  if (eff >= 90) return "excellent";
  if (eff >= 85) return "great";
  if (eff >= 80) return "ok";
  return "low";
}

export function efficiencyColor(tier: EfficiencyTier): string {
  switch (tier) {
    case "excellent": return "oklch(0.78 0.16 150)"; // green
    case "great": return "oklch(0.82 0.12 155)"; // soft green
    case "ok": return "oklch(0.85 0.13 90)"; // yellow
    case "low": return "oklch(0.74 0.16 55)"; // orange
  }
}

export function scoreTier(score: number): ScoreTier {
  if (score >= 80) return "good";
  if (score >= 65) return "fair";
  return "needs";
}

export function loadRecords(): SleepRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(SLEEP_RECORDS_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return arr.filter((r) => r && typeof r.date === "string");
  } catch {
    return [];
  }
}

export function saveRecord(record: SleepRecord): SleepRecord[] {
  const all = loadRecords().filter((r) => r.date !== record.date);
  all.push(record);
  all.sort((a, b) => a.date.localeCompare(b.date));
  if (typeof window !== "undefined") {
    window.localStorage.setItem(SLEEP_RECORDS_KEY, JSON.stringify(all));
  }
  return all;
}

export function todayISO(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function isoDaysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Returns last 7 days (oldest → newest) with efficiency value or null. */
export function last7Days(records: SleepRecord[]): { date: string; efficiency: number | null; score: number | null }[] {
  const byDate = new Map(records.map((r) => [r.date, r]));
  const out: { date: string; efficiency: number | null; score: number | null }[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = isoDaysAgo(i);
    const r = byDate.get(date);
    out.push({
      date,
      efficiency: r ? r.sleepEfficiency : null,
      score: r ? r.sleepScore : null,
    });
  }
  return out;
}

export function weeklyAverageEfficiency(records: SleepRecord[]): number | null {
  const week = last7Days(records).filter((d) => d.efficiency !== null) as { efficiency: number }[];
  if (!week.length) return null;
  return Math.round(week.reduce((s, d) => s + d.efficiency, 0) / week.length);
}

/** Streak of consecutive days ending today (or yesterday if no entry yet today). */
export function currentStreak(records: SleepRecord[]): number {
  const dates = new Set(records.map((r) => r.date));
  if (!dates.size) return 0;
  let streak = 0;
  // start counting from today; if no record today, start from yesterday
  let i = dates.has(todayISO()) ? 0 : 1;
  while (dates.has(isoDaysAgo(i))) {
    streak++;
    i++;
  }
  return streak;
}

/** Compare this week's avg efficiency vs the previous 7 days. */
export function efficiencyTrend(records: SleepRecord[]): number | null {
  const byDate = new Map(records.map((r) => [r.date, r]));
  const thisWeek: number[] = [];
  const prevWeek: number[] = [];
  for (let i = 0; i < 7; i++) {
    const r = byDate.get(isoDaysAgo(i));
    if (r) thisWeek.push(r.sleepEfficiency);
  }
  for (let i = 7; i < 14; i++) {
    const r = byDate.get(isoDaysAgo(i));
    if (r) prevWeek.push(r.sleepEfficiency);
  }
  if (!thisWeek.length || !prevWeek.length) return null;
  const avg = (xs: number[]) => xs.reduce((s, x) => s + x, 0) / xs.length;
  return Math.round(avg(thisWeek) - avg(prevWeek));
}

/** Suggest tonight's bedtime/wake based on recent records, or sensible defaults. */
export function tonightPlan(records: SleepRecord[]): { bedtime: string; wakeUpTime: string } {
  const recent = records.slice(-7);
  if (!recent.length) return { bedtime: "22:45", wakeUpTime: "06:45" };
  const avgMin = (key: "bedtime" | "wakeUpTime") => {
    const mins = recent.map((r) => toMinutes(r[key]));
    return Math.round(mins.reduce((s, x) => s + x, 0) / mins.length);
  };
  const fmt = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  return { bedtime: fmt(avgMin("bedtime")), wakeUpTime: fmt(avgMin("wakeUpTime")) };
}