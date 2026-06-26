// Local-only share analytics. No external services.
// Stores share events under a single localStorage key.

const SHARE_EVENTS_KEY = "somna.shareEvents";

export type ShareEventType =
  | "share_click"
  | "download_image"
  | "share_reddit"
  | "share_x"
  | "share_pinterest"
  | "copy_link";

export interface ShareEvent {
  type: ShareEventType;
  context: string; // e.g. "dashboard", "assessment", "calculator", "article"
  url: string;
  timestamp: number;
}

function readEvents(): ShareEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(SHARE_EVENTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeEvents(events: ShareEvent[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SHARE_EVENTS_KEY, JSON.stringify(events));
  } catch {
    /* ignore quota / unavailable */
  }
}

/** Record a share event locally. */
export function trackShare(
  type: ShareEventType,
  context: string,
  url: string = typeof window !== "undefined" ? window.location.href : "",
) {
  const events = readEvents();
  const event: ShareEvent = { type, context, url, timestamp: Date.now() };
  events.push(event);
  writeEvents(events);
}

/** Read all recorded share events (for future dashboards/debugging). */
export function getShareEvents(): ShareEvent[] {
  return readEvents();
}

/** Count events by type. */
export function shareEventCounts(): Record<ShareEventType, number> {
  const events = readEvents();
  const counts: Record<ShareEventType, number> = {
    share_click: 0,
    download_image: 0,
    share_reddit: 0,
    share_x: 0,
    share_pinterest: 0,
    copy_link: 0,
  };
  for (const e of events) {
    counts[e.type] = (counts[e.type] ?? 0) + 1;
  }
  return counts;
}
