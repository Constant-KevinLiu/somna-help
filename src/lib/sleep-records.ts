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

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function isISODate(value: unknown): value is string {
  return typeof value === "string" && ISO_DATE.test(value);
}

export function loadRecords(): SleepRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(SLEEP_RECORDS_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    const valid = arr.filter((r): r is SleepRecord => {
      return (
        r && typeof r === "object" &&
        isISODate((r as any).date) &&
        typeof (r as any).bedtime === "string" &&
        typeof (r as any).wakeUpTime === "string" &&
        typeof (r as any).sleepLatency === "number" &&
        typeof (r as any).nightAwakenings === "number" &&
        typeof (r as any).sleepQuality === "number" &&
        typeof (r as any).mood === "number" &&
        typeof (r as any).sleepEfficiency === "number" &&
        typeof (r as any).sleepScore === "number"
      );
    });
    valid.sort((a, b) => a.date.localeCompare(b.date));
    return valid;
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

/** 
 * Returns exactly 7 days of data (oldest → newest), with full date range from 7 days ago to today.
 * Missing dates are filled with null efficiency/score placeholders.
 * Ensures consistent X-axis display (Mon–Sun).
 */
export function last7Days(records: SleepRecord[]): { date: string; efficiency: number | null; score: number | null }[] {
  const recordMap = new Map(records.map((r) => [r.date, r]));
  const result: { date: string; efficiency: number | null; score: number | null }[] = [];
  
  // Generate all 7 dates from 7 days ago to today
  for (let i = 6; i >= 0; i--) {
    const date = isoDaysAgo(i);
    const record = recordMap.get(date);
    
    if (record) {
      // Ensure efficiency and score are always calculated/filled
      result.push({
        date,
        efficiency: record.sleepEfficiency,
        score: record.sleepScore,
      });
    } else {
      // Placeholder for missing date
      result.push({
        date,
        efficiency: null,
        score: null,
      });
    }
  }
  
  console.log("last7Days result:", result);
  return result;
}

export function weeklyAverageEfficiency(records: SleepRecord[]): number | null {
  // Get valid records with non-null efficiency
  const validRecords = records.filter((r) => r.sleepEfficiency !== null && r.sleepEfficiency !== undefined);
  
  // If at least 1 record exists, calculate average
  if (validRecords.length === 0) return null;
  
  const sum = validRecords.reduce((s, r) => s + r.sleepEfficiency, 0);
  const avg = Math.round(sum / validRecords.length);
  console.log("weeklyAverageEfficiency:", { recordCount: validRecords.length, average: avg });
  return avg;
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

/** Compare trend: this week's avg efficiency vs previous period. Handles sparse data. */
export function efficiencyTrend(records: SleepRecord[]): number | null {
  if (records.length === 0) return null;
  
  const byDate = new Map(records.map((r) => [r.date, r]));
  const thisWeek: number[] = [];
  const prevWeek: number[] = [];
  
  // Collect this week's efficiency (last 7 days)
  for (let i = 0; i < 7; i++) {
    const r = byDate.get(isoDaysAgo(i));
    if (r && r.sleepEfficiency !== null) thisWeek.push(r.sleepEfficiency);
  }
  
  // Collect previous week's efficiency (7-14 days ago)
  for (let i = 7; i < 14; i++) {
    const r = byDate.get(isoDaysAgo(i));
    if (r && r.sleepEfficiency !== null) prevWeek.push(r.sleepEfficiency);
  }
  
  // Calculate averages
  const avg = (xs: number[]) => (xs.length > 0 ? xs.reduce((s, x) => s + x, 0) / xs.length : null);
  const thisAvg = avg(thisWeek);
  const prevAvg = avg(prevWeek);
  
  // If only one period has data, use comparison with 0 baseline (flat if no comparison period)
  if (thisAvg === null) return null;
  if (prevAvg === null) {
    // If we have this week but no previous week, return "flat" as 0
    console.log("efficiencyTrend: only current week data available, returning 0 (flat)");
    return 0;
  }
  
  const trend = Math.round(thisAvg - prevAvg);
  console.log("efficiencyTrend:", { thisWeek, prevWeek, thisAvg, prevAvg, trend });
  return trend;
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