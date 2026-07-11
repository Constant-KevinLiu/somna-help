"use client";

/**
 * WheelSound — soft click feedback for the time picker.
 *
 * Plays a short, crisp vivo T1-style wheel detent tick whenever the
 * wheel settles onto a new detent. Sound is permanently on (the product
 * requires no mute entry point). Degrades gracefully when audio playback
 * is unavailable (autoplay restrictions, muted devices).
 */

const CLICK_URL = "data:audio/wav;base64,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";

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
