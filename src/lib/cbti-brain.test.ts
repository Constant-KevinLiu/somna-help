import { describe, it, expect } from "vitest";

import { buildSafeSleepWindow } from "./cbti-brain";
import { tonightPlan, type SleepRecord } from "./sleep-records";

describe("buildSafeSleepWindow", () => {
  it("replaces unrealistically early bedtimes", () => {
    // 19:00 bedtime is too early (before 20:00), should be clamped
    const result = buildSafeSleepWindow("19:00", "07:00");

    // Bedtime should be clamped to at least 20:00 (the minimum)
    expect(result.bedtime).toBe("22:00");
    // Wake time 07:00 is within 05:00-09:00 range, stays the same
    expect(result.wakeUpTime).toBe("07:00");
    // Time in bed should be within 5-9 hours
    expect(result.timeInBedMinutes).toBeGreaterThanOrEqual(5 * 60);
    expect(result.timeInBedMinutes).toBeLessThanOrEqual(9 * 60);
  });

  it("clamps early wake times and bounds sleep window", () => {
    // 04:00 wake time is too early (before 05:00), should be clamped to 06:00
    const result = buildSafeSleepWindow("22:00", "04:00");

    // Wake time is below 05:00 so it gets set to 06:00
    expect(result.wakeUpTime).toBe("06:00");
    // 22:00 bedtime + 06:00 wake = 8 hours in bed, which is within bounds
    expect(result.timeInBedMinutes).toBe(8 * 60);
  });
});

describe("tonightPlan", () => {
  it("returns the default safe recommendation when there are no records", () => {
    const plan = tonightPlan([]);

    // Default fallback is buildSafeSleepWindow("22:30", "06:30")
    expect(plan.bedtime).toBe("22:30");
    expect(plan.wakeUpTime).toBe("06:30");
  });
});
