"use client";

/**
 * WheelSound — soft click feedback for the time picker.
 *
 * Plays the iPhone-native wheel detent tick whenever a column crosses a
 * detent. Sound follows the *device* system audio state — when the OS /
 * ringer / media output is muted the tick is suppressed. There is no
 * in-page mute switch; volume control belongs entirely to the device.
 *
 * Unified detection across phone / tablet / PC:
 *  - The underlying <audio> element already routes through the OS output, so
 *    a zero system or media volume is silent natively.
 *  - For tablets & phones (iOS / iPadOS) the Silent / Ring switch suspends
 *    the Web Audio clock; we probe that to suppress ticks when muted.
 *  - Where available, an explicitly paused MediaSession also indicates the
 *    device audio is off.
 */

// iPhone-native time-picker wheel tick: short, bright, transparent.
const CLICK_URL = "data:audio/wav;base64,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";

let clickAudio: HTMLAudioElement | null = null;

// Shared AudioContext used purely to probe the device's audio-clock state
// (iOS Silent mode pauses it). It is never used to emit sound.
let audioCtx: AudioContext | null = null;
let ctxProbed = false;
let ctxMuted = false;

export interface WheelSound {
  play: () => void;
}

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    try {
      audioCtx = new Ctor();
    } catch {
      return null;
    }
  }
  return audioCtx;
}

// Best-effort, device-agnostic detection of system mute (phone / tablet /
// PC). The first tick is always allowed (the <audio> element already honors
// the OS volume); afterwards we treat a Web Audio context that never left the
// "suspended" state as muted (iOS / iPadOS Silent mode), and honor an
// explicitly paused MediaSession.
function systemAudioMuted(): boolean {
  if (typeof navigator !== "undefined" && navigator.mediaSession) {
    if (navigator.mediaSession.playbackState === "paused") return true;
  }
  const ctx = getAudioContext();
  if (!ctx) return false;
  if (!ctxProbed) {
    ctxProbed = true;
    try {
      void ctx.resume?.();
    } catch {
      /* ignore */
    }
    return false;
  }
  if (ctx.state === "suspended") {
    try {
      void ctx.resume?.();
    } catch {
      /* ignore */
    }
    ctxMuted = true;
  }
  return ctxMuted;
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
    // Follow the device system audio state: skip when muted / silent.
    if (systemAudioMuted()) return;
    ensureAudio();
    if (!clickAudio) return;
    // Re-wind so every detent plays the full tick from the start.
    clickAudio.currentTime = 0;
    void clickAudio.play().catch(() => {
      /* ignore autoplay / OS audio restrictions */
    });
  }

  return {
    play() {
      doPlay();
    },
  };
}
