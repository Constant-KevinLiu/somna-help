"use client";

/**
 * WheelSound — soft click feedback for the time picker.
 *
 * Plays a short sound only when the selection changes. Degrades gracefully
 * when audio playback is unavailable (autoplay restrictions, muted devices).
 */

const CLICK_URL = "data:audio/wav;base64,UklGRl9vT1BXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU";

let clickAudio: HTMLAudioElement | null = null;

function getSoundEnabled(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const stored = window.localStorage.getItem("somna-time-picker-sound");
    return stored === null ? true : stored === "true";
  } catch {
    return true;
  }
}

export interface WheelSound {
  play: (index?: number) => void;
  setEnabled: (enabled: boolean) => void;
}

export function createWheelSound(): WheelSound {
  let enabled = getSoundEnabled();

  function ensureAudio() {
    if (!clickAudio) {
      clickAudio = new Audio(CLICK_URL);
      clickAudio.volume = 0.08;
    }
  }

  function doPlay() {
    if (typeof window === "undefined") return;
    enabled = getSoundEnabled();
    if (!enabled) return;
    ensureAudio();
    if (!clickAudio) return;
    clickAudio.currentTime = 0;
    void clickAudio.play().catch(() => {
      /* ignore autoplay restrictions */
    });
  }

  return {
    play() {
      doPlay();
    },
    setEnabled(value: boolean) {
      enabled = value;
      if (typeof window === "undefined") return;
      try {
        window.localStorage.setItem("somna-time-picker-sound", String(value));
      } catch {
        /* ignore */
      }
    },
  } as WheelSound;
}
