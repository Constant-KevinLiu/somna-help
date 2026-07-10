"use client";

/**
 * WheelHaptics — haptic feedback abstraction for wheel interactions.
 *
 * Current implementation is a no-op on unsupported browsers. The service is
 * intentionally decoupled from WheelEngine so future backends (Vibration API,
 * iOS Haptics, Capacitor, React Native, Electron) can be added without
 * touching the core engine.
 */

export interface HapticBackend {
  trigger: () => void;
  isAvailable: () => boolean;
}

const vibrationBackend: HapticBackend = {
  trigger() {
    if (typeof navigator === "undefined" || !("vibrate" in navigator)) return;
    try {
      navigator.vibrate(8);
    } catch {
      /* ignore unsupported vibrators */
    }
  },
  isAvailable() {
    return typeof navigator !== "undefined" && "vibrate" in navigator;
  },
};

export interface WheelHapticsConfig {
  /** Optional custom backend (e.g. Capacitor Haptics). */
  backend?: HapticBackend;
  /** Minimum interval between haptic triggers in ms. */
  minIntervalMs?: number;
}

export interface WheelHaptics {
  trigger: () => void;
  setBackend: (backend: HapticBackend) => void;
}

export function createWheelHaptics(config?: WheelHapticsConfig): WheelHaptics {
  let backend = config?.backend ?? vibrationBackend;
  const minIntervalMs = config?.minIntervalMs ?? 60;
  let lastTrigger = 0;

  function trigger() {
    if (!backend.isAvailable()) return;
    const now = performance.now();
    if (now - lastTrigger < minIntervalMs) return;
    lastTrigger = now;
    backend.trigger();
  }

  return {
    trigger,
    setBackend(next: HapticBackend) {
      backend = next;
    },
  };
}
