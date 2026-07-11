"use client";

/**
 * WheelSound — soft click feedback for the time picker.
 *
 * Plays a short iOS-style tick whenever a wheel settles onto a new
 * detent. Sound is permanently on (the product requires no mute entry
 * point). Degrades gracefully when audio playback is unavailable
 * (autoplay restrictions, muted devices).
 */

const CLICK_URL = "data:audio/wav;base64,UklGRl9vT1BXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU";

let clickAudio: HTMLAudioElement | null = null;

export interface WheelSound {
  play: () => void;
}

export function createWheelSound(): WheelSound {
  function ensureAudio() {
    if (!clickAudio) {
      clickAudio = new Audio(CLICK_URL);
      clickAudio.volume = 0.08;
    }
  }

  function doPlay() {
    if (typeof window === "undefined") return;
    ensureAudio();
    if (!clickAudio) return;
    // Always re-wind so rapid/overlapping ticks replay cleanly.
    clickAudio.currentTime = 0;
    void clickAudio.play().catch(() => {
      /* ignore autoplay restrictions */
    });
  }

  return {
    play() {
      doPlay();
    },
  };
}
