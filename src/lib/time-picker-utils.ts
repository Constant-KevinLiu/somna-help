/**
 * Pure helpers for the Somna TimeWheelPicker.
 *
 * All functions work with "HH:MM" strings in 24-hour format. UI formatting
 * (12h vs 24h, AM/PM) is handled at presentation time based on locale.
 */

/** Parse a 24-hour "HH:MM" string into hours and minutes. */
export function parseTime(value: string): { h: number; m: number } {
  const [h = 0, m = 0] = value.split(":").map((v) => Number.parseInt(v, 10));
  return {
    h: Number.isNaN(h) ? 0 : h,
    m: Number.isNaN(m) ? 0 : m,
  };
}

/** Format hours and minutes into a 24-hour "HH:MM" string. */
export function formatTime(h: number, m: number): string {
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/** Clamp a value between min and max (inclusive). */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/** Round an index to the nearest integer, biased toward 0 for ties. */
export function snapIndex(value: number): number {
  return Math.round(value);
}

/** Convert a 24-hour value into a localized display label. */
export function formatLocaleTime(
  hhmm: string,
  locale: string,
  options?: { hour12?: boolean },
): string {
  const { h, m } = parseTime(hhmm);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d.toLocaleTimeString(locale, {
    hour: "numeric",
    minute: "2-digit",
    hour12: options?.hour12,
  });
}

/** Determine whether a locale prefers 12-hour time by default. */
export function localePrefers12Hour(locale: string): boolean {
  const d = new Date();
  d.setHours(13, 0, 0, 0);
  const formatted = d.toLocaleTimeString(locale, {
    hour: "numeric",
    minute: "2-digit",
  });
  return formatted.includes("PM") || formatted.includes("p. m.") || formatted.includes("下午");
}

/**
 * Return the locale-specific AM/PM labels for 12-hour time pickers.
 * Falls back to "AM"/"PM" if the formatter does not expose dayPeriod parts.
 */
export function getLocalePeriodLabels(locale: string): { am: string; pm: string } {
  const amDate = new Date(2000, 0, 1, 0, 0, 0);
  const pmDate = new Date(2000, 0, 1, 12, 0, 0);
  const fmt = new Intl.DateTimeFormat(locale, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  function extractPeriod(d: Date): string {
    for (const part of fmt.formatToParts(d)) {
      if (part.type === "dayPeriod") return part.value;
    }
    return d.getHours() >= 12 ? "PM" : "AM";
  }

  return { am: extractPeriod(amDate), pm: extractPeriod(pmDate) };
}
