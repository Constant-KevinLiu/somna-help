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
  let lastIndex = -1;

  function play() {
    if (!enabled || typeof window === "undefined") return;
    if (!clickAudio) {
      clickAudio = new Audio(CLICK_URL);
      clickAudio.volume = 0.15;
    }
    clickAudio.currentTime = 0;
    void clickAudio.play().catch(() => {
      /* ignore autoplay restrictions */
    });
  }

  return {
    play(index?: number) {
      const currentIndex = typeof index === "number" ? index : -1;
      if (currentIndex !== -1 && currentIndex === lastIndex) return;
      lastIndex = currentIndex;
      play();
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
