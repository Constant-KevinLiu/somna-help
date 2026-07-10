import test from "node:test";
import assert from "node:assert/strict";
import { buildReminderRecord } from "./reminder-model";

test("buildReminderRecord normalizes email and defaults timezone/language", () => {
  const record = buildReminderRecord({
    email: " User@Example.com ",
    enabled: true,
    time: "22:30",
    timezone: "America/New_York",
    language: "en",
  });

  assert.equal(record.email, "user@example.com");
  assert.equal(record.emailHash.length, 64);
  assert.equal(record.timezone, "America/New_York");
  assert.equal(record.language, "en");
  assert.equal(record.reminderType, "BEDTIME_REMINDER");
});
