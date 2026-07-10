/**
 * VirtualWheel — virtualized rendering model for infinite wheels.
 *
 * Instead of rendering every possible value, only visible items plus a small
 * buffer are kept in the DOM. As the wheel scrolls, virtual indices are
 * recalculated and existing DOM nodes are reused (repositioned via
 * translate3d).
 *
 * Responsibilities:
 *   - Map logical item indices to virtual DOM slots.
 *   - Compute which items should be visible for a given offset.
 *   - Reuse DOM nodes by updating their transform and content.
 */

export interface VirtualItem {
  /** The index in the underlying logical array. */
  index: number;
  /** The visual value for this slot. */
  value: string;
  /** Absolute Y pixel position in the virtual track. */
  y: number;
  /** Whether this slot is visually centered. */
  selected: boolean;
  /** Distance from center in items (for opacity/scale effects). */
  distance: number;
}

export interface VirtualWheelConfig {
  itemHeight: number;
  visibleCount: number;
  itemCount: number;
  loop: boolean;
  values: readonly string[];
}

export interface VirtualWheelState {
  /** Total number of DOM slots required. */
  slotCount: number;
  /** Items currently visible or in buffer. */
  items: VirtualItem[];
  /** Logical index of the item currently at the center. */
  centerIndex: number;
  /** Normalized center index for looping wheels. */
  normalizedCenterIndex: number;
}

function normalizeIndex(index: number, itemCount: number): number {
  if (itemCount <= 0) return 0;
  return ((index % itemCount) + itemCount) % itemCount;
}

function isValidConfig(config: VirtualWheelConfig): boolean {
  return (
    config.itemHeight > 0 &&
    config.visibleCount > 0 &&
    config.itemCount > 0 &&
    config.values.length === config.itemCount
  );
}

function warnDev(message: string, ...args: unknown[]) {
  try {
    if (import.meta.env?.DEV) {
      console.warn(message, ...args);
    }
  } catch {
    /* import.meta.env may not be available in tests */
  }
}

/**
 * Create a VirtualWheel state manager.
 *
 * The rendered DOM always contains `visibleCount + 2` slots:
 * visible items + one buffer row above + one buffer row below.
 */
export function createVirtualWheel(config: VirtualWheelConfig): {
  update: (offset: number) => VirtualWheelState;
  slotCount: number;
} {
  if (!isValidConfig(config)) {
    // Defensive: never return an empty renderer even with bad config.
    warnDev("[VirtualWheel] invalid config", config);
  }

  const { itemHeight, visibleCount, itemCount, loop, values } = config;
  const slotCount = Math.max(1, visibleCount + 2);

  function update(offset: number): VirtualWheelState {
    const safeItemHeight = itemHeight > 0 ? itemHeight : 1;
    const safeItemCount = Math.max(1, itemCount);
    const centerIndex = Math.round(-offset / safeItemHeight);
    const halfVisible = Math.max(0, Math.floor(visibleCount / 2));
    const startIndex = centerIndex - halfVisible - 1;

    const items: VirtualItem[] = [];
    for (let slot = 0; slot < slotCount; slot++) {
      const index = startIndex + slot;
      const normalizedIndex = normalizeIndex(index, safeItemCount);
      const value = values[normalizedIndex] ?? "";
      const y = index * safeItemHeight;
      const distance = index - centerIndex;
      items.push({
        index,
        value,
        y,
        selected: index === centerIndex,
        distance,
      });
    }

    return {
      slotCount,
      items,
      centerIndex,
      normalizedCenterIndex: normalizeIndex(centerIndex, safeItemCount),
    };
  }

  return { update, slotCount };
}

/** Convert a logical index to a safe display index in a looping wheel. */
export function toDisplayIndex(index: number, itemCount: number): number {
  return normalizeIndex(index, itemCount);
}

/** Determine whether two virtual states represent the same visible set. */
export function virtualStateEqual(a: VirtualWheelState, b: VirtualWheelState): boolean {
  if (a.items.length !== b.items.length) return false;
  return a.items.every((item, i) => item.value === b.items[i]?.value && item.y === b.items[i]?.y);
}
