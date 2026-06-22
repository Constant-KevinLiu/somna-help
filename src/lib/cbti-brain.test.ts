import test from "node:test";
import assert from "node:assert/strict";

import { buildSafeSleepWindow } from "./cbti-brain";
import { tonightPlan, type SleepRecord } from "./sleep-records";

test("buildSafeSleepWindow replaces unrealistically early bedtimes", () => {
  const result = buildSafeSleepWindow("19:00", "07:00");

  assert.equal(result.bedtime, "22:00");
  assert.equal(result.wakeUpTime, "07:00");
  assert.equal(result.timeInBedMinutes, 9 * 60);
});

test("buildSafeSleepWindow clamps early wake times and bounds sleep window", () => {
  const result = buildSafeSleepWindow("22:00", "04:00");

  assert.equal(result.wakeUpTime, "06:00");
  assert.equal(result.timeInBedMinutes, 8 * 60);
});

test("tonightPlan returns the default safe recommendation when there are no records", () => {
  const plan = tonightPlan([]);

  assert.deepEqual(plan, { bedtime: "22:30", wakeUpTime: "06:30" });
});
