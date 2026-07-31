
import { describe, it, expect } from "vitest";

import { buildReminderRecord } from "./reminder-model";

describe("buildReminderRecord", () => {
  it("normalizes email and defaults timezone/language", () => {
    const record = buildReminderRecord({
      email: " User@Example.com ",
      enabled: true,
      time: "22:30",
      timezone: "America/New_York",
      language: "en",
    });

    // Email should be trimmed and lowercased
    expect(record.email).toBe("user@example.com");
    // Enabled flag should be preserved
    expect(record.enabled).toBe(true);
    // Time should be preserved
    expect(record.reminderTime).toBe("22:30");
    // Timezone should be preserved
    expect(record.timezone).toBe("America/New_York");
    // Language should be normalized
    expect(record.language).toBe("en");
  });
});
