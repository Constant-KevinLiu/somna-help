/**
 * WheelPhysics — independent physics calculations for the Somna WheelEngine.
 *
 * Handles velocity tracking, momentum projection, friction deceleration,
 * acceleration curves, and snap-destination selection. All operations are
 * pure (no DOM, no side effects) so they can be unit tested deterministically.
 */

export interface WheelPhysicsConfig {
  /** Height of a single item in pixels. */
  itemHeight: number;
  /** Number of logical items in the wheel. */
  itemCount: number;
  /** Friction coefficient (0..1); higher = faster stop. */
  friction: number;
  /** Minimum velocity (px/ms) required to enter momentum. */
  minVelocity: number;
  /** Maximum velocity (px/ms) allowed during momentum. */
  maxVelocity: number;
  /** Snap animation duration in ms. */
  snapDuration: number;
  /** Whether the wheel loops infinitely. */
  loop: boolean;
}

export const DEFAULT_PHYSICS: WheelPhysicsConfig = {
  itemHeight: 48,
  itemCount: 60,
  friction: 0.92,
  minVelocity: 0.15,
  maxVelocity: 2.5,
  snapDuration: 160,
  loop: true,
};

/** Clamp a value between min and max (inclusive). */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/** Normalize an index for a looping wheel. */
export function normalizeIndex(index: number, itemCount: number): number {
  if (itemCount <= 0) return 0;
  return ((index % itemCount) + itemCount) % itemCount;
}

/** Convert a pixel offset to the nearest item index. */
export function offsetToIndex(offset: number, itemHeight: number): number {
  if (itemHeight <= 0) return 0;
  const raw = -offset / itemHeight;
  const rounded = Math.round(raw);
  // Eliminate negative zero.
  return rounded === 0 ? 0 : rounded;
}

/** Convert an item index to its target pixel offset. */
export function indexToOffset(index: number, itemHeight: number): number {
  const offset = -index * itemHeight;
  return offset === 0 ? 0 : offset;
}

/**
 * Project the final offset after applying momentum with exponential decay.
 * Returns the projected final offset and the expected duration (ms).
 */
export function projectMomentum(
  velocity: number,
  config: Pick<WheelPhysicsConfig, "friction" | "itemHeight">,
): { distance: number; duration: number } {
  const { friction } = config;
  if (friction <= 0 || friction >= 1 || Math.abs(velocity) < 0.001) {
    return { distance: 0, duration: 0 };
  }
  // Sum of geometric series: d = v * (1 - f^n) / (1 - f) per ms.
  // Approximate continuous decay with integral.
  const duration = Math.log(0.05 / Math.max(Math.abs(velocity), 0.001)) / Math.log(friction);
  const distance = (velocity * (1 - Math.pow(friction, duration))) / (1 - friction);
  return { distance, duration: Math.max(0, duration) };
}

/** Compute the nearest valid snap index for a given offset. */
export function computeSnapIndex(
  offset: number,
  config: Pick<WheelPhysicsConfig, "itemHeight" | "itemCount" | "loop">,
): number {
  const { itemHeight, itemCount, loop } = config;
  const index = offsetToIndex(offset, itemHeight);
  if (loop) return normalizeIndex(index, itemCount);
  return clamp(index, 0, Math.max(0, itemCount - 1));
}

/** Distance between two indices on a looping wheel. */
function loopDistance(a: number, b: number, itemCount: number): number {
  const diff = ((b - a) % itemCount) + itemCount;
  const d = diff % itemCount;
  return d > itemCount / 2 ? d - itemCount : d;
}

/** Compute the snap destination offset for a given index. */
export function computeSnapOffset(
  index: number,
  config: Pick<WheelPhysicsConfig, "itemHeight" | "itemCount" | "loop">,
): number {
  const { itemHeight, itemCount, loop } = config;
  if (loop) {
    return indexToOffset(normalizeIndex(index, itemCount), itemHeight);
  }
  return indexToOffset(clamp(index, 0, Math.max(0, itemCount - 1)), itemHeight);
}

/**
 * Compute the nearest snap destination accounting for momentum.
 * For finite wheels the destination is clamped to bounds.
 * For looping wheels the destination is normalized.
 */
export function computeMomentumDestination(
  currentOffset: number,
  velocity: number,
  config: WheelPhysicsConfig,
): { targetIndex: number; targetOffset: number; duration: number } {
  const { friction, itemHeight, itemCount, loop, snapDuration, minVelocity } = config;

  if (Math.abs(velocity) < minVelocity) {
    const currentIndex = offsetToIndex(currentOffset, itemHeight);
    const targetIndex = loop
      ? normalizeIndex(currentIndex, itemCount)
      : clamp(currentIndex, 0, Math.max(0, itemCount - 1));
    return {
      targetIndex,
      targetOffset: computeSnapOffset(targetIndex, { itemHeight, itemCount, loop }),
      duration: snapDuration,
    };
  }

  const { distance, duration: momentumDuration } = projectMomentum(velocity, {
    friction,
    itemHeight,
  });
  const rawTarget = currentOffset + distance;

  let targetIndex = offsetToIndex(rawTarget, itemHeight);
  if (loop) {
    const currentIdx = normalizeIndex(offsetToIndex(currentOffset, itemHeight), itemCount);
    targetIndex = normalizeIndex(targetIndex, itemCount);
    // Pick the loop direction that matches the swipe when at the boundary.
    const dist = loopDistance(currentIdx, targetIndex, itemCount);
    targetIndex = normalizeIndex(currentIdx + dist, itemCount);
  } else {
    targetIndex = clamp(targetIndex, 0, Math.max(0, itemCount - 1));
  }

  return {
    targetIndex,
    targetOffset: computeSnapOffset(targetIndex, { itemHeight, itemCount, loop }),
    duration: Math.min(Math.max(momentumDuration, snapDuration), 750),
  };
}

/** Ease-out cubic for snap animations. */
export function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - clamp(t, 0, 1), 3);
}

/** Simple exponential moving average for smoothing pointer velocity. */
export function smoothVelocity(prev: number, current: number, alpha = 0.7): number {
  return prev * alpha + current * (1 - alpha);
}

/** Clamp velocity to the configured maximum. */
export function clampVelocity(velocity: number, maxVelocity: number): number {
  return clamp(velocity, -maxVelocity, maxVelocity);
}
