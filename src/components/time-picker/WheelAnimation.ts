/**
 * WheelAnimation — rAF-based animation scheduler for WheelEngine.
 *
 * This module schedules transform updates on requestAnimationFrame and
 * separates animation callbacks from React render cycles.
 */

import { easeOutCubic } from "./WheelPhysics";

export interface AnimationState {
  startOffset: number;
  targetOffset: number;
  startTime: number;
  duration: number;
  onFrame: (offset: number, progress: number) => void;
  onComplete?: () => void;
}

export interface WheelAnimation {
  animate: (state: AnimationState) => void;
  cancel: () => void;
  isRunning: () => boolean;
}

export function createWheelAnimation(): WheelAnimation {
  let rafId: number | null = null;
  let current: AnimationState | null = null;

  function step(now: number) {
    if (!current) {
      rafId = null;
      return;
    }

    const elapsed = now - current.startTime;
    const progress = Math.min(elapsed / current.duration, 1);
    const eased = easeOutCubic(progress);
    const offset = current.startOffset + (current.targetOffset - current.startOffset) * eased;

    current.onFrame(offset, progress);

    if (progress < 1) {
      rafId = requestAnimationFrame(step);
    } else {
      current.onFrame(current.targetOffset, 1);
      const onComplete = current.onComplete;
      current = null;
      rafId = null;
      onComplete?.();
    }
  }

  return {
    animate(state: AnimationState) {
      if (rafId !== null) cancelAnimationFrame(rafId);
      current = state;
      rafId = requestAnimationFrame(step);
    },
    cancel() {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      current = null;
    },
    isRunning() {
      return rafId !== null;
    },
  };
}
